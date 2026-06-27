import LandingHero from "@/components/LandingHero";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import StatsRow from "@/components/StatsRow";

export default function HomePage() {
  return (
    <main className="flex-1">
      <LandingHero />
      <StatsRow />
      <HowItWorks />
      <TrustSection />
    </main>
  );
}
