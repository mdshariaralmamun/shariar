'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { cn } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { href: '#home', label: 'Home' },
      { href: '#about', label: 'About' },
      { href: '#experience', label: 'Experience' },
      { href: '#projects', label: 'Projects' },
      { href: '#skills', label: 'Skills' },
      { href: '#blog', label: 'Blog' },
      { href: '#contact', label: 'Contact' },
    ],
    expertise: [
      { href: '#projects?category=gas-piping', label: 'UHP Gas Piping' },
      { href: '#projects?category=cleanroom', label: 'Cleanroom Design' },
      { href: '#projects?category=equipment', label: 'Equipment Assessment' },
      { href: '#projects?category=coordination', label: 'Design Coordination' },
      { href: '#projects?category=research', label: 'R&D Projects' },
    ],
    resources: [
      { href: 'https://pipeforge.shariar.dev', label: 'PipeForge App', external: true },
      { href: '/blog', label: 'Technical Blog' },
      { href: '/dashboard', label: 'Community Dashboard' },
      { href: 'https://github.com/mdshariaralmamun', label: 'GitHub', external: true },
    ],
  };

  return (
    <footer className="border-t border-border bg-background/50" role="contentinfo">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="#home" className="flex items-center gap-2 text-xl font-bold gradient-text mb-4" aria-label="Sharair Portfolio Home">
              <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
                <path d="M16 8V24M8 16H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span>Sharair</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {portfolioData.owner.summary.slice(0, 200)}...
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'UHP Piping',
                'Orbital Welding',
                'Cleanroom Design',
                'Semiconductor',
                '316L SS',
                'BIM/Revit',
              ].map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Expertise Areas */}
          <nav aria-label="Expertise areas">
            <h3 className="font-semibold mb-4">Expertise</h3>
            <ul className="space-y-3">
              {footerLinks.expertise.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="h-3 w-3 opacity-50" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact & Resources */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${portfolioData.owner.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                {portfolioData.owner.email}
              </a>
              <a
                href={`tel:${portfolioData.owner.phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                {portfolioData.owner.phone}
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {portfolioData.owner.location}
              </div>
            </div>

            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="h-3 w-3 opacity-50" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Mohammed Sharair All Mamun. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href={portfolioData.owner.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={portfolioData.owner.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${portfolioData.owner.email}`}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://pipeforge.shariar.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="PipeForge"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>

          <p className="text-xs text-muted-foreground/50 text-center md:text-right">
            Built with Next.js, React Three Fiber, Supabase & AI
          </p>
        </div>
      </div>
    </footer>
  );
}