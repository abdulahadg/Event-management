import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import About from './components/About';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import Stats from './components/Stats';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import UpcomingEvents from './components/UpcomingEvents';
import Blog from './components/Blog';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FullPageViewer from './components/FullPageViewer';
import ConsultationPage from './components/ConsultationPage';
import AdminPanel from './components/AdminPanel';

interface ViewConfig {
  type: 'home' | 'article' | 'service' | 'project' | 'event' | 'consultation' | 'admin';
  id: string | null;
}

export default function App() {
  const [preselectedPackage, setPreselectedPackage] = useState('');
  const [preselectedService, setPreselectedService] = useState('');
  
  // Custom SPA Routing state
  const [viewConfig, setViewConfig] = useState<ViewConfig>({ type: 'home', id: null });

  const handleOpenConsultation = () => {
    setPreselectedPackage('');
    setPreselectedService('');
    setViewConfig({ type: 'consultation', id: null });
  };

  const handleOpenWithPackage = (packageName: string) => {
    setPreselectedPackage(packageName);
    setPreselectedService('');
    setViewConfig({ type: 'consultation', id: null });
  };

  const handleOpenWithService = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    setPreselectedPackage('');
    setViewConfig({ type: 'consultation', id: null });
  };

  // Navigates and scrolls on homepage
  const handleNavigate = (id: string) => {
    setViewConfig({ type: 'home', id: null });
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else if (id === 'home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleScrollToPortfolio = () => {
    handleNavigate('portfolio');
  };

  // Determine active section override for the navbar
  const getActiveSectionOverride = () => {
    switch (viewConfig.type) {
      case 'article': return 'blog';
      case 'service': return 'services';
      case 'project': return 'portfolio';
      case 'event': return 'events';
      case 'consultation': return 'packages';
      default: return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1B2A] antialiased selection:bg-[#D4A737] selection:text-white font-sans overflow-x-hidden">
      {/* Premium Sticky Navigation with integrated Router */}
      <Navbar
        onOpenConsultation={handleOpenConsultation}
        onNavigate={handleNavigate}
        activeSectionOverride={getActiveSectionOverride()}
      />

      {/* Conditionally Render Homepage vs Detailed Single Page View vs Admin vs Consultation */}
      {viewConfig.type === 'home' ? (
        <main>
          {/* Hero Section */}
          <Hero
            onOpenConsultation={handleOpenConsultation}
            onExploreWork={handleScrollToPortfolio}
          />

          {/* Global Logos Slider */}
          <TrustedBy />

          {/* Company Narrative & Vision */}
          <About />

          {/* Specialized Capabilities Grid (Opens Full Standalone Pages) */}
          <Services onOpenService={(id) => setViewConfig({ type: 'service', id })} />

          {/* Strategic Value Bento Grid */}
          <WhyChooseUs />

          {/* Sequential Timeline Map */}
          <Process />

          {/* Visual Blueprints Showcase (Opens Full Standalone Pages) */}
          <Portfolio onOpenProject={(id) => setViewConfig({ type: 'project', id })} />

          {/* Smooth Numerical Metrics */}
          <Stats />

          {/* Structural Pricing Matrix */}
          <Pricing onOpenConsultationWithPackage={handleOpenWithPackage} />

          {/* Executive Client Testimonials */}
          <Testimonials />

          {/* Photographic Light Journal */}
          <Gallery />

          {/* Upcoming public seminars schedule (Opens Full Standalone Pages) */}
          <UpcomingEvents onOpenEvent={(id) => setViewConfig({ type: 'event', id })} />

          {/* Journal perspectives blog (Opens Full Standalone Pages) */}
          <Blog onOpenArticle={(id) => setViewConfig({ type: 'article', id })} />

          {/* Accordion FAQ resolver */}
          <FAQ onOpenConsultation={handleOpenConsultation} />

          {/* Coordinate details & Inquiry Form */}
          <Contact />
        </main>
      ) : viewConfig.type === 'consultation' ? (
        <main>
          <ConsultationPage
            onBackToHome={() => setViewConfig({ type: 'home', id: null })}
            preselectedPackage={preselectedPackage}
            preselectedService={preselectedService}
          />
        </main>
      ) : viewConfig.type === 'admin' ? (
        <main>
          <AdminPanel
            onBackToHome={() => setViewConfig({ type: 'home', id: null })}
          />
        </main>
      ) : (
        <main>
          {/* Immersive Standalone Viewport taking over entire body page */}
          <FullPageViewer
            viewType={viewConfig.type as any}
            itemId={viewConfig.id!}
            onBackToHome={() => setViewConfig({ type: 'home', id: null })}
            onOpenConsultation={handleOpenConsultation}
          />
        </main>
      )}

      {/* Global Bottom Workspace */}
      <Footer
        onOpenAdmin={() => setViewConfig({ type: 'admin', id: null })}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
