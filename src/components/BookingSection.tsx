import { ChangeEvent, DragEvent, FormEvent, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { STUDIO_CONFIG } from '../data/studioConfig';
import { analyzeUploadedTattooFile } from '../services/visionAnalyzer';
import { BookingPrefill } from './PortfolioSection';

interface BookingSectionProps {
  prefill: BookingPrefill | null;
}

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  tattooIdea: string;
  tattooSize: string;
  placement: string;
  preferredArtist: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  tattooIdea?: string;
  placement?: string;
}

const SIZE_PRESETS = [
  'Micro / Minimal (1–2 in)',
  'Small (2–4 in)',
  'Medium (4–6 in)',
  'Large / Half Sleeve',
  'Full Sleeve / Backpiece',
  'Body Piercing',
];

export function BookingSection({ prefill }: BookingSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>({
    fullName: '',
    phone: '',
    email: '',
    tattooIdea: '',
    tattooSize: 'Medium (4–6 in)',
    placement: STUDIO_CONFIG.placementsList[0],
    preferredArtist: STUDIO_CONFIG.artistsList[0],
  });

  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreviewUrl, setReferencePreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzingReference, setIsAnalyzingReference] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedRefCode, setSubmittedRefCode] = useState<string | null>(null);

  useEffect(() => {
    if (!prefill) return;
    setForm((prev) => ({
      ...prev,
      tattooIdea: prefill.idea,
      placement: STUDIO_CONFIG.placementsList.includes(prefill.placement)
        ? prefill.placement
        : prev.placement,
      preferredArtist: STUDIO_CONFIG.artistsList.includes(prefill.artist)
        ? prefill.artist
        : prev.preferredArtist,
    }));
    setSubmittedRefCode(null);
  }, [prefill]);

  useEffect(() => {
    return () => {
      if (referencePreviewUrl) {
        URL.revokeObjectURL(referencePreviewUrl);
      }
    };
  }, [referencePreviewUrl]);

  const handleSelectedFile = async (file: File | null) => {
    setFileError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please upload an image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('Reference image must be 10 MB or smaller.');
      return;
    }

    if (referencePreviewUrl) {
      URL.revokeObjectURL(referencePreviewUrl);
    }

    setReferenceFile(file);
    setReferencePreviewUrl(URL.createObjectURL(file));

    setIsAnalyzingReference(true);
    try {
      const { analysis } = await analyzeUploadedTattooFile(file);
      setForm((prev) => ({
        ...prev,
        tattooIdea:
          prev.tattooIdea.trim().length > 0
            ? prev.tattooIdea
            : `${analysis.title} (${analysis.style}) — ${analysis.caption}`,
      }));
    } catch {
      // Keep uploaded reference preview intact even if Vision AI auto-fill is unavailable
    } finally {
      setIsAnalyzingReference(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleSelectedFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] || null;
    handleSelectedFile(file);
  };

  const clearReferenceImage = () => {
    if (referencePreviewUrl) {
      URL.revokeObjectURL(referencePreviewUrl);
    }
    setReferenceFile(null);
    setReferencePreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10) {
      nextErrors.phone = 'Enter a valid 10-digit phone or WhatsApp number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.tattooIdea.trim() || form.tattooIdea.trim().length < 6) {
      nextErrors.tattooIdea = 'Describe your tattoo or piercing idea (at least 6 characters).';
    }

    if (!form.placement) {
      nextErrors.placement = 'Please select a body placement.';
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const code = `TREX-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRefCode(code);
  };

  const buildWhatsAppHandoffUrl = () => {
    const lines = [
      `Hello T-REX TATTOOS & PIERCING, I would like to book a consultation (${submittedRefCode || 'New Request'}).`,
      `Name: ${form.fullName}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Idea: ${form.tattooIdea}`,
      `Size: ${form.tattooSize}`,
      `Placement: ${form.placement}`,
      `Preferred Artist: ${form.preferredArtist}`,
      referenceFile ? `Reference Image: ${referenceFile.name} (ready to attach in chat)` : '',
    ].filter(Boolean);

    return `${STUDIO_CONFIG.contact.whatsappLink}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handleReset = () => {
    setSubmittedRefCode(null);
    setForm({
      fullName: '',
      phone: '',
      email: '',
      tattooIdea: '',
      tattooSize: 'Medium (4–6 in)',
      placement: STUDIO_CONFIG.placementsList[0],
      preferredArtist: STUDIO_CONFIG.artistsList[0],
    });
    clearReferenceImage();
    setErrors({});
  };

  return (
    <section id="booking" className="border-b border-white/10 bg-[#060607]">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Guidance Column */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#C8A04B] uppercase">
              Book a Consultation
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F5F2EB] sm:text-4xl text-balance">
              Reserve Your Session or Concept Review
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#A19E95] sm:text-base">
              Share your tattoo vision, approximate size, placement, and any visual references. Lead Artist{' '}
              <span className="text-[#F5F2EB] font-medium">{STUDIO_CONFIG.leadArtist.name}</span> and our studio team review inquiries around the clock.
            </p>

            <div className="mt-8 divide-y divide-white/10 border-t border-b border-white/10 text-sm">
              <div className="py-4">
                <p className="font-medium text-[#F5F2EB]">Studio Hours</p>
                <p className="mt-1 text-[#A19E95]">
                  {STUDIO_CONFIG.hours.full}
                </p>
              </div>
              <div className="py-4">
                <p className="font-medium text-[#F5F2EB]">Starting Pricing</p>
                <p className="mt-1 font-mono text-xs text-[#C8A04B] tabular-nums sm:text-sm">
                  Tattoos from {STUDIO_CONFIG.pricing.tattooStarting} · Piercings from{' '}
                  {STUDIO_CONFIG.pricing.piercingStarting}
                </p>
              </div>
              <div className="py-4">
                <p className="font-medium text-[#F5F2EB]">Direct WhatsApp Desk</p>
                <a
                  href={STUDIO_CONFIG.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 font-mono text-sm text-[#C8A04B] hover:underline"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{STUDIO_CONFIG.contact.whatsappDisplay}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Form / Confirmation Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#101012] p-6 sm:p-8">
              {submittedRefCode ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />
                    <div>
                      <p className="font-mono text-xs font-medium text-[#C8A04B] tabular-nums">
                        REQUEST LOGGED · {submittedRefCode}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-[#F5F2EB]">
                        Consultation Details Prepared
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#C7C3B9]">
                        Thank you, <span className="font-medium text-[#F5F2EB]">{form.fullName}</span>. Your session brief is ready. For instant slot confirmation, send your brief directly to our WhatsApp desk below.
                      </p>
                    </div>
                  </div>

                  <dl className="divide-y divide-white/10 rounded-xl border border-white/10 bg-[#08080A] px-4 text-sm">
                    <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row">
                      <dt className="text-[#A19E95]">Contact</dt>
                      <dd className="text-[#F5F2EB]">
                        {form.phone} · {form.email}
                      </dd>
                    </div>
                    <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row">
                      <dt className="text-[#A19E95]">Concept &amp; Size</dt>
                      <dd className="text-[#F5F2EB] sm:text-right">
                        {form.tattooIdea} ({form.tattooSize})
                      </dd>
                    </div>
                    <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row">
                      <dt className="text-[#A19E95]">Placement &amp; Artist</dt>
                      <dd className="text-[#F5F2EB]">
                        {form.placement} · {form.preferredArtist}
                      </dd>
                    </div>
                    {referencePreviewUrl && referenceFile && (
                      <div className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-[#A19E95]">Reference</dt>
                        <dd className="flex items-center gap-3">
                          <img
                            src={referencePreviewUrl}
                            alt="Uploaded tattoo reference"
                            className="h-12 w-12 rounded-lg border border-white/15 object-cover"
                          />
                          <span className="max-w-[180px] truncate text-xs text-[#F5F2EB]">
                            {referenceFile.name}
                          </span>
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={buildWhatsAppHandoffUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#C8A04B] px-5 py-3 text-sm font-semibold text-[#060607] transition-colors hover:bg-[#D8B25D]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Send Details on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-[#F5F2EB] transition-colors hover:bg-white/5"
                    >
                      New Consultation
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="booking-name"
                        className="block text-xs font-medium text-[#D4D0C7]"
                      >
                        Full Name <span className="text-[#C8A04B]">*</span>
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Arjun Menon"
                        value={form.fullName}
                        onChange={(e) => {
                          setForm({ ...form, fullName: e.target.value });
                          if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                        }}
                        aria-invalid={Boolean(errors.fullName)}
                        className="mt-2 block w-full rounded-lg border border-white/15 bg-[#08080A] px-3.5 py-2.5 text-sm text-[#F5F2EB] placeholder-[#6B6860] transition-colors focus:border-[#C8A04B] focus:outline-none"
                      />
                      {errors.fullName && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="block text-xs font-medium text-[#D4D0C7]"
                      >
                        Phone / WhatsApp Number <span className="text-[#C8A04B]">*</span>
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="e.g. +91 96056 36575"
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        aria-invalid={Boolean(errors.phone)}
                        className="mt-2 block w-full rounded-lg border border-white/15 bg-[#08080A] px-3.5 py-2.5 text-sm text-[#F5F2EB] placeholder-[#6B6860] transition-colors focus:border-[#C8A04B] focus:outline-none"
                      />
                      {errors.phone && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="booking-email"
                      className="block text-xs font-medium text-[#D4D0C7]"
                    >
                      Email Address <span className="text-[#C8A04B]">*</span>
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      aria-invalid={Boolean(errors.email)}
                      className="mt-2 block w-full rounded-lg border border-white/15 bg-[#08080A] px-3.5 py-2.5 text-sm text-[#F5F2EB] placeholder-[#6B6860] transition-colors focus:border-[#C8A04B] focus:outline-none"
                    />
                    {errors.email && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Tattoo Idea & Size */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
                    <div className="sm:col-span-7">
                      <label
                        htmlFor="booking-idea"
                        className="block text-xs font-medium text-[#D4D0C7]"
                      >
                        Tattoo Idea / Piercing Concept <span className="text-[#C8A04B]">*</span>
                      </label>
                      <textarea
                        id="booking-idea"
                        rows={3}
                        placeholder="Describe your design idea, style (realism, fine line, script, cover-up), or piercing type..."
                        value={form.tattooIdea}
                        onChange={(e) => {
                          setForm({ ...form, tattooIdea: e.target.value });
                          if (errors.tattooIdea) setErrors({ ...errors, tattooIdea: undefined });
                        }}
                        aria-invalid={Boolean(errors.tattooIdea)}
                        className="mt-2 block w-full resize-y rounded-lg border border-white/15 bg-[#08080A] px-3.5 py-2.5 text-sm text-[#F5F2EB] placeholder-[#6B6860] transition-colors focus:border-[#C8A04B] focus:outline-none"
                      />
                      {errors.tattooIdea && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.tattooIdea}</span>
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-5">
                      <label
                        htmlFor="booking-size"
                        className="block text-xs font-medium text-[#D4D0C7]"
                      >
                        Approximate Size
                      </label>
                      <select
                        id="booking-size"
                        value={form.tattooSize}
                        onChange={(e) => setForm({ ...form, tattooSize: e.target.value })}
                        className="mt-2 block w-full rounded-lg border border-white/15 bg-[#08080A] px-3.5 py-2.5 text-sm text-[#F5F2EB] transition-colors focus:border-[#C8A04B] focus:outline-none"
                      >
                        {SIZE_PRESETS.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Placement & Preferred Artist */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="booking-placement"
                        className="block text-xs font-medium text-[#D4D0C7]"
                      >
                        Placement <span className="text-[#C8A04B]">*</span>
                      </label>
                      <select
                        id="booking-placement"
                        value={form.placement}
                        onChange={(e) => setForm({ ...form, placement: e.target.value })}
                        className="mt-2 block w-full rounded-lg border border-white/15 bg-[#08080A] px-3.5 py-2.5 text-sm text-[#F5F2EB] transition-colors focus:border-[#C8A04B] focus:outline-none"
                      >
                        {STUDIO_CONFIG.placementsList.map((placement) => (
                          <option key={placement} value={placement}>
                            {placement}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="booking-artist"
                        className="block text-xs font-medium text-[#D4D0C7]"
                      >
                        Preferred Artist
                      </label>
                      <select
                        id="booking-artist"
                        value={form.preferredArtist}
                        onChange={(e) => setForm({ ...form, preferredArtist: e.target.value })}
                        className="mt-2 block w-full rounded-lg border border-white/15 bg-[#08080A] px-3.5 py-2.5 text-sm text-[#F5F2EB] transition-colors focus:border-[#C8A04B] focus:outline-none"
                      >
                        {STUDIO_CONFIG.artistsList.map((artist) => (
                          <option key={artist} value={artist}>
                            {artist}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Reference Image Upload */}
                  <div>
                    <label
                      htmlFor="booking-reference"
                      className="block text-xs font-medium text-[#D4D0C7]"
                    >
                      Reference Image Upload (Optional)
                    </label>

                    {referencePreviewUrl && referenceFile ? (
                      <div className="mt-2 flex items-center justify-between gap-4 rounded-xl border border-[#C8A04B]/40 bg-[#08080A] p-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={referencePreviewUrl}
                            alt="Reference upload preview"
                            className="h-16 w-16 shrink-0 rounded-lg border border-white/10 object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#F5F2EB]">
                              {referenceFile.name}
                            </p>
                            {isAnalyzingReference ? (
                              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#C8A04B]">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Analyzing reference with Vision AI...</span>
                              </p>
                            ) : (
                              <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-[#A19E95] tabular-nums">
                                <Sparkles className="h-3.5 w-3.5 text-[#C8A04B]" />
                                <span>{(referenceFile.size / 1024).toFixed(0)} KB · Ready for review</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={clearReferenceImage}
                          aria-label="Remove uploaded reference image"
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#A19E95] transition-colors hover:border-rose-400/50 hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-colors ${
                          isDragging
                            ? 'border-[#C8A04B] bg-[#C8A04B]/10'
                            : 'border-white/20 bg-[#08080A] hover:border-[#C8A04B]/60'
                        }`}
                      >
                        <Upload className="h-5 w-5 text-[#C8A04B]" />
                        <p className="mt-2 text-sm text-[#D4D0C7]">
                          Drag and drop a sketch or inspiration photo, or{' '}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="font-semibold text-[#C8A04B] underline-offset-4 hover:underline"
                          >
                            browse files
                          </button>
                        </p>
                        <p className="mt-1 text-xs text-[#A19E95]">
                          JPG, PNG, or WEBP up to 10 MB
                        </p>
                        <input
                          ref={fileInputRef}
                          id="booking-reference"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </div>
                    )}

                    {fileError && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{fileError}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#C8A04B] px-6 py-3 text-sm font-semibold text-[#060607] transition-colors duration-150 hover:bg-[#D8B25D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A04B]"
                    >
                      Submit Consultation Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
