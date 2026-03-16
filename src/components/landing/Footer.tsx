import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <Heart className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-display font-bold">Organ Donor</span>
            </Link>
            <p className="text-sidebar-foreground/70 mb-6">
              Connecting donors with recipients to save lives through a secure, efficient organ donation network.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  Partner Hospitals
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Users */}
          <div>
            <h4 className="font-semibold mb-4">For Users</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sidebar-foreground/70">
                <Mail className="w-5 h-5 text-sidebar-primary" />
                support@organdonor.org
              </li>
              <li className="flex items-center gap-3 text-sidebar-foreground/70">
                <Phone className="w-5 h-5 text-sidebar-primary" />
                1-800-ORGANDONOR
              </li>
              <li className="flex items-start gap-3 text-sidebar-foreground/70">
                <MapPin className="w-5 h-5 text-sidebar-primary flex-shrink-0 mt-0.5" />
                123 Medical Center Drive, Healthcare City, HC 12345
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-sidebar-border mt-12 pt-8 text-center text-sidebar-foreground/50">
          <p>© {new Date().getFullYear()} LifeLink Organ Donor Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
