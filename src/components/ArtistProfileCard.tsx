import { Award, Calendar, Check, Crown, MessageCircle } from 'lucide-react';
import { STUDIO_CONFIG } from '../data/studioConfig';
import { ResilientImage } from './ResilientImage';

const CREDENTIALS = [
  'Freehand Anatomical Mapping',
  'Hospital-Grade Autoclave Sterility',
  'ASTM F-136 Implant-Grade Titanium',
  'Vegan & EU-REACH Certified Inks',
];

export function ArtistProfileCard() {
  return (
    <div className="relative mt-12">
      {/* Subtle Ambient Gold Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#C8A04B]/20 via-transparent to-[#C8A04B]/15 opacity-55 blur-xl"
      />

      {/* Outer Card Container with Thin Glowing Animated Border */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1A1813] p-[1px] shadow-2xl">
        <div aria-hidden="true" className="artist-glow-ring" />

        {/* Inner Dark Obsidian Card Surface */}
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 rounded-[15px] bg-[#0B0B0E] p-6 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
          {/* LEFT COLUMN: Portrait Frame + Bottom Gradient Text + Appointment Status */}
          <div className="flex flex-col items-center lg:col-span-5">
            <div className="w-full max-w-[330px]">
              {/* Vertical Rounded Portrait Frame with Glowing Animated Border */}
              <div className="relative overflow-hidden rounded-2xl bg-[#1A1813] p-[1.5px] shadow-[0_0_28px_rgba(200,160,75,0.16)]">
                <div aria-hidden="true" className="portrait-glow-ring" />

                <div className="relative z-10 aspect-[3/4] w-full overflow-hidden rounded-[14.5px] bg-[#060607]">
                  <ResilientImage
                    src={STUDIO_CONFIG.leadArtist.portraitUrl}
                    alt="Nithin Raj — Lead Studio Director at T-REX TATTOOS & PIERCING"
                    fallbackTitle="Nithin Raj"
                    className="h-full w-full object-cover object-top"
                  />

                  {/* Top-Right Floating Ribbon/Medal Badge Icon */}
                  <div
                    aria-hidden="true"
                    className="absolute top-3.5 right-3.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#C8A04B]/55 bg-[#0B0B0E]/85 text-[#C8A04B] shadow-[0_0_16px_rgba(200,160,75,0.3)] backdrop-blur-md"
                  >
                    <Award className="h-5 w-5" strokeWidth={1.75} />
                  </div>

                  {/* Bottom Dark Gradient Overlay + Centered Director Title */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060607] via-[#060607]/85 to-transparent px-4 pt-16 pb-5 text-center">
                    <p className="text-sm font-bold tracking-[0.14em] text-white uppercase sm:text-base">
                      LEAD STUDIO DIRECTOR
                    </p>
                    <p className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-[#C8A04B] uppercase">
                      T-REX TATTOOS &amp; PIERCING
                    </p>
                  </div>
                </div>
              </div>

              {/* Left-Aligned Appointment Availability Directly Below Frame */}
              <div className="mt-4 flex items-center gap-2.5 text-left">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
                />
                <span className="text-xs font-medium text-[#D4D0C7] sm:text-sm">
                  Accepting Private Appointments This Week
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Name + Crown, Title, Experience Pill, Dual Paragraphs, 2x2 Credentials, CTAs */}
          <div className="lg:col-span-7">
            {/* Name + Glowing Crown Square */}
            <div className="flex flex-wrap items-center gap-3.5">
              <h3 className="font-display text-3xl font-bold tracking-wider text-white uppercase sm:text-4xl">
                NITHIN RAJ
              </h3>
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C8A04B]/50 bg-[#C8A04B]/10 text-[#C8A04B] shadow-[0_0_18px_rgba(200,160,75,0.28)]"
              >
                <Crown className="h-5 w-5" strokeWidth={1.8} />
              </span>
            </div>

            <p className="mt-2 text-xs font-bold tracking-[0.15em] text-[#C8A04B] uppercase sm:text-sm">
              FOUNDER, MASTER TATTOO &amp; PIERCING ARTIST
            </p>

            {/* Glowing Pill Badge */}
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-[#C8A04B]/50 bg-[#C8A04B]/10 px-4 py-2 text-xs font-medium text-[#F5F2EB] shadow-[0_0_20px_rgba(200,160,75,0.18)] backdrop-blur-sm sm:text-sm">
              <Award className="h-4 w-4 shrink-0 text-[#C8A04B]" />
              <span>5+ Years of Experience in Tattoo &amp; Piercing</span>
            </div>

            {/* Two Clean Sans-Serif Paragraphs */}
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#D4D0C7] sm:text-base">
              <p>
                As the visionary founder and master artist of{' '}
                <span className="font-semibold text-[#F5F2EB]">T-REX TATTOOS &amp; PIERCING</span>,
                Nithin Raj has set a high benchmark for custom tattoo artistry and body piercing.
                Driven by anatomical balance and precision, every tattoo and piercing session is
                performed using single-use sterile equipment.
              </p>
              <p>
                His expertise covers custom black-and-gray realism, fine-line tattoos, intricate
                cartilage piercings (daith, industrial scaffolds, rook, and conch), and precision
                facial piercings with a focus on clean healing and minimal trauma.
              </p>
            </div>

            {/* 2x2 Credentials Grid with Glowing Gold Circular Checkmarks */}
            <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {CREDENTIALS.map((credential) => (
                <div key={credential} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#C8A04B]/60 bg-[#C8A04B]/15 text-[#C8A04B] shadow-[0_0_12px_rgba(200,160,75,0.28)]"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </span>
                  <span className="text-xs font-medium text-[#F5F2EB] sm:text-sm">
                    {credential}
                  </span>
                </div>
              ))}
            </div>

            {/* Side-by-Side Rounded Rectangular Action Buttons */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href="#booking"
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-xl bg-[#C8A04B] px-5 py-3 text-xs font-bold tracking-wider text-[#060607] uppercase shadow-[0_0_20px_rgba(200,160,75,0.28)] transition-all duration-200 hover:bg-[#D8B25D] hover:shadow-[0_0_28px_rgba(200,160,75,0.5)] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A04B] sm:text-sm"
              >
                <Calendar className="h-4 w-4 shrink-0" />
                <span>BOOK SESSION WITH NITHIN</span>
              </a>

              <a
                href={STUDIO_CONFIG.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-xl border border-emerald-500/55 bg-[#091510]/80 px-5 py-3 text-xs font-semibold text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.16)] backdrop-blur-sm transition-all duration-200 hover:border-emerald-400 hover:text-white hover:shadow-[0_0_26px_rgba(16,185,129,0.38)] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:text-sm"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Direct WhatsApp Consultation</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
