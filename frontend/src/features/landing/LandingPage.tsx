import React, { useEffect } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import CTA from './components/CTA';
import LandingFooter from './components/LandingFooter';

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href) return;
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="bg-[#020617] min-h-screen font-sans selection:bg-cyan-500/30 selection:text-white">
      <Hero />
      <Features />
      <About />
      <CTA />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
