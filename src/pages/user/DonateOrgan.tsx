import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Heart,
  User,
  Clock,
  Loader2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: PlusCircle, label: 'Donate Organ', href: '/dashboard/donate' },
  { icon: FileText, label: 'My Donations', href: '/dashboard/my-donations' },
  { icon: Heart, label: 'Request Organ', href: '/dashboard/request' },
  { icon: Clock, label: 'My Requests', href: '/dashboard/my-requests' },
  { icon: User, label: 'My Profile', href: '/dashboard/profile' },
];

const organTypes = [
  { value: 'heart', label: 'Heart' },
  { value: 'kidney', label: 'Kidney' },
  { value: 'liver', label: 'Liver' },
  { value: 'lungs', label: 'Lungs' },
  { value: 'pancreas', label: 'Pancreas' },
  { value: 'intestines', label: 'Intestines' },
  { value: 'corneas', label: 'Corneas' },
  { value: 'skin', label: 'Skin' },
  { value: 'bone_marrow', label: 'Bone Marrow' },
];

interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
}

export default function DonateOrgan() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [organType, setOrganType] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [notes, setNotes] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingHospitals, setFetchingHospitals] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, name, city, state')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setFetchingHospitals(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organType) {
      toast({
        title: 'Error',
        description: 'Please select an organ type',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const { error } = await supabase
        .from('organ_donations')
        .insert({
          donor_id: user?.id,
          organ_type: organType as any,
          hospital_id: hospitalId || null,
          notes,
          otp_code: otp,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Donation Registered!',
        description: `Your ${organType} donation has been registered. OTP: ${otp}`,
      });

      navigate('/dashboard/my-donations');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="User Dashboard">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Register Organ Donation
            </CardTitle>
            <CardDescription>
              Fill in the details below to register your organ donation. An OTP will be generated for verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="organType">Organ Type *</Label>
                <Select value={organType} onValueChange={setOrganType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organ type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organTypes.map((organ) => (
                      <SelectItem key={organ.value} value={organ.value}>
                        {organ.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital">Preferred Hospital</Label>
                <Select value={hospitalId} onValueChange={setHospitalId} disabled={fetchingHospitals}>
                  <SelectTrigger>
                    <SelectValue placeholder={fetchingHospitals ? "Loading hospitals..." : "Select hospital (optional)"} />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        {hospital.name} - {hospital.city}, {hospital.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about your donation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> After submitting, you will receive an OTP for verification. 
                  Keep this OTP safe as it will be required during the organ collection process.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Register Donation
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
