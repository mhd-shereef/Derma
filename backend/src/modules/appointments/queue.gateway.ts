import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { Logger } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    tenantId: string;
    role: string;
  };
}

@WebSocketGateway({
  namespace: '/queue',
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(QueueGateway.name);
  private connectedClients: Map<string, AuthenticatedSocket> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token ?? client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production-min-32-chars',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, tenantId: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        this.logger.warn(`Client ${client.id} - invalid user`);
        client.disconnect();
        return;
      }

      client.user = user;
      this.connectedClients.set(client.id, client);

      client.join(`tenant:${user.tenantId}`);
      if (user.role === 'DOCTOR' || user.role === 'NURSE') {
        client.join(`doctor:${user.id}`);
      }

      this.logger.log(`Client ${client.id} connected (${user.email}, ${user.role})`);
    } catch (error) {
      this.logger.error(`Connection error for ${client.id}: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('joinQueue')
  async handleJoinQueue(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { doctorId?: string },
  ) {
    if (!client.user) return { error: 'Not authenticated' };

    const room = data.doctorId ? `queue:${data.doctorId}` : `queue:tenant:${client.user.tenantId}`;
    client.join(room);

    const queue = await this.getQueueForRoom(client.user.tenantId, data.doctorId);
    return { queue };
  }

  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { doctorId?: string },
  ) {
    const room = data.doctorId ? `queue:${data.doctorId}` : `queue:tenant:${client.user?.tenantId}`;
    client.leave(room);
    return { success: true };
  }

  async emitQueueUpdate(tenantId: string, doctorId?: string) {
    const queue = await this.getQueueForRoom(tenantId, doctorId);
    const room = doctorId ? `queue:${doctorId}` : `queue:tenant:${tenantId}`;
    this.server.to(room).emit('queueUpdated', queue);
  }

  async emitAppointmentStatusChange(tenantId: string, appointmentId: string, status: string, doctorId?: string) {
    const room = doctorId ? `queue:${doctorId}` : `queue:tenant:${tenantId}`;
    this.server.to(room).emit('appointmentStatusChanged', { appointmentId, status });
  }

  async emitNewAppointment(tenantId: string, appointment: any, doctorId?: string) {
    const room = doctorId ? `queue:${doctorId}` : `queue:tenant:${tenantId}`;
    this.server.to(room).emit('newAppointment', appointment);
  }

  private async getQueueForRoom(tenantId: string, doctorId?: string) {
    const where: any = {
      tenantId,
      deletedAt: null,
      status: { in: ['CHECKED_IN', 'IN_PROGRESS'] },
    };

    if (doctorId) where.doctorId = doctorId;

    return this.prisma.appointment.findMany({
      where,
      orderBy: [{ status: 'asc' }, { checkInTime: 'asc' }],
      include: {
        patient: {
          select: { id: true, patientNumber: true, firstName: true, lastName: true, phone: true },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  getConnectedClientsCount(tenantId: string): number {
    let count = 0;
    for (const client of this.connectedClients.values()) {
      if (client.user?.tenantId === tenantId) count++;
    }
    return count;
  }
}