import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import Conditions from "@/components/Conditions";
import Reviews from "@/components/Reviews";
import OurDoctors from "@/components/OurDoctors";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import ContactForm from "@/components/ContactForm";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Conditions />
        <Reviews />
        <OurDoctors />
        <Pricing />
        <FAQ />
        <CTA />
        <ContactForm />
        <AboutUs />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Index;
