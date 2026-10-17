'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useAppointments, Appointment } from '@/hooks/useAppointments';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Plus, Calendar, Clock, Search, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

const STATUS_COLORS: Record<string, string> = {
  BOOKED: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CHECKED_IN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-orange-100 text-orange-800',
};

export default function AppointmentsPage() {
  const { hasRole } = useAuthStore();
  const canCreate = hasRole(['OWNER', 'ADMIN', 'RECEPTIONIST']);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error, refetch } = useAppointments({
    search: debouncedSearch,
    page,
    perPage: 20,
    from: selectedDate,
    to: selectedDate,
    sortBy: 'startTime',
    sortOrder: 'asc',
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setPage(1);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">Manage clinic appointments</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-red-500">
            Failed to load appointments. Please try again.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage clinic appointments</p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-48"
            disabled={isLoading}
          />
          {canCreate && (
            <Button onClick={() => alert('Book Appointment - Navigate to /appointments/new')}>
              <Plus className="mr-2 h-4 w-4" /> Book Appointment
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's Appointments</CardTitle>
            <Input
              placeholder="Search appointments..."
              className="w-64"
              value={search}
              onChange={handleSearch}
              disabled={isLoading}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {data?.data.map((apt: Appointment) => (
                  <div key={apt.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Unknown Patient'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {apt.procedureType ?? 'General'} • Dr. {apt.doctor?.lastName ?? ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-medium">
                        {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[apt.status] ?? 'bg-gray-100 text-gray-800'}`}>
                      {apt.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>

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
                      <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.meta.page === data.meta.totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next <ArrowRight className="h-4 w-4 ml-1" />
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