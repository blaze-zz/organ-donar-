import { UserPlus, FileText, Stethoscope, Heart } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Register',
    description: 'Create your account and complete your profile with medical information.',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Submit Details',
    description: 'Donors add organ details, recipients submit organ requests with medical conditions.',
  },
  {
    icon: Stethoscope,
    step: '03',
    title: 'Doctor Assignment',
    description: 'Admin assigns verified doctors to handle each case with proper medical protocols.',
  },
  {
    icon: Heart,
    step: '04',
    title: 'Save Lives',
    description: 'Complete the process with OTP verification and give the gift of life.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple, secure process from registration to saving lives
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary transform -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative flex flex-col items-center text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step number bubble */}
                <div className="relative z-10 mb-6">
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
