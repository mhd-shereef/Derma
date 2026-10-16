'use client';

import { useAuthStore } from '@/stores/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart3, Download, TrendingUp, Users, CreditCard, Package } from 'lucide-react';

export default function ReportsPage() {
  const { hasRole } = useAuthStore();
  const canView = hasRole(['OWNER', 'ADMIN']);

  if (!canView) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground mt-2">You don't have permission to view reports.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Clinic performance insights</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full"><TrendingUp className="mr-2 h-4 w-4" /> View Revenue</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Patient Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full"><Users className="mr-2 h-4 w-4" /> View Patients</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Collection Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full"><CreditCard className="mr-2 h-4 w-4" /> View Collections</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Procedure Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full"><BarChart3 className="mr-2 h-4 w-4" /> View Procedures</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Package Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full"><Package className="mr-2 h-4 w-4" /> View Packages</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}