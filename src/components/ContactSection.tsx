import { useState } from 'react';
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { STUDIO_CONFIG } from '../data/studioConfig';

export function ContactSection() {
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

  const handleCopyWhatsapp = async () => {
    try {
      await navigator.clipboard.writeText(STUDIO_CONFIG.contact.whatsappDisplay);
      setCopiedWhatsapp(true);
      setTimeout(() => setCopiedWhatsapp(false), 2000);
    } catch {
      setCopiedWhatsapp(false);
    }
  };

  return (
    <section id="contact" className="border-b border-white/10 bg-[#08080A]">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#C8A04B] uppercase">
            Contact Us
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F5F2EB] sm:text-4xl text-balance">
            Visit the Studio or Message Us Directly
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#A19E95] sm:text-base">
            Walk-in inquiries, late-night sessions, and custom consultations welcome 24 hours a day, Monday through Sunday.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Contact Channels Column */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#101012] p-6 sm:p-8 lg:col-span-5">
            <div className="divide-y divide-white/10">
              {/* WhatsApp */}
              <div className="pb-6">
                <p className="text-xs font-medium text-[#A19E95]">WhatsApp &amp; Direct Call</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={STUDIO_CONFIG.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 font-mono text-lg font-medium text-[#F5F2EB] transition-colors hover:text-[#C8A04B] tabular-nums"
                  >
                    <MessageCircle className="h-5 w-5 text-[#C8A04B]" />
                    <span>{STUDIO_CONFIG.contact.whatsappDisplay}</span>
                  </a>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyWhatsapp}
                      aria-label="Copy WhatsApp number"
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-[#D4D0C7] transition-colors hover:border-[#C8A04B]/60 hover:text-[#F5F2EB]"
                    >
                      {copiedWhatsapp ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <a
                      href={STUDIO_CONFIG.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#C8A04B] px-3.5 py-1.5 text-xs font-semibold text-[#060607] transition-colors hover:bg-[#D8B25D]"
                    >
                      <span>Chat</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="py-6">
                <p className="text-xs font-medium text-[#A19E95]">Email</p>
                <a
                  href={`mailto:${STUDIO_CONFIG.contact.email}`}
                  className="mt-2 inline-flex items-center gap-2.5 break-all text-base font-medium text-[#F5F2EB] transition-colors hover:text-[#C8A04B]"
                >
                  <Mail className="h-5 w-5 shrink-0 text-[#C8A04B]" />
                  <span>{STUDIO_CONFIG.contact.email}</span>
                </a>
              </div>

              {/* Instagram */}
              <div className="py-6">
                <p className="text-xs font-medium text-[#A19E95]">Instagram</p>
                <a
                  href={STUDIO_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2.5 text-base font-medium text-[#F5F2EB] transition-colors hover:text-[#C8A04B]"
                >
                  <Instagram className="h-5 w-5 shrink-0 text-[#C8A04B]" />
                  <span>{STUDIO_CONFIG.contact.instagramHandle}</span>
                  <ExternalLink className="h-4 w-4 text-[#A19E95]" />
                </a>
              </div>

              {/* Hours & Location Summary */}
              <div className="pt-6">
                <p className="text-xs font-medium text-[#A19E95]">Hours &amp; Studio Location</p>
                <div className="mt-2 space-y-2 text-sm text-[#D4D0C7]">
                  <p className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 shrink-0 text-[#C8A04B]" />
                    <span>{STUDIO_CONFIG.hours.full}</span>
                  </p>
                  <a
                    href={STUDIO_CONFIG.contact.mapDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-[#C8A04B] hover:underline"
                  >
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{STUDIO_CONFIG.contact.addressLabel}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101012] lg:col-span-7">
            <div className="relative h-full min-h-[360px] w-full lg:min-h-[450px]">
              <iframe
                title="T-Rex Tattoos & Piercing Studio Location Map"
                src={STUDIO_CONFIG.contact.mapEmbedUrl}
                className="h-full min-h-[360px] w-full border-0 lg:min-h-[450px]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
