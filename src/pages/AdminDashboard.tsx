import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Hospital,
  Heart,
  FileText,
  Activity,
  Settings,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: UserPlus, label: 'Add Doctor', href: '/admin/add-doctor' },
  { icon: Users, label: 'View Doctors', href: '/admin/doctors' },
  { icon: Hospital, label: 'Manage Hospitals', href: '/admin/hospitals' },
  { icon: FileText, label: 'Organ Requests', href: '/admin/requests' },
  { icon: Heart, label: 'Organ Donations', href: '/admin/donations' },
  { icon: Activity, label: 'Organ Inventory', href: '/admin/inventory' },
  { icon: Users, label: 'View Users', href: '/admin/users' },
];

interface AdminStats {
  totalDoctors: number;
  totalHospitals: number;
  totalDonations: number;
  totalRequests: number;
  pendingDonations: number;
  pendingRequests: number;
}

const statusColors = {
  pending: 'bg-warning/20 text-warning',
  approved: 'bg-success/20 text-success',
  rejected: 'bg-destructive/20 text-destructive',
  completed: 'bg-primary/20 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalDoctors: 0,
    totalHospitals: 0,
    totalDonations: 0,
    totalRequests: 0,
    pendingDonations: 0,
    pendingRequests: 0,
  });
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch counts
      const [doctorsRes, hospitalsRes, donationsRes, requestsRes] = await Promise.all([
        supabase.from('doctors').select('id', { count: 'exact', head: true }),
        supabase.from('hospitals').select('id', { count: 'exact', head: true }),
        supabase.from('organ_donations').select('id, status', { count: 'exact' }),
        supabase.from('organ_requests').select('id, status', { count: 'exact' }),
      ]);

      // Fetch recent items
      const [recentDonationsRes, recentRequestsRes] = await Promise.all([
        supabase.from('organ_donations').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('organ_requests').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      const donations = donationsRes.data || [];
      const requests = requestsRes.data || [];

      setStats({
        totalDoctors: doctorsRes.count || 0,
        totalHospitals: hospitalsRes.count || 0,
        totalDonations: donations.length,
        totalRequests: requests.length,
        pendingDonations: donations.filter(d => d.status === 'pending').length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
      });

      setRecentDonations(recentDonationsRes.data || []);
      setRecentRequests(recentRequestsRes.data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Admin Panel">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage the organ donor network from here.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/admin/hospitals">
                <Hospital className="w-4 h-4 mr-2" />
                Add Hospital
              </Link>
            </Button>
            <Button asChild>
              <Link to="/admin/add-doctor">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Doctor
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Doctors"
            value={stats.totalDoctors}
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Partner Hospitals"
            value={stats.totalHospitals}
            icon={Hospital}
            variant="accent"
          />
          <StatCard
            title="Pending Donations"
            value={stats.pendingDonations}
            icon={Heart}
            variant="warning"
          />
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={FileText}
            variant="success"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Donations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Latest organ donation submissions</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/donations">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentDonations.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No donations yet</p>
              ) : (
                <div className="space-y-4">
                  {recentDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium capitalize">{donation.organ_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={statusColors[donation.status as keyof typeof statusColors]}>
                        {donation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Latest organ request submissions</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/requests">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentRequests.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No requests yet</p>
              ) : (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium capitalize">{request.organ_type}</p>
                        <p className="text-sm text-muted-foreground">
                          Urgency: Level {request.urgency_level}
                        </p>
                      </div>
                      <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
