'use client';

import { useAuthStore } from '@/stores/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserPlus, Users, FileText, Package, Stethoscope, Building2, Shield, Bell } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
  const { hasRole, user } = useAuthStore();
  const isAdmin = hasRole(['OWNER', 'ADMIN']);

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground mt-2">You don't have permission to access settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Clinic configuration and preferences</p>
      </div>

      <Tabs defaultValue="clinic" className="w-full">
        <TabsList>
          <TabsTrigger value="clinic">Clinic</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="catalog">Procedures</TabsTrigger>
        </TabsList>

        <TabsContent value="clinic" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Clinic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Clinic Name" defaultValue="Demo Aesthetic Clinic" />
                <Input label="GSTIN" defaultValue="29ABCDE1234F1Z5" />
                <Input label="Phone" defaultValue="+91-80-1234-5678" />
                <Input label="Email" defaultValue="admin@demo-clinic.com" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Staff Management</CardTitle>
              <Button><UserPlus className="mr-2 h-4 w-4" /> Add Staff</Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Staff management page - redirect to /settings/staff</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Procedure Templates</CardTitle>
              <Button><FileText className="mr-2 h-4 w-4" /> New Template</Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Procedure templates - CO2 Laser, Botox, Fillers, Chemical Peels, PRP, Microneedling</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Package Management</CardTitle>
              <Button><Package className="mr-2 h-4 w-4" /> Create Package</Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Package definitions and pricing</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Procedure Catalog</CardTitle>
              <Button><Stethoscope className="mr-2 h-4 w-4" /> Add Procedure</Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Procedure pricing and HSN/SAC codes</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}