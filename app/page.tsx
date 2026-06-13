import { ExploreByGoal } from "@/components/home/Categories";
import { PopularComparisons } from "@/components/home/Comparsion";
import { FAQSection } from "@/components/home/FAQ";
import { FeaturedInstitutes } from "@/components/home/FeaturedInstitutes";
import { HeroSection } from "@/components/home/HeroSection";
import { LifeCoachCTA } from "@/components/home/LifeCoachCTA";
import { PopularCities } from "@/components/home/PopularCities";
import { StartJourney } from "@/components/home/StartJourney";
import { TrendingDestinations } from "@/components/home/Trending";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrendingDestinations />
      <ExploreByGoal />
      <LifeCoachCTA />
      <PopularComparisons />
      <FeaturedInstitutes />
      <PopularCities />
      <StartJourney />
      <FAQSection />
    </>
  );
}
