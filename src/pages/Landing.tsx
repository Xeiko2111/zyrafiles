import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { Statement } from "../components/landing/Statement";
import { Features } from "../components/landing/Features";
import { ActivityPreview } from "../components/landing/ActivityPreview";
import { FinalCTA } from "../components/landing/FinalCTA";
import { Footer } from "../components/landing/Footer";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg">
      <Navbar />
      <main>
        <Hero />
        <Statement />
        <Features />
        <ActivityPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
