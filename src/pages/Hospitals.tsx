import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Heart, Search, Building2, Users } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  contact_phone: string | null;
  email: string | null;
  is_active: boolean | null;
}

interface DonorInfo {
  id: string;
  organ_type: string;
  status: string;
  created_at: string;
  hospital_name: string | null;
}

export default function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [donors, setDonors] = useState<DonorInfo[]>([]);
  const [searchHospital, setSearchHospital] = useState('');
  const [searchDonor, setSearchDonor] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hospitalsRes, inventoryRes] = await Promise.all([
        supabase.from('hospitals').select('*').eq('is_active', true).order('name'),
        supabase
          .from('organ_inventory')
          .select('id, organ_type, is_available, created_at, hospital_id, hospitals(name)')
          .eq('is_available', true)
          .order('created_at', { ascending: false }),
      ]);

      if (hospitalsRes.data) setHospitals(hospitalsRes.data);
      if (inventoryRes.data) {
        setDonors(
          inventoryRes.data.map((item: any) => ({
            id: item.id,
            organ_type: item.organ_type,
            status: item.is_available ? 'Available' : 'Unavailable',
            created_at: item.created_at,
            hospital_name: item.hospitals?.name || 'Unknown',
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchHospital.toLowerCase()) ||
      h.city.toLowerCase().includes(searchHospital.toLowerCase()) ||
      h.state.toLowerCase().includes(searchHospital.toLowerCase())
  );

  const filteredDonors = donors.filter(
    (d) =>
      d.organ_type.toLowerCase().includes(searchDonor.toLowerCase()) ||
      (d.hospital_name?.toLowerCase().includes(searchDonor.toLowerCase()) ?? false)
  );

  const organTypeLabel = (type: string) =>
    type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-primary-foreground/90 mb-6">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">Hospital Network</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4">
            Hospitals & Available Organs
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Find nearby hospitals and check available organ donations across our network.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 73C120 67 240 53 360 47C480 40 600 40 720 43C840 47 960 53 1080 57C1200 60 1320 60 1380 60L1440 60V80H0Z" fill="hsl(210 25% 98%)" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="hospitals" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="hospitals" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Hospitals
            </TabsTrigger>
            <TabsTrigger value="donors" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Available Organs
            </TabsTrigger>
          </TabsList>

          {/* Hospitals Tab */}
          <TabsContent value="hospitals">
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, city, or state..."
                  value={searchHospital}
                  onChange={(e) => setSearchHospital(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader><div className="h-6 bg-muted rounded w-3/4" /></CardHeader>
                    <CardContent><div className="space-y-3"><div className="h-4 bg-muted rounded" /><div className="h-4 bg-muted rounded w-2/3" /></div></CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredHospitals.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No hospitals found</h3>
                <p className="text-muted-foreground">Try a different search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHospitals.map((hospital) => (
                  <Card key={hospital.id} className="hover:shadow-lg transition-shadow border-border/60 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Building2 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{hospital.name}</CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs bg-success/10 text-success border-success/30">
                              Active
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>{hospital.address}, {hospital.city}, {hospital.state}</span>
                      </div>
                      {hospital.contact_phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4 shrink-0 text-primary" />
                          <span>{hospital.contact_phone}</span>
                        </div>
                      )}
                      {hospital.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4 shrink-0 text-primary" />
                          <span>{hospital.email}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Available Organs Tab */}
          <TabsContent value="donors">
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by organ type or hospital..."
                  value={searchDonor}
                  onChange={(e) => setSearchDonor(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader><div className="h-6 bg-muted rounded w-1/2" /></CardHeader>
                    <CardContent><div className="h-4 bg-muted rounded w-3/4" /></CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredDonors.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No available organs found</h3>
                <p className="text-muted-foreground">Check back later for updates.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonors.map((donor) => (
                  <Card key={donor.id} className="hover:shadow-lg transition-shadow border-border/60 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                          <Heart className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{organTypeLabel(donor.organ_type)}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs bg-success/10 text-success border-success/30">
                            {donor.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4 shrink-0 text-primary" />
                        <span>{donor.hospital_name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Added: {new Date(donor.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
}
