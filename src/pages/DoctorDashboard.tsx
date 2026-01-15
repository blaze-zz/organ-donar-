import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Heart,
  CheckCircle,
  Clock,
  User,
  Activity,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor' },
  { icon: FileText, label: 'New Requests', href: '/doctor/new-requests' },
  { icon: Activity, label: 'Update Requests', href: '/doctor/update-requests' },
  { icon: Heart, label: 'Organ Collection', href: '/doctor/collections' },
  { icon: User, label: 'My Profile', href: '/doctor/profile' },
];

interface DoctorStats {
  assignedDonations: number;
  assignedRequests: number;
  pendingActions: number;
  completedActions: number;
}

const statusColors = {
  pending: 'bg-warning/20 text-warning',
  approved: 'bg-success/20 text-success',
  rejected: 'bg-destructive/20 text-destructive',
  completed: 'bg-primary/20 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DoctorStats>({
    assignedDonations: 0,
    assignedRequests: 0,
    pendingActions: 0,
    completedActions: 0,
  });
  const [assignedDonations, setAssignedDonations] = useState<any[]>([]);
  const [assignedRequests, setAssignedRequests] = useState<any[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDoctorData();
    }
  }, [user]);

  const fetchDoctorData = async () => {
    try {
      // Get doctor record
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (doctorData) {
        setDoctorId(doctorData.id);

        // Fetch assigned donations
        const { data: donations } = await supabase
          .from('organ_donations')
          .select('*')
          .eq('assigned_doctor_id', doctorData.id)
          .order('created_at', { ascending: false });

        // Fetch assigned requests
        const { data: requests } = await supabase
          .from('organ_requests')
          .select('*')
          .eq('assigned_doctor_id', doctorData.id)
          .order('created_at', { ascending: false });

        const allDonations = donations || [];
        const allRequests = requests || [];

        setAssignedDonations(allDonations.slice(0, 5));
        setAssignedRequests(allRequests.slice(0, 5));

        setStats({
          assignedDonations: allDonations.length,
          assignedRequests: allRequests.length,
          pendingActions: [...allDonations, ...allRequests].filter(i => i.status === 'pending').length,
          completedActions: [...allDonations, ...allRequests].filter(i => i.status === 'completed').length,
        });
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Doctor Panel">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Welcome, Dr. {user?.fullName?.split(' ').slice(-1)[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your assigned organ donations and requests.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/doctor/new-requests">
                <FileText className="w-4 h-4 mr-2" />
                View New Requests
              </Link>
            </Button>
            <Button asChild>
              <Link to="/doctor/collections">
                <Heart className="w-4 h-4 mr-2" />
                Organ Collections
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Assigned Donations"
            value={stats.assignedDonations}
            icon={Heart}
            variant="primary"
          />
          <StatCard
            title="Assigned Requests"
            value={stats.assignedRequests}
            icon={FileText}
            variant="accent"
          />
          <StatCard
            title="Pending Actions"
            value={stats.pendingActions}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Completed"
            value={stats.completedActions}
            icon={CheckCircle}
            variant="success"
          />
        </div>

        {/* Assigned Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Donations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assigned Donations</CardTitle>
                <CardDescription>Organ collections assigned to you</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/doctor/collections">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {assignedDonations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No donations assigned yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedDonations.map((donation) => (
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

          {/* Assigned Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assigned Requests</CardTitle>
                <CardDescription>Organ requests assigned to you</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/doctor/update-requests">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {assignedRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No requests assigned yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedRequests.map((request) => (
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
