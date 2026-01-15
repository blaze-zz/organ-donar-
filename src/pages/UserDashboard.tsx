import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Heart,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: PlusCircle, label: 'Donate Organ', href: '/dashboard/donate' },
  { icon: FileText, label: 'My Donations', href: '/dashboard/my-donations' },
  { icon: Heart, label: 'Request Organ', href: '/dashboard/request' },
  { icon: Clock, label: 'My Requests', href: '/dashboard/my-requests' },
  { icon: User, label: 'My Profile', href: '/dashboard/profile' },
];

interface DonationStats {
  totalDonations: number;
  pendingDonations: number;
  approvedDonations: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
}

const statusColors = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  approved: 'bg-success/20 text-success border-success/30',
  rejected: 'bg-destructive/20 text-destructive border-destructive/30',
  completed: 'bg-primary/20 text-primary border-primary/30',
  cancelled: 'bg-muted text-muted-foreground border-muted-foreground/30',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    pendingDonations: 0,
    approvedDonations: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
  });
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch donations
      const { data: donations } = await supabase
        .from('organ_donations')
        .select('*')
        .eq('donor_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch requests
      const { data: requests } = await supabase
        .from('organ_requests')
        .select('*')
        .eq('requester_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (donations) {
        setRecentDonations(donations);
        setStats(prev => ({
          ...prev,
          totalDonations: donations.length,
          pendingDonations: donations.filter(d => d.status === 'pending').length,
          approvedDonations: donations.filter(d => d.status === 'approved').length,
        }));
      }

      if (requests) {
        setRecentRequests(requests);
        setStats(prev => ({
          ...prev,
          totalRequests: requests.length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          approvedRequests: requests.filter(r => r.status === 'approved').length,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="User Dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Welcome back, {user?.fullName?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your organ donation activity.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/dashboard/request">
                <Heart className="w-4 h-4 mr-2" />
                Request Organ
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/donate">
                <PlusCircle className="w-4 h-4 mr-2" />
                Donate Organ
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Donations"
            value={stats.totalDonations}
            icon={Heart}
            variant="primary"
          />
          <StatCard
            title="Pending Donations"
            value={stats.pendingDonations}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Total Requests"
            value={stats.totalRequests}
            icon={FileText}
            variant="accent"
          />
          <StatCard
            title="Approved Requests"
            value={stats.approvedRequests}
            icon={CheckCircle}
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
                <CardDescription>Your latest organ donations</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/my-donations">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentDonations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No donations yet</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link to="/dashboard/donate">Make your first donation</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">{donation.organ_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusColors[donation.status as keyof typeof statusColors]}>
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
                <CardDescription>Your organ request status</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/my-requests">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No requests yet</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link to="/dashboard/request">Submit a request</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">{request.organ_type}</p>
                          <p className="text-sm text-muted-foreground">
                            Urgency: Level {request.urgency_level}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusColors[request.status as keyof typeof statusColors]}>
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
