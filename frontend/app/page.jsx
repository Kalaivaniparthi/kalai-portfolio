import Navbar from '@/components/Navbar';
import NeuralNetworkHero from '@/components/NeuralNetworkHero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import ProjectShowcase from '@/components/ProjectShowcase';
import Certifications from '@/components/Certifications';
import Achievements from '@/components/Achievements';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        <NeuralNetworkHero />
        <About />
        <Skills />
        <Experience />
        <ProjectShowcase />
        <Certifications />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
