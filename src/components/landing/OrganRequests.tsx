import { useEffect, useState } from 'react';
import { Heart, Clock, AlertTriangle, ArrowRight, Building2, MapPin, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface HospitalInfo {
  name: string;
  city: string;
}

interface OrganRequest {
  id: string;
  organ_type: string;
  urgency_level: number | null;
  status: string;
  created_at: string;
  hospital_id: string | null;
  medical_condition: string | null;
  requester_id: string;
  hospitals: HospitalInfo | null;
}

interface ProfileInfo {
  user_id: string;
  full_name: string;
  blood_group: string | null;
}

const urgencyLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Low', color: 'bg-success/15 text-success border-success/30' },
  2: { label: 'Medium', color: 'bg-warning/15 text-warning border-warning/30' },
  3: { label: 'High', color: 'bg-destructive/15 text-destructive border-destructive/30' },
  4: { label: 'Critical', color: 'bg-destructive/20 text-destructive border-destructive/40' },
  5: { label: 'Emergency', color: 'bg-destructive/25 text-destructive border-destructive/50' },
};

const organIcons: Record<string, string> = {
  heart: '❤️',
  kidney: '🫘',
  liver: '🫁',
  lungs: '🫁',
  pancreas: '🔬',
  intestines: '🧬',
  corneas: '👁️',
  skin: '🩹',
  bone_marrow: '🦴',
};

export function OrganRequests() {
  const [requests, setRequests] = useState<OrganRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('organ_requests')
      .select('id, organ_type, urgency_level, status, created_at, hospital_id, medical_condition')
      .in('status', ['pending', 'approved'])
      .order('urgency_level', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8);
    if (data) setRequests(data);
    setLoading(false);
  };

  const organLabel = (type: string) =>
    type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
              <AlertTriangle className="w-4 h-4" />
              Active Requests
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Organ Requests
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              People in need of organ transplants. Your donation can save a life.
            </p>
          </div>
          <Button asChild className="gap-2 self-start md:self-auto">
            <Link to="/register">
              Become a Donor
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5"><div className="h-20 bg-muted rounded" /></CardContent>
              </Card>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Heart className="w-14 h-14 mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No active requests</h3>
            <p>There are currently no pending organ requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {requests.map((req, idx) => {
              const urgency = urgencyLabels[req.urgency_level ?? 1] || urgencyLabels[1];
              return (
                <Card
                  key={req.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{organIcons[req.organ_type] || '🫀'}</span>
                      <Badge variant="outline" className={`text-xs ${urgency.color}`}>
                        {urgency.label}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {organLabel(req.organ_type)}
                    </h3>
                    {req.medical_condition && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {req.medical_condition}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {timeAgo(req.created_at)}
                      </div>
                      <Badge variant="outline" className={
                        req.status === 'approved'
                          ? 'bg-success/10 text-success border-success/30 text-xs'
                          : 'bg-warning/10 text-warning border-warning/30 text-xs'
                      }>
                        {req.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
