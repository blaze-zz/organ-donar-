import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Hospital,
  Heart,
  FileText,
  Activity,
  Loader2,
  Eye,
  UserCheck,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

const statusColors = {
  pending: 'bg-warning/20 text-warning',
  approved: 'bg-success/20 text-success',
  rejected: 'bg-destructive/20 text-destructive',
  completed: 'bg-primary/20 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
};

interface RequestData {
  id: string;
  organ_type: string;
  status: string;
  urgency_level: number;
  medical_condition: string | null;
  notes: string | null;
  created_at: string;
  requester_id: string;
  assigned_doctor_id: string | null;
}

interface DoctorOption {
  id: string;
  profiles: { full_name: string } | null;
  specialization: string | null;
}

export default function ManageRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, doctorsRes] = await Promise.all([
        supabase.from('organ_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('doctors').select('id, specialization, user_id').eq('is_active', true),
      ]);

      if (requestsRes.error) throw requestsRes.error;
      setRequests(requestsRes.data || []);

      // Fetch doctor profiles
      if (doctorsRes.data) {
        const doctorProfiles = await Promise.all(
          doctorsRes.data.map(async (doc) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('user_id', doc.user_id)
              .single();
            return { ...doc, profiles: profile };
          })
        );
        setDoctors(doctorProfiles);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = (request: RequestData) => {
    setSelectedRequest(request);
    setSelectedDoctor(request.assigned_doctor_id || '');
    setSelectedStatus(request.status);
    setAssignDialogOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!selectedRequest) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('organ_requests')
        .update({
          assigned_doctor_id: selectedDoctor || null,
          status: selectedStatus as any,
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast({
        title: 'Request Updated',
        description: 'The organ request has been updated successfully.',
      });

      setAssignDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getUrgencyLabel = (level: number) => {
    const labels = ['Very Low', 'Low', 'Medium', 'High', 'Critical'];
    return labels[level - 1] || 'Medium';
  };

  return (
    <DashboardLayout navItems={navItems} title="Admin Panel">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Organ Requests</h1>
          <p className="text-muted-foreground mt-1">Manage and assign doctors to organ requests</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>Review and manage organ request submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">No requests yet</h3>
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
                        <Badge variant="outline">Level {request.urgency_level} - {getUrgencyLabel(request.urgency_level)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.assigned_doctor_id ? (
                          <Badge variant="default">Assigned</Badge>
                        ) : (
                          <Badge variant="secondary">Not Assigned</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssign(request)}
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Assign Doctor Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Request</DialogTitle>
              <DialogDescription>
                Update status and assign a doctor to this organ request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Organ Type</p>
                  <p className="font-medium capitalize">{selectedRequest.organ_type.replace('_', ' ')}</p>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assign Doctor</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.profiles?.full_name || 'Unknown'} - {doctor.specialization || 'General'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveAssignment} className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
