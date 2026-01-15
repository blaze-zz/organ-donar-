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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
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

export default function RequestOrgan() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [organType, setOrganType] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState([3]);
  const [medicalCondition, setMedicalCondition] = useState('');
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

    if (!medicalCondition.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide your medical condition',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('organ_requests')
        .insert({
          requester_id: user?.id,
          organ_type: organType as any,
          hospital_id: hospitalId || null,
          urgency_level: urgencyLevel[0],
          medical_condition: medicalCondition,
          notes,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Request Submitted!',
        description: 'Your organ request has been submitted for review.',
      });

      navigate('/dashboard/my-requests');
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

  const getUrgencyLabel = (level: number) => {
    const labels = ['Very Low', 'Low', 'Medium', 'High', 'Critical'];
    return labels[level - 1] || 'Medium';
  };

  const getUrgencyColor = (level: number) => {
    const colors = ['text-green-500', 'text-green-400', 'text-yellow-500', 'text-orange-500', 'text-red-500'];
    return colors[level - 1] || 'text-yellow-500';
  };

  return (
    <DashboardLayout navItems={navItems} title="User Dashboard">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Request an Organ
            </CardTitle>
            <CardDescription>
              Submit your organ request. Our team will review and match you with available donors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="organType">Required Organ Type *</Label>
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Urgency Level</Label>
                  <span className={`font-semibold ${getUrgencyColor(urgencyLevel[0])}`}>
                    {getUrgencyLabel(urgencyLevel[0])}
                  </span>
                </div>
                <Slider
                  value={urgencyLevel}
                  onValueChange={setUrgencyLevel}
                  min={1}
                  max={5}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low</span>
                  <span>Critical</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalCondition">Medical Condition *</Label>
                <Textarea
                  id="medicalCondition"
                  placeholder="Describe your medical condition and why you need this organ..."
                  value={medicalCondition}
                  onChange={(e) => setMedicalCondition(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Your request will be reviewed by our medical team. 
                  A doctor will be assigned to handle your case once approved.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Request
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
