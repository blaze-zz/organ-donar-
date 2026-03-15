import { useState, useEffect } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'doctor':
        return '/doctor';
      default:
        return '/dashboard';
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              isScrolled ? "gradient-primary" : "bg-white/20"
            )}>
              <Heart className={cn(
                "w-5 h-5",
                isScrolled ? "text-primary-foreground" : "text-white"
              )} />
            </div>
            <span className={cn(
              "text-xl font-display font-bold transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )}>
              LifeLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isScrolled ? "text-foreground" : "text-white/90 hover:text-white"
              )}
            >
              About
            </Link>
            <Link
              to="/hospitals"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isScrolled ? "text-foreground" : "text-white/90 hover:text-white"
              )}
            >
              Hospitals
            </Link>
            <Link
              to="/campaign"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isScrolled ? "text-foreground" : "text-white/90 hover:text-white"
              )}
            >
              Campaign
            </Link>
            <Link
              to="/faq"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isScrolled ? "text-foreground" : "text-white/90 hover:text-white"
              )}
            >
              FAQ
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button asChild variant={isScrolled ? "default" : "hero"}>
                <Link to={getDashboardLink()}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    isScrolled
                      ? "text-foreground hover:bg-muted"
                      : "text-white hover:bg-white/20"
                  )}
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild variant={isScrolled ? "default" : "accent"}>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isScrolled
                ? "text-foreground hover:bg-muted"
                : "text-white hover:bg-white/20"
            )}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-4 bg-card rounded-xl p-4 shadow-lg">
              <Link
                to="/about"
                className="text-foreground font-medium py-2 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/hospitals"
                className="text-foreground font-medium py-2 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hospitals
              </Link>
              <Link
                to="/faq"
                className="text-foreground font-medium py-2 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <hr className="border-border" />
              {user ? (
                <Button asChild>
                  <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
