import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Hospital,
  Heart,
  FileText,
  Activity,
  Plus,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
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

interface HospitalData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  contact_phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

const defaultFormData = {
  name: '',
  address: '',
  city: '',
  state: '',
  contact_phone: '',
  email: '',
};

export default function ManageHospitals() {
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<HospitalData | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name');

      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (hospital?: HospitalData) => {
    if (hospital) {
      setEditingHospital(hospital);
      setFormData({
        name: hospital.name,
        address: hospital.address,
        city: hospital.city,
        state: hospital.state,
        contact_phone: hospital.contact_phone || '',
        email: hospital.email || '',
      });
    } else {
      setEditingHospital(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingHospital) {
        const { error } = await supabase
          .from('hospitals')
          .update({
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            contact_phone: formData.contact_phone || null,
            email: formData.email || null,
          })
          .eq('id', editingHospital.id);

        if (error) throw error;
        toast({ title: 'Hospital Updated', description: 'Hospital details have been updated.' });
      } else {
        const { error } = await supabase
          .from('hospitals')
          .insert({
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            contact_phone: formData.contact_phone || null,
            email: formData.email || null,
          });

        if (error) throw error;
        toast({ title: 'Hospital Added', description: 'New hospital has been registered.' });
      }

      setDialogOpen(false);
      fetchHospitals();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (hospital: HospitalData) => {
    try {
      const { error } = await supabase
        .from('hospitals')
        .update({ is_active: !hospital.is_active })
        .eq('id', hospital.id);

      if (error) throw error;
      fetchHospitals();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Admin Panel">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Manage Hospitals</h1>
            <p className="text-muted-foreground mt-1">Add and manage partner hospital locations</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Hospital
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingHospital ? 'Edit Hospital' : 'Add New Hospital'}</DialogTitle>
                <DialogDescription>
                  {editingHospital ? 'Update hospital details' : 'Register a new partner hospital'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hospital Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalEmail">Email</Label>
                  <Input
                    id="hospitalEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editingHospital ? 'Update Hospital' : 'Add Hospital'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Partner Hospitals</CardTitle>
            <CardDescription>All registered hospital locations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              </div>
            ) : hospitals.length === 0 ? (
              <div className="text-center py-12">
                <Hospital className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No hospitals yet</h3>
                <p className="text-muted-foreground mb-4">Add your first partner hospital</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitals.map((hospital) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium">{hospital.name}</TableCell>
                      <TableCell>{hospital.city}, {hospital.state}</TableCell>
                      <TableCell>{hospital.contact_phone || hospital.email || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={hospital.is_active}
                            onCheckedChange={() => toggleActive(hospital)}
                          />
                          <Badge variant={hospital.is_active ? 'default' : 'secondary'}>
                            {hospital.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(hospital)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
