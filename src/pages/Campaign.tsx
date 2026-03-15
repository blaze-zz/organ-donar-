import { useState } from 'react';
import { Heart, Users, Megaphone, ArrowRight, CheckCircle, Gift, Calendar, MapPin, Share2, HandHeart } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const campaigns = [
  {
    title: 'Donate Life Hyderabad 2026',
    date: 'April 15 - April 30, 2026',
    location: 'All Partner Hospitals, Hyderabad',
    description: 'A city-wide organ donation awareness drive across all major hospitals in Hyderabad. Free health checkups and registration for potential donors.',
    goal: 5000,
    registered: 3240,
    status: 'Active',
  },
  {
    title: 'Youth for Organ Donation',
    date: 'May 10, 2026',
    location: 'University of Hyderabad Campus',
    description: 'College awareness campaign targeting young adults. Seminars, panel discussions with transplant surgeons, and donor pledge drives.',
    goal: 2000,
    registered: 890,
    status: 'Upcoming',
  },
  {
    title: 'Corporate Pledge Drive',
    date: 'March 20 - March 31, 2026',
    location: 'HITEC City IT Park, Hyderabad',
    description: 'Partner with leading tech companies to raise awareness and encourage organ donation pledges among corporate employees.',
    goal: 3000,
    registered: 2810,
    status: 'Active',
  },
];

const facts = [
  { number: '1', text: 'One organ donor can save up to 8 lives and enhance 75 more through tissue donation.' },
  { number: '2', text: 'Every 10 minutes, someone is added to the organ transplant waiting list.' },
  { number: '3', text: 'Over 500,000 people in India are waiting for organ transplants at any given time.' },
  { number: '4', text: 'The organ donation rate in India is just 0.86 per million population.' },
];

const donationTiers = [
  { amount: '₹500', label: 'Supporter', description: 'Fund awareness pamphlets for 100 people', icon: Heart },
  { amount: '₹2,000', label: 'Champion', description: 'Sponsor a community awareness session', icon: Megaphone },
  { amount: '₹5,000', label: 'Hero', description: 'Fund a complete campus awareness drive', icon: Users },
  { amount: '₹10,000', label: 'Lifesaver', description: 'Sponsor organ donor registration camps', icon: HandHeart },
];

export default function Campaign() {
  const { toast } = useToast();
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [pledgeForm, setPledgeForm] = useState({ name: '', email: '', message: '' });

  const handlePledge = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: '🎉 Thank you for your pledge!',
      description: 'Your support helps spread organ donation awareness. We\'ll keep you updated on upcoming campaigns.',
    });
    setPledgeForm({ name: '', email: '', message: '' });
  };

  const handleDonate = (amount: string) => {
    toast({
      title: 'Donation Feature Coming Soon',
      description: `Thank you for wanting to contribute ${amount}. Payment integration is being set up.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-primary-foreground/90 mb-6">
            <Megaphone className="w-4 h-4" />
            <span className="text-sm font-medium">Awareness Campaign</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-5">
            Free Organ Donor
            <span className="block bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent mt-2">
              Awareness Campaign
            </span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join our mission to spread awareness about organ donation. Every pledge, every share, every conversation saves lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="accent" onClick={() => document.getElementById('pledge')?.scrollIntoView({ behavior: 'smooth' })}>
              Take the Pledge
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="xl" variant="outline" className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20" onClick={() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })}>
              <Gift className="w-5 h-5 mr-2" />
              Donate to Campaign
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 73C120 67 240 53 360 47C480 40 600 40 720 43C840 47 960 53 1080 57C1200 60 1320 60 1380 60L1440 60V80H0Z" fill="hsl(220 20% 97%)" />
          </svg>
        </div>
      </section>

      {/* Facts Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-4">Why Organ Donation Matters</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">Understanding the impact of organ donation can inspire action.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facts.map((fact, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 text-center animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center mx-auto mb-4 text-accent-foreground font-bold text-lg">
                    {fact.number}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{fact.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Calendar className="w-4 h-4" />
                Campaigns
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground">Active & Upcoming Campaigns</h2>
              <p className="text-muted-foreground mt-2">Join a campaign near you and make a difference.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={campaign.status === 'Active' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'}>
                      {campaign.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span>{campaign.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{campaign.location}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Registered</span>
                      <span className="font-semibold text-foreground">{campaign.registered.toLocaleString()} / {campaign.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full gradient-accent transition-all duration-500" style={{ width: `${Math.min((campaign.registered / campaign.goal) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <Button className="w-full mt-3 gap-2" asChild>
                    <Link to="/register">
                      <Heart className="w-4 h-4" />
                      Join Campaign
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pledge Section */}
      <section id="pledge" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              Take the Pledge
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Pledge to Support Organ Donation</h2>
            <p className="text-muted-foreground">Sign up to show your support and receive updates about campaigns in your area.</p>
          </div>
          <Card className="shadow-card">
            <CardContent className="p-8">
              <form onSubmit={handlePledge} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <Input placeholder="Your name" value={pledgeForm.name} onChange={(e) => setPledgeForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                    <Input type="email" placeholder="you@example.com" value={pledgeForm.email} onChange={(e) => setPledgeForm(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Your Message (Optional)</label>
                  <Textarea placeholder="Why do you support organ donation?" value={pledgeForm.message} onChange={(e) => setPledgeForm(p => ({ ...p, message: e.target.value }))} rows={3} />
                </div>
                <Button type="submit" size="lg" className="w-full gap-2">
                  <Heart className="w-4 h-4" />
                  Take the Pledge
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donate" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Gift className="w-4 h-4" />
              Support the Cause
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Donate to Our Campaign</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Your financial contribution helps us reach more communities and save more lives through awareness programs.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-10">
            {donationTiers.map((tier, idx) => (
              <Card
                key={idx}
                className={`cursor-pointer transition-all duration-300 hover:-translate-y-1 border-2 ${selectedTier === tier.amount ? 'border-primary shadow-lg' : 'border-border/50 hover:border-primary/30 hover:shadow-md'}`}
                onClick={() => { setSelectedTier(tier.amount); setDonationAmount(tier.amount.replace(/[₹,]/g, '')); }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
                    <tier.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{tier.amount}</div>
                  <div className="text-sm font-semibold text-primary mb-2">{tier.label}</div>
                  <p className="text-xs text-muted-foreground">{tier.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-md mx-auto">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Custom Amount (₹)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={donationAmount}
                    onChange={(e) => { setDonationAmount(e.target.value); setSelectedTier(null); }}
                    min="100"
                  />
                </div>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => handleDonate(donationAmount ? `₹${donationAmount}` : 'your contribution')}
                  disabled={!donationAmount}
                >
                  <Gift className="w-4 h-4" />
                  Donate {donationAmount ? `₹${donationAmount}` : ''}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">All donations are used for organ donation awareness programs.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
