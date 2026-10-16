'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useVisits, Visit } from '@/hooks/useVisits';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Plus, FileText, Search, Loader2, Calendar, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatTime } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

const STATUS_COLORS: Record<string, string> = {
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  SIGNED: 'bg-purple-100 text-purple-800',
  AMENDED: 'bg-orange-100 text-orange-800',
};

export default function VisitsPage() {
  const { hasRole, user } = useAuthStore();
  const canCreate = hasRole(['OWNER', 'ADMIN', 'DOCTOR']);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error } = useVisits({
    search: debouncedSearch,
    page,
    perPage: 20,
    status: statusFilter || undefined,
    doctorId: user?.role === 'DOCTOR' ? user.id : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Visits</h1>
            <p className="text-muted-foreground">Manage patient visits</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-red-500">
            Failed to load visits. Please try again.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visits</h1>
          <p className="text-muted-foreground">Manage patient visits</p>
        </div>
        {canCreate && (
          <Button onClick={() => alert('Start Visit - Navigate to /visits/new')}>
            <Plus className="mr-2 h-4 w-4" /> Start Visit
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Visit List</CardTitle>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search visits..."
                className="w-64"
                value={search}
                onChange={handleSearch}
                disabled={isLoading}
              />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="SIGNED">Signed</option>
                <option value="AMENDED">Amended</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visit #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Chief Complaint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((visit: Visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-mono">{visit.visitNumber}</TableCell>
                      <TableCell>
                        {visit.patient ? (
                          <>
                            <p className="font-medium">{visit.patient.firstName} {visit.patient.lastName}</p>
                            <p className="text-sm text-muted-foreground">{visit.patient.patientNumber}</p>
                          </>
                        ) : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {visit.doctor ? `Dr. ${visit.doctor.lastName}` : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <p>{formatDate(visit.createdAt)}</p>
                        <p className="text-sm text-muted-foreground">{formatTime(visit.createdAt)}</p>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{visit.chiefComplaint ?? '—'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[visit.status] ?? 'bg-gray-100 text-gray-800'}`}>
                          {visit.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/visits/${visit.id}`} className="p-2 hover:bg-muted rounded-lg" title="View">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && data.meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.meta.page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.meta.page === data.meta.totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}