import { getActiveServices, getActiveProfessionals } from "@/lib/scheduling/actions";
import { Footer } from "@/components/layout/footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { HeroSection } from "@/components/landing/hero-section";
import { InstitutionalSection } from "@/components/landing/institutional-section";
import { ServicesSection } from "@/components/landing/services-section";
import { GallerySection } from "@/components/landing/gallery-section";
import { ProfessionalsSection } from "@/components/landing/professionals-section";
import { MapSection } from "@/components/landing/map-section";

export default async function HomePage() {
  const [services, professionals] = await Promise.all([
    getActiveServices(),
    getActiveProfessionals(),
  ]);

  return (
    <>
      <LandingHeader />
      <main>
        <HeroSection />
        <InstitutionalSection />
        <ServicesSection services={services} />
        <GallerySection />
        <ProfessionalsSection professionals={professionals} />
        <MapSection />
      </main>
      <Footer />
    </>
  );
}

