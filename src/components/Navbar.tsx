import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { STUDIO_CONFIG } from '../data/studioConfig';
import { ResilientImage } from './ResilientImage';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Consultation', href: '#booking' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060607]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A04B]"
        >
          <ResilientImage
            src={STUDIO_CONFIG.logoUrl}
            alt="T-Rex Tattoos and Piercing emblem"
            loading="eager"
            className="h-9 w-9 rounded-full object-cover ring-1 ring-[#C8A04B]/40"
          />
          <span className="font-display text-sm font-bold tracking-[0.08em] text-[#F5F2EB] sm:text-base">
            {STUDIO_CONFIG.brandName}
          </span>
        </a>

        {/* Zone 2: Clean single-line text nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 text-sm font-medium text-[#A19E95] transition-colors duration-150 hover:text-[#F5F2EB] whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C8A04B] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A04B]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#booking"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#C8A04B] px-4 py-2 text-xs font-semibold tracking-wide text-[#060607] transition-colors duration-150 hover:bg-[#D8B25D] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A04B]"
          >
            Book Consultation
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-[#F5F2EB] transition-colors hover:bg-white/5 md:hidden focus-visible:outline-2 focus-visible:outline-[#C8A04B]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0B0B0D] px-4 py-4 md:hidden">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-[#F5F2EB]/90 transition-colors hover:bg-white/5 hover:text-[#C8A04B]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={handleLinkClick}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-[#C8A04B] px-4 py-2.5 text-sm font-semibold text-[#060607] transition-colors hover:bg-[#D8B25D]"
            >
              Book Consultation
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
