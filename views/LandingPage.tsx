import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import TechStack from "@/components/landing/TechStack";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import "@/landing.css";

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage = ({ onLogin }: LandingPageProps) => {
  return (
    <div className="landing-page min-h-screen bg-background">
      <Navbar onLogin={onLogin} />
      <Hero onLogin={onLogin} />
      <div id="features">
        <Features />
      </div>
      <TechStack />
      <CTA onLogin={onLogin} />
      <Footer />
    </div>
  );
};

export default LandingPage;
