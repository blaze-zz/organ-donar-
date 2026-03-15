import { useEffect, useState } from 'react';
import { Building2, MapPin, Navigation, Loader2, LocateFixed } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Link } from 'react-router-dom';

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  contact_phone: string | null;
  latitude: number | null;
  longitude: number | null;
  distance?: number;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function NearbyHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const { latitude, longitude, error, loading: geoLoading, granted, requestLocation } = useGeolocation();

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (latitude && longitude && hospitals.length > 0) {
      const sorted = hospitals
        .map((h) => ({
          ...h,
          distance: h.latitude && h.longitude
            ? getDistance(latitude, longitude, h.latitude, h.longitude)
            : 9999,
        }))
        .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
      setHospitals(sorted);
    }
  }, [latitude, longitude]);

  const fetchHospitals = async () => {
    const { data } = await supabase
      .from('hospitals')
      .select('id, name, address, city, state, contact_phone, latitude, longitude')
      .eq('is_active', true)
      .limit(6);
    if (data) setHospitals(data);
    setLoading(false);
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Building2 className="w-4 h-4" />
              Hospital Network
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {granted ? 'Nearby Hospitals' : 'Our Hospital Partners'}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Find partner hospitals in your area for organ donation and transplant services.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!granted && (
              <Button onClick={requestLocation} disabled={geoLoading} variant="outline" className="gap-2">
                {geoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                {geoLoading ? 'Getting location...' : 'Find Nearby'}
              </Button>
            )}
            {granted && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1.5 py-1.5">
                <Navigation className="w-3 h-3" />
                Location enabled
              </Badge>
            )}
            <Button asChild variant="outline">
              <Link to="/hospitals">View All</Link>
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader><div className="h-5 bg-muted rounded w-2/3" /></CardHeader>
                <CardContent><div className="h-4 bg-muted rounded w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hospitals registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.slice(0, 6).map((hospital, idx) => (
              <Card key={hospital.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">{hospital.name}</CardTitle>
                      {hospital.distance !== undefined && hospital.distance < 9999 && (
                        <span className="text-xs text-accent font-medium">{hospital.distance.toFixed(1)} km away</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                    <span className="line-clamp-2">{hospital.address}, {hospital.city}, {hospital.state}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
