'use client';

import { useAuthStore } from '@/stores/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, CreditCard, Receipt, FileText, DollarSign } from 'lucide-react';

export default function BillingPage() {
  const { hasRole } = useAuthStore();
  const canCreate = hasRole(['OWNER', 'ADMIN', 'RECEPTIONIST']);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">Invoices and payments</p>
        </div>
        {canCreate && <Button><Plus className="mr-2 h-4 w-4" /> New Invoice</Button>}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full"><CreditCard className="mr-2 h-4 w-4" /> New Invoice</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline"><DollarSign className="mr-2 h-4 w-4" /> Record Payment</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Print Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline"><Receipt className="mr-2 h-4 w-4" /> Print Receipt</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline"><FileText className="mr-2 h-4 w-4" /> View History</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}