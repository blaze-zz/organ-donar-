import { 
  Heart, 
  Search, 
  Shield, 
  Clock, 
  Hospital, 
  UserCheck,
  FileCheck,
  Bell
} from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Easy Organ Registration',
    description: 'Register as a donor in minutes with our simple, secure process.',
  },
  {
    icon: Search,
    title: 'Smart Matching',
    description: 'Advanced algorithms match donors with recipients based on compatibility.',
  },
  {
    icon: Hospital,
    title: 'Hospital Network',
    description: 'Connected with hundreds of hospitals across the country.',
  },
  {
    icon: UserCheck,
    title: 'Verified Doctors',
    description: 'All procedures supervised by certified medical professionals.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your medical data is encrypted and protected at all times.',
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Track your donation or request status in real-time.',
  },
  {
    icon: FileCheck,
    title: 'OTP Verification',
    description: 'Secure verification process for all organ collections.',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Get notified when matches are found or status changes.',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Why Choose Organ Donor?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've built the most comprehensive organ donor management platform to save lives efficiently and securely.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
