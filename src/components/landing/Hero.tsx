import { Heart, Users, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-primary-foreground/90 mb-8 animate-fade-in">
            <Heart className="w-4 h-4 animate-heartbeat text-red-400" />
            <span className="text-sm font-medium">Saving Lives Together</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-foreground mb-6 animate-fade-in-up">
            Give the Gift of
            <span className="block bg-gradient-to-r from-accent to-teal-300 bg-clip-text text-transparent">
              Life
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join our network of organ donors and recipients. Every donation is a chance to save multiple lives.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="xl" variant="accent">
              <Link to="/register">
                Become a Donor
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-primary-foreground mb-2">10,000+</h3>
              <p className="text-primary-foreground/70">Lives Saved</p>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-primary-foreground mb-2">50,000+</h3>
              <p className="text-primary-foreground/70">Registered Donors</p>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-primary-foreground mb-2">500+</h3>
              <p className="text-primary-foreground/70">Partner Hospitals</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(210 25% 98%)" />
        </svg>
      </div>
    </section>
  );
}
