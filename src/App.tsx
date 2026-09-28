import React, { useState, useEffect } from 'react';
import { ScrollProgressBar } from './components/ScrollProgressBar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { TrustStats } from './components/TrustStats.tsx';
import { SelectedWork } from './components/SelectedWork.tsx';
import { Services } from './components/Services.tsx';
import { Process } from './components/Process.tsx';
import { About } from './components/About.tsx';
import { Testimonials } from './components/Testimonials.tsx';
import { FAQ } from './components/FAQ.tsx';
import { CTASection } from './components/CTASection.tsx';
import { Footer } from './components/Footer.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { TeamModal } from './components/TeamModal.tsx';
import { InquiryDrawer } from './components/InquiryDrawer.tsx';
import { LiveChat } from './components/LiveChat.tsx';
import { SectionReveal } from './components/SectionReveal.tsx';
import { Project } from './data/content.ts';
import { AdminModule } from './admin/AdminModule.tsx';

// Dedicated Pages
import { AboutPage } from './pages/AboutPage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { TeamPage } from './pages/TeamPage.tsx';
import { ReviewsPage } from './pages/ReviewsPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';

export default function App() {
  const getInitialPage = (): string => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();

    if (['about', 'projects', 'team', 'reviews', 'contact', 'admin'].includes(path)) {
      return path;
    }
    if (['about', 'team', 'reviews', 'contact', 'admin'].includes(hash)) {
      return hash;
    }
    if (hash === 'work' || hash === 'projects') return 'projects';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);
  const [inquiryInitialService, setInquiryInitialService] = useState<string>('Video Editing');

  // Real website traffic tracking
  useEffect(() => {
    if (currentPage === 'admin') return;
    try {
      let visitorId = localStorage.getItem('wg_visitor_id');
      if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
        localStorage.setItem('wg_visitor_id', visitorId);
      }
      fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: window.location.pathname || `/${currentPage}`,
          visitorId,
          referrer: document.referrer || '',
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    try {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page }, '', targetPath);
      }
    } catch {
      // Safe fallback if history API is restricted in sandbox
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenInquiry = (service?: string) => {
    if (service) {
      setInquiryInitialService(service);
    }
    setIsInquiryOpen(true);
  };

  const handleExploreWork = () => {
    if (currentPage === 'home') {
      const el = document.getElementById('work');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    handleNavigate('projects');
  };

  const handleInquireSimilar = (projectName: string) => {
    setSelectedProject(null);
    setInquiryInitialService('Commercial Production');
    setIsInquiryOpen(true);
  };

  if (currentPage === 'admin') {
    return <AdminModule onBackToSite={() => handleNavigate('home')} />;
  }

  return (
    <div className="relative min-h-screen bg-[#050609] text-[#F5F5F7] overflow-x-hidden selection:bg-[#7C00FF]/40 selection:text-white">
      {/* Editorial Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Unified Global Navigation: Home → About → Projects → Team → Reviews → Contact */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenInquiry={handleOpenInquiry}
      />

      {/* Main Multi-Page Content View */}
      <main className="min-h-[80vh]">
        {currentPage === 'home' && (
          <>
            {/* 1. Hero Section - Gracefully slides & fades in on load */}
            <SectionReveal animateOnMount duration={0.8} yOffset={28}>
              <Hero
                onOpenInquiry={() => handleOpenInquiry('Commercial Production')}
                onExploreWork={handleExploreWork}
              />
            </SectionReveal>

            {/* 2. Trust & Statistics Section */}
            <SectionReveal yOffset={36} duration={0.7} viewportAmount={0.2}>
              <TrustStats />
            </SectionReveal>

            {/* 3. Selected Work / Portfolio Section */}
            <SectionReveal yOffset={42} duration={0.75} viewportAmount={0.08}>
              <SelectedWork
                onSelectProject={(project) => setSelectedProject(project)}
              />
            </SectionReveal>

            {/* 4. Services & Post-Production Workstation Area */}
            <SectionReveal yOffset={42} duration={0.75} viewportAmount={0.08}>
              <Services
                onSelectServiceForInquiry={(srv) => handleOpenInquiry(srv)}
              />
            </SectionReveal>

            {/* 5. Process Section */}
            <SectionReveal yOffset={40} duration={0.75} viewportAmount={0.12}>
              <Process />
            </SectionReveal>

            {/* 6. About Section */}
            <SectionReveal yOffset={40} duration={0.75} viewportAmount={0.12}>
              <About
                onOpenTeam={() => handleNavigate('team')}
                onOpenInquiry={() => handleOpenInquiry('Creative Direction')}
              />
            </SectionReveal>

            {/* 7. Client Testimonials */}
            <SectionReveal yOffset={40} duration={0.75} viewportAmount={0.12}>
              <Testimonials
                onViewAll={() => handleNavigate('reviews')}
              />
            </SectionReveal>

            {/* 8. Frequently Asked Questions */}
            <SectionReveal yOffset={40} duration={0.75} viewportAmount={0.12}>
              <FAQ onOpenInquiry={handleOpenInquiry} />
            </SectionReveal>

            {/* 9. Conversion Climax CTA Section */}
            <SectionReveal yOffset={40} duration={0.75} viewportAmount={0.15}>
              <CTASection
                onOpenInquiry={() => handleOpenInquiry()}
                onExploreWork={() => handleNavigate('projects')}
              />
            </SectionReveal>
          </>
        )}

        {currentPage === 'about' && (
          <SectionReveal animateOnMount duration={0.65} yOffset={24}>
            <AboutPage
              onNavigate={handleNavigate}
              onOpenInquiry={handleOpenInquiry}
            />
          </SectionReveal>
        )}

        {currentPage === 'projects' && (
          <SectionReveal animateOnMount duration={0.65} yOffset={24}>
            <ProjectsPage
              onSelectProject={(project) => setSelectedProject(project)}
              onOpenInquiry={handleOpenInquiry}
            />
          </SectionReveal>
        )}

        {currentPage === 'team' && (
          <SectionReveal animateOnMount duration={0.65} yOffset={24}>
            <TeamPage
              onOpenInquiry={handleOpenInquiry}
            />
          </SectionReveal>
        )}

        {currentPage === 'reviews' && (
          <SectionReveal animateOnMount duration={0.65} yOffset={24}>
            <ReviewsPage
              onOpenInquiry={handleOpenInquiry}
            />
          </SectionReveal>
        )}

        {currentPage === 'contact' && (
          <SectionReveal animateOnMount duration={0.65} yOffset={24}>
            <ContactPage />
          </SectionReveal>
        )}
      </main>

      {/* Unified Professional Footer */}
      <Footer
        onOpenInquiry={handleOpenInquiry}
        onNavigate={handleNavigate}
      />

      {/* Interactive Project Video & Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquireSimilar={handleInquireSimilar}
      />

      {/* Leadership & Creative Team Modal */}
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onOpenInquiry={() => {
          setIsTeamModalOpen(false);
          handleOpenInquiry('Creative Direction');
        }}
      />

      {/* Project Inquiry / Booking Drawer */}
      <InquiryDrawer
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        initialService={inquiryInitialService}
      />

      {/* Persistent 'Live Chat' Floating Action Button & AI Support Window */}
      <LiveChat
        onOpenInquiry={handleOpenInquiry}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
