import { getActiveServices, getActiveProfessionals } from "@/lib/scheduling/actions";
import { Footer } from "@/components/layout/footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { HeroSection } from "@/components/landing/hero-section";
import { InstitutionalSection } from "@/components/landing/institutional-section";
import { ServicesSection } from "@/components/landing/services-section";
import { GallerySection } from "@/components/landing/gallery-section";
import { PriceTableSection } from "@/components/landing/price-table-section";
import { HighlightSection } from "@/components/landing/highlight-section";
import { BrandsSection } from "@/components/landing/brands-section";
import { ProfessionalsSection } from "@/components/landing/professionals-section";
import { CtaBannersSection } from "@/components/landing/cta-banners-section";
import { TestimonialMetricsSection } from "@/components/landing/testimonial-metrics-section";
import { MapSection } from "@/components/landing/map-section";
import { LoginSection } from "@/components/landing/login-section";

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
        <PriceTableSection services={services} />
        <HighlightSection />
        <BrandsSection />
        <ProfessionalsSection professionals={professionals} />
        <CtaBannersSection />
        <TestimonialMetricsSection />
        <MapSection />
        <LoginSection />
      </main>
      <Footer />
    </>
  );
}
