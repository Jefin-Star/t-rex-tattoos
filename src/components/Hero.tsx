import { motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { STUDIO_CONFIG } from '../data/studioConfig';
import { ResilientImage } from './ResilientImage';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-white/10 bg-[#060607]">
      {/* Full-bleed Studio Backdrop + Measured Scrim */}
      <div className="relative min-h-[620px] lg:min-h-[700px] flex items-center">
        <div className="absolute inset-0">
          <ResilientImage
            src={STUDIO_CONFIG.heroImage}
            alt="T-Rex Tattoos and Piercing private studio interior with brass pendant lighting"
            loading="eager"
            className="h-full w-full object-cover object-center opacity-55"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#060607] via-[#060607]/85 to-[#060607]/45"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#060607] via-transparent to-[#060607]/70"
          />
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <p className="mb-4 text-xs font-medium tracking-[0.18em] text-[#C8A04B] uppercase">
              {STUDIO_CONFIG.brandName} · {STUDIO_CONFIG.hours.label}
            </p>

            <h1 className="font-display text-[clamp(2.25rem,4.3vw,3.9rem)] font-bold leading-[1.08] tracking-tight text-[#F5F2EB] text-balance">
              {STUDIO_CONFIG.tagline}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#D4D0C7] sm:text-lg">
              {STUDIO_CONFIG.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#booking"
                className="inline-flex min-h-[46px] items-center gap-2.5 rounded-lg bg-[#C8A04B] px-6 py-3 text-sm font-semibold text-[#060607] transition-all duration-150 hover:bg-[#D8B25D] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A04B]"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#portfolio"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-white/20 bg-[#0B0B0D]/70 px-6 py-3 text-sm font-medium text-[#F5F2EB] backdrop-blur-sm transition-colors duration-150 hover:border-[#C8A04B]/60 hover:bg-white/10 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A04B]"
              >
                <span>View Portfolio</span>
                <ChevronDown className="h-4 w-4 text-[#C8A04B]" />
              </a>
            </div>
          </motion.div>

          {/* Official Studio Crest Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:col-span-5 lg:justify-end"
          >
            <div className="relative rounded-2xl border border-[#C8A04B]/25 bg-[#09090B]/80 p-5 shadow-2xl backdrop-blur-md sm:p-7">
              <ResilientImage
                src={STUDIO_CONFIG.logoUrl}
                alt="T-Rex Tattoos and Piercing official metallic crest"
                loading="eager"
                className="h-56 w-56 rounded-full object-cover shadow-xl ring-1 ring-[#C8A04B]/30 sm:h-72 sm:w-72"
              />
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#A19E95]">
                <span>Lead Artist Nithin Raj</span>
                <span aria-hidden="true">·</span>
                <span>Est. 5+ Years Craft</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-Width 4-Column Studio Facts Strip */}
      <div className="border-t border-white/10 bg-[#0B0B0D]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-y divide-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          <div className="px-4 py-5 sm:px-6">
            <p className="text-xs font-medium text-[#A19E95]">Studio Hours</p>
            <p className="mt-1 font-mono text-base font-medium text-[#F5F2EB] tabular-nums sm:text-lg">
              {STUDIO_CONFIG.hours.label} · Mon–Sun
            </p>
          </div>
          <div className="border-l border-white/10 px-4 py-5 sm:border-l-0 sm:px-6">
            <p className="text-xs font-medium text-[#A19E95]">Tattoos Starting</p>
            <p className="mt-1 font-mono text-base font-medium text-[#C8A04B] tabular-nums sm:text-lg">
              {STUDIO_CONFIG.pricing.tattooStarting}
            </p>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <p className="text-xs font-medium text-[#A19E95]">Piercings Starting</p>
            <p className="mt-1 font-mono text-base font-medium text-[#C8A04B] tabular-nums sm:text-lg">
              {STUDIO_CONFIG.pricing.piercingStarting}
            </p>
          </div>
          <div className="border-l border-white/10 px-4 py-5 sm:border-l-0 sm:px-6">
            <p className="text-xs font-medium text-[#A19E95]">Lead Artist</p>
            <p className="mt-1 text-base font-semibold text-[#F5F2EB] sm:text-lg">
              {STUDIO_CONFIG.leadArtist.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
