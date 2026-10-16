'use client';

import { useAuthStore } from '@/stores/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Shield, Search, Filter, Download } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

const mockAuditLogs = [
  { id: 1, action: 'CREATE', entityType: 'Patient', entityId: 'PAT-001', user: 'Anita Desai', timestamp: '2024-01-20T10:30:00Z', ip: '192.168.1.100' },
  { id: 2, action: 'UPDATE', entityType: 'Appointment', entityId: 'APT-001', user: 'Dr. Arjun Patel', timestamp: '2024-01-20T10:15:00Z', ip: '192.168.1.101' },
  { id: 3, action: 'LOGIN', entityType: 'User', entityId: 'USER-001', user: 'Dr. Sneha Reddy', timestamp: '2024-01-20T09:00:00Z', ip: '192.168.1.102' },
  { id: 4, action: 'DELETE', entityType: 'Photo', entityId: 'PHO-001', user: 'Meera Nair', timestamp: '2024-01-20T08:45:00Z', ip: '192.168.1.103' },
];

export default function AuditPage() {
  const { hasRole } = useAuthStore();
  const canView = hasRole(['OWNER', 'ADMIN']);

  if (!canView) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground mt-2">You don't have permission to view audit logs.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">System activity and data access trail</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Search className="mr-2 h-4 w-4" /> Search</Button>
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAuditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant={log.action === 'CREATE' ? 'success' : log.action === 'UPDATE' ? 'default' : log.action === 'DELETE' ? 'destructive' : 'secondary'}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.entityType}</TableCell>
                  <TableCell className="font-mono">{log.entityId}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}