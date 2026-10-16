'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { usePatients, Patient } from '@/hooks/usePatients';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Plus, Search, Eye, Edit, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

export default function PatientsPage() {
  const { hasRole } = useAuthStore();
  const canCreate = hasRole(['OWNER', 'ADMIN', 'RECEPTIONIST']);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error, refetch } = usePatients({
    search: debouncedSearch,
    page,
    perPage: 20,
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
            <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
            <p className="text-muted-foreground">Manage patient records</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-red-500">
            Failed to load patients. Please try again.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage patient records</p>
        </div>
        {canCreate && (
          <Link href="/patients/new">
            <Button><Plus className="mr-2 h-4 w-4" /> Register Patient</Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Patient List</CardTitle>
            <Input
              placeholder="Search patients..."
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((patient: Patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-mono">{patient.patientNumber}</TableCell>
                      <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.gender ?? '—'}</TableCell>
                      <TableCell>{patient.dateOfBirth ? formatDate(patient.dateOfBirth) : '—'}</TableCell>
                      <TableCell>{formatDate(patient.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/patients/${patient.id}`} className="p-2 hover:bg-muted rounded-lg" title="View">
                            <Eye className="h-4 w-4" />
                          </Link>
                          {canCreate && (
                            <Link href={`/patients/${patient.id}/edit`} className="p-2 hover:bg-muted rounded-lg" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Link>
                          )}
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