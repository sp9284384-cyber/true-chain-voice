import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhyTrust } from "@/components/landing/WhyTrust";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <WhyTrust />
      <LandingFooter />
    </div>
  );
}
