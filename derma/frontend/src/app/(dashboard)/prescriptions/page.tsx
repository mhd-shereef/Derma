'use client';

import { useAuthStore } from '@/stores/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, FileText, Pill, Package, CreditCard } from 'lucide-react';

export default function PrescriptionsPage() {
  const { hasRole } = useAuthStore();
  const canCreate = hasRole(['OWNER', 'ADMIN', 'DOCTOR']);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">Manage prescriptions and regimens</p>
        </div>
        {canCreate && <Button><Plus className="mr-2 h-4 w-4" /> New Prescription</Button>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Create Prescription</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full"><FileText className="mr-2 h-4 w-4" /> New Prescription</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saved Regimens</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline"><Pill className="mr-2 h-4 w-4" /> View Regimens</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Print Prescription</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline"><CreditCard className="mr-2 h-4 w-4" /> Print Template</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}