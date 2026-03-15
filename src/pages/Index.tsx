import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { OrganRequests } from '@/components/landing/OrganRequests';
import { NearbyHospitals } from '@/components/landing/NearbyHospitals';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <OrganRequests />
      <NearbyHospitals />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
