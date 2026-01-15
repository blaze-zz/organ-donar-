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

const urgencyColors = {
  1: 'bg-green-500/20 text-green-600',
  2: 'bg-green-400/20 text-green-500',
  3: 'bg-yellow-500/20 text-yellow-600',
  4: 'bg-orange-500/20 text-orange-600',
  5: 'bg-red-500/20 text-red-600',
};

interface Request {
  id: string;
  organ_type: string;
  status: string;
  urgency_level: number;
  medical_condition: string | null;
  notes: string | null;
  created_at: string;
  hospital_id: string | null;
  assigned_doctor_id: string | null;
}

export default function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('organ_requests')
        .select('*')
        .eq('requester_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyLabel = (level: number) => {
    const labels = ['Very Low', 'Low', 'Medium', 'High', 'Critical'];
    return labels[level - 1] || 'Medium';
  };

  return (
    <DashboardLayout navItems={navItems} title="User Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              My Organ Requests
            </h1>
            <p className="text-muted-foreground mt-1">
              Track the status of your organ requests
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/request">
              <Heart className="w-4 h-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>All your submitted organ requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No requests yet</h3>
                <p className="text-muted-foreground mb-4">Submit your first organ request</p>
                <Button asChild>
                  <Link to="/dashboard/request">Submit Request</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organ Type</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Doctor Assigned</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium capitalize">{request.organ_type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge className={urgencyColors[request.urgency_level as keyof typeof urgencyColors]}>
                          {getUrgencyLabel(request.urgency_level)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[request.status as keyof typeof statusColors]}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={request.assigned_doctor_id ? 'default' : 'secondary'}>
                          {request.assigned_doctor_id ? 'Yes' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
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

        {/* Request Details Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                View complete details of your organ request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Organ Type</p>
                    <p className="font-medium capitalize">{selectedRequest.organ_type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="outline" className={statusColors[selectedRequest.status as keyof typeof statusColors]}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Urgency Level</p>
                    <Badge className={urgencyColors[selectedRequest.urgency_level as keyof typeof urgencyColors]}>
                      {getUrgencyLabel(selectedRequest.urgency_level)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor Assigned</p>
                    <Badge variant={selectedRequest.assigned_doctor_id ? 'default' : 'secondary'}>
                      {selectedRequest.assigned_doctor_id ? 'Yes' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Submitted On</p>
                    <p className="font-medium">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                  </div>
                  {selectedRequest.medical_condition && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Medical Condition</p>
                      <p className="text-sm">{selectedRequest.medical_condition}</p>
                    </div>
                  )}
                  {selectedRequest.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Additional Notes</p>
                      <p className="text-sm">{selectedRequest.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
