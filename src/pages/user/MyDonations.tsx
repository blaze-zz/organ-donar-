import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Heart,
  User,
  Clock,
  Eye,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const statusColors = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  approved: 'bg-success/20 text-success border-success/30',
  rejected: 'bg-destructive/20 text-destructive border-destructive/30',
  completed: 'bg-primary/20 text-primary border-primary/30',
  cancelled: 'bg-muted text-muted-foreground border-muted-foreground/30',
};

interface Donation {
  id: string;
  organ_type: string;
  status: string;
  otp_verified: boolean;
  otp_code: string | null;
  notes: string | null;
  created_at: string;
  hospital_id: string | null;
}

export default function MyDonations() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('organ_donations')
        .select('*')
        .eq('donor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="User Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              My Donations
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your organ donations
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/donate">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Donation
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
            <CardDescription>All your registered organ donations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : donations.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No donations yet</h3>
                <p className="text-muted-foreground mb-4">Start making a difference by registering your first donation</p>
                <Button asChild>
                  <Link to="/dashboard/donate">Register Donation</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organ Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>OTP Verified</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium capitalize">{donation.organ_type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[donation.status as keyof typeof statusColors]}>
                          {donation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={donation.otp_verified ? 'default' : 'secondary'}>
                          {donation.otp_verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDonation(donation)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Donation Details Dialog */}
        <Dialog open={!!selectedDonation} onOpenChange={() => setSelectedDonation(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Donation Details</DialogTitle>
              <DialogDescription>
                View complete details of your donation
              </DialogDescription>
            </DialogHeader>
            {selectedDonation && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Organ Type</p>
                    <p className="font-medium capitalize">{selectedDonation.organ_type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="outline" className={statusColors[selectedDonation.status as keyof typeof statusColors]}>
                      {selectedDonation.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">OTP Code</p>
                    <p className="font-mono font-bold text-lg">{selectedDonation.otp_code || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">OTP Verified</p>
                    <Badge variant={selectedDonation.otp_verified ? 'default' : 'secondary'}>
                      {selectedDonation.otp_verified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Registered On</p>
                    <p className="font-medium">{new Date(selectedDonation.created_at).toLocaleString()}</p>
                  </div>
                  {selectedDonation.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="text-sm">{selectedDonation.notes}</p>
                    </div>
                  )}
                </div>
                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Important:</strong> Keep your OTP code safe. It will be required during the organ collection process.
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
