import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import WhyTrust from "@/components/WhyTrust";
import Process from "@/components/Process";
import FinalCTA from "@/components/FinalCTA";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <About />
        <Services />
        <Gallery />
        <WhyTrust />
        <Process />
        <FinalCTA />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
