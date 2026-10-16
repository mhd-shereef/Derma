'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useQueue, Appointment } from '@/hooks/useAppointments';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader2, AlertCircle, User, Clock, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';
import { formatTime, formatRelativeTime } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

const STATUS_COLORS: Record<string, string> = {
  CHECKED_IN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
};

export default function QueuePage() {
  const { hasRole, user } = useAuthStore();
  const canReorder = hasRole(['OWNER', 'ADMIN', 'RECEPTIONIST']);
  const isDoctor = hasRole(['DOCTOR']);
  const [doctorId, setDoctorId] = useState(user?.id ?? '');
  const [queue, setQueue] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: queueData, isLoading: queueLoading, refetch } = useQueue(
    doctorId || undefined,
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (queueData) {
      setQueue(queueData);
      setIsLoading(false);
    }
  }, [queueData]);

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newQueue = [...queue];
    const [moved] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, moved);
    setQueue(newQueue);

    try {
      await fetch('/api/appointments/queue/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentIds: newQueue.map(a => a.id) }),
      });
    } catch {
      refetch();
    }
  };

  const moveUp = (index: number) => {
    if (index > 0) handleReorder(index, index - 1);
  };

  const moveDown = (index: number) => {
    if (index < queue.length - 1) handleReorder(index, index + 1);
  };

  const startVisit = (appointmentId: string) => {
    // In real app, this would call an API to start the visit
    console.log('Start visit for:', appointmentId);
  };

  if (queueLoading && isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Queue Board</h1>
            <p className="text-muted-foreground">Real-time patient queue</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Queue Board</h1>
          <p className="text-muted-foreground">Real-time patient queue</p>
        </div>
        <div className="flex items-center gap-4">
          {user?.role === 'DOCTOR' && (
            <span className="text-sm text-muted-foreground">Your queue</span>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patients Waiting</CardTitle>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No patients in queue</p>
              <p className="text-sm">Patients will appear here when checked in</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((apt, index) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-card"
                >
                  <div className="flex-shrink-0 w-8 text-center text-muted-foreground font-medium">
                    {index + 1}
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Unknown Patient'}
                        <span className="ml-2 text-sm text-muted-foreground">({apt.patient?.patientNumber ?? ''})</span>
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {apt.procedureType ?? 'General'} • Dr. {apt.doctor?.lastName ?? ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-mono text-sm">{formatTime(apt.startTime)}</p>
                      <p className="text-xs text-muted-foreground">
                        {apt.checkInTime ? `Checked in ${formatRelativeTime(apt.checkInTime)}` : 'Not checked in'}
                      </p>
                    </div>

                    <Badge className={STATUS_COLORS[apt.status] ?? 'bg-gray-100 text-gray-800'}>
                      {apt.status.replace('_', ' ')}
                    </Badge>

                    {canReorder && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveDown(index)}
                          disabled={index === queue.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {isDoctor && apt.status === 'CHECKED_IN' && (
                      <Button size="sm" onClick={() => startVisit(apt.id)}>
                        Start Visit
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}