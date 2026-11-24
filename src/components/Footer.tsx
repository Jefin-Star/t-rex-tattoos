import { Instagram, Mail, MessageCircle } from 'lucide-react';
import { STUDIO_CONFIG } from '../data/studioConfig';
import { ResilientImage } from './ResilientImage';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050506]">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row md:items-center">
          {/* Brand Logo + Name */}
          <div className="flex items-center gap-3.5">
            <ResilientImage
              src={STUDIO_CONFIG.logoUrl}
              alt="T-Rex Tattoos and Piercing emblem"
              className="h-11 w-11 rounded-full object-cover ring-1 ring-[#C8A04B]/40"
            />
            <div>
              <p className="font-display text-base font-bold tracking-[0.08em] text-[#F5F2EB]">
                {STUDIO_CONFIG.brandName}
              </p>
              <p className="mt-0.5 text-xs text-[#A19E95]">
                Lead Artist {STUDIO_CONFIG.leadArtist.name} · {STUDIO_CONFIG.hours.label}
              </p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-6 text-sm text-[#A19E95]"
          >
            <a href="#about" className="transition-colors hover:text-[#F5F2EB]">
              About
            </a>
            <a href="#portfolio" className="transition-colors hover:text-[#F5F2EB]">
              Portfolio
            </a>
            <a href="#booking" className="transition-colors hover:text-[#F5F2EB]">
              Consultation
            </a>
            <a href="#contact" className="transition-colors hover:text-[#F5F2EB]">
              Contact
            </a>
          </nav>

          {/* Social & Direct Links */}
          <div className="flex items-center gap-3">
            <a
              href={STUDIO_CONFIG.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#101012] text-[#D4D0C7] transition-colors hover:border-[#C8A04B]/60 hover:text-[#C8A04B]"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={STUDIO_CONFIG.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#101012] text-[#D4D0C7] transition-colors hover:border-[#C8A04B]/60 hover:text-[#C8A04B]"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${STUDIO_CONFIG.contact.email}`}
              aria-label="Send an email"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#101012] text-[#D4D0C7] transition-colors hover:border-[#C8A04B]/60 hover:text-[#C8A04B]"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 text-xs text-[#A19E95] sm:flex-row sm:items-center">
          <p>
            &copy; {year} {STUDIO_CONFIG.brandName}. All rights reserved.
          </p>
          <p>
            Tattoos from {STUDIO_CONFIG.pricing.tattooStarting} · Piercings from{' '}
            {STUDIO_CONFIG.pricing.piercingStarting} · {STUDIO_CONFIG.hours.full}
          </p>
        </div>
      </div>
    </footer>
  );
}
