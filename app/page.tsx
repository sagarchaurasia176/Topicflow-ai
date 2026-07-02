"use client";
// minor changes with the comments : move the devDepend -> dependencies
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import KnowledgeStructureSection from "@/components/landing/KnowledgeStructureSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import FinalCTASection from "@/components/landing/FinalCTASection";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-gray-900">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <ComparisonSection />
      <KnowledgeStructureSection />
      <UseCasesSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
