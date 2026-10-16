'use client';

import { useAuthStore } from '@/stores/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, Calendar, CreditCard, Stethoscope } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';

const stats = [
  {
    name: "Today's Appointments",
    value: '12',
    change: '+2 from yesterday',
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
  },
  {
    name: 'Total Patients',
    value: '1,234',
    change: '+5% this month',
    icon: Users,
    color: 'text-green-500',
    bg: 'bg-green-100',
  },
  {
    name: "Today's Revenue",
    value: formatCurrency(45000),
    change: '+12% vs last week',
    icon: CreditCard,
    color: 'text-purple-500',
    bg: 'bg-purple-100',
  },
  {
    name: 'Active Doctors',
    value: '4',
    change: '2 on leave',
    icon: Stethoscope,
    color: 'text-orange-500',
    bg: 'bg-orange-100',
  },
];

const recentActivity = [
  { id: 1, type: 'appointment', message: 'New appointment booked', patient: 'Priya Sharma', time: '10:30 AM', status: 'confirmed' },
  { id: 2, type: 'payment', message: 'Payment received', patient: 'Rajesh Kumar', amount: '₹15,000', time: '10:15 AM', status: 'completed' },
  { id: 3, type: 'visit', message: 'Visit completed', patient: 'Anita Desai', doctor: 'Dr. Arjun Patel', time: '9:45 AM', status: 'completed' },
  { id: 4, type: 'patient', message: 'New patient registered', patient: 'Vikram Singh', time: '9:30 AM', status: 'new' },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName} • {user?.role}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={cn('h-4 w-4', stat.color, stat.bg, 'p-2 rounded-full')} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {activity.type === 'appointment' ? <Calendar className="h-5 w-5 text-primary" /> : activity.type === 'payment' ? <CreditCard className="h-5 w-5 text-primary" /> : activity.type === 'visit' ? <Stethoscope className="h-5 w-5 text-primary" /> : <Users className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.patient} • {activity.time}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/patients/new" className="p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <p className="mt-2 font-medium">Register Patient</p>
              </Link>
              <Link href="/appointments" className="p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                <Calendar className="h-6 w-6 text-green-500 group-hover:scale-110 transition-transform" />
                <p className="mt-2 font-medium">Book Appointment</p>
              </Link>
              <Link href="/visits" className="p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                <Stethoscope className="h-6 w-6 text-purple-500 group-hover:scale-110 transition-transform" />
                <p className="mt-2 font-medium">Start Visit</p>
              </Link>
              <Link href="/billing" className="p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                <CreditCard className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" />
                <p className="mt-2 font-medium">Generate Invoice</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
