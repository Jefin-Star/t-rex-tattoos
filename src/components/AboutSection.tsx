import { STUDIO_CONFIG } from '../data/studioConfig';
import { ArtistProfileCard } from './ArtistProfileCard';

export function AboutSection() {
  return (
    <section id="about" className="border-b border-white/10 bg-[#060607]">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        {/* Section Intro */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#C8A04B] uppercase">
            About Our Studio
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F5F2EB] sm:text-4xl text-balance">
            Artistry Guided by Discipline, Hygiene &amp; Round-the-Clock Access
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#E3DFD7] sm:text-lg">
            {STUDIO_CONFIG.aboutParagraph}
          </p>
        </div>

        {/* Featured 2-Column Master Artist Profile Showcase */}
        <ArtistProfileCard />

        {/* 2-Column Editorial Split: Pricing vs Studio Standards */}
        <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Transparent Starting Pricing */}
          <div className="space-y-8 lg:col-span-5">
            {/* Transparent Starting Rates */}
            <div className="rounded-2xl border border-white/10 bg-[#101012] p-6 sm:p-8">
              <h3 className="font-display text-lg font-bold text-[#F5F2EB]">
                Studio Base Rates
              </h3>
              <div className="mt-5 divide-y divide-white/10">
                {STUDIO_CONFIG.pricing.tiers.map((tier) => (
                  <div key={tier.service} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-base font-semibold text-[#F5F2EB]">
                        {tier.service}
                      </span>
                      <span className="font-mono text-lg font-medium text-[#C8A04B] tabular-nums">
                        From {tier.startingPrice}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#A19E95]">{tier.note}</p>
                    <ul className="mt-3 space-y-1.5 text-sm text-[#C7C3B9]">
                      {tier.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#C8A04B]" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Studio Philosophy & Safety Standards */}
          <div className="lg:col-span-7">
            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              {STUDIO_CONFIG.standards.map((item) => (
                <div key={item.index} className="py-7 first:pt-6 last:pb-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="font-mono text-sm font-medium text-[#C8A04B] tabular-nums shrink-0">
                      {item.index}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-[#F5F2EB]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#A19E95] sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Editorial Marquee Divider */}
      <div
        aria-hidden="true"
        className="overflow-hidden border-t border-white/10 bg-[#0B0B0D] py-3.5"
      >
        <div className="animate-marquee text-xs font-medium tracking-[0.2em] text-[#A19E95] uppercase">
          <span className="px-6">
            Black &amp; Grey Realism · Fine Line Ink · Neo-Traditional · Custom Sleeves · Sterile Body Piercings · Open 24/7 Mon–Sun ·
          </span>
          <span className="px-6">
            Black &amp; Grey Realism · Fine Line Ink · Neo-Traditional · Custom Sleeves · Sterile Body Piercings · Open 24/7 Mon–Sun ·
          </span>
        </div>
      </div>
    </section>
  );
}
