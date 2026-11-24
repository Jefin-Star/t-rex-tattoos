import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Maximize2,
  Sparkles,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { PORTFOLIO_ITEMS, PortfolioItem } from '../data/studioConfig';
import {
  analyzeLocalStudioAsset,
  analyzeUploadedTattooFile,
} from '../services/visionAnalyzer';
import { ResilientImage } from './ResilientImage';

export interface BookingPrefill {
  idea: string;
  placement: string;
  artist: string;
}

interface PortfolioSectionProps {
  onSelectForBooking: (prefill: BookingPrefill) => void;
}

export function PortfolioSection({ onSelectForBooking }: PortfolioSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chapterRefs = useRef<Record<string, HTMLElement | null>>({});

  const [items, setItems] = useState<PortfolioItem[]>(PORTFOLIO_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>('All Work');
  const [activeId, setActiveId] = useState<string>(PORTFOLIO_ITEMS[0].id);

  // Automatic Vision AI upload state
  const [isDragging, setIsDragging] = useState(false);
  const [analyzingName, setAnalyzingName] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Lightbox Modal Zoom state
  const [modalItem, setModalItem] = useState<PortfolioItem | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const categories = useMemo(() => {
    const base = ['All Work', 'Black & Grey', 'Micro-Realism', 'Blackwork', 'Body Piercing'];
    const hasCustomStyles = items.some(
      (item) => item.isUserUploaded || !base.includes(item.category)
    );
    return hasCustomStyles ? [...base, 'User Uploads'] : base;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All Work') return items;
    if (activeCategory === 'User Uploads') {
      return items.filter((item) => item.isUserUploaded);
    }
    return items.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory, items]);

  // Keep activeId synced with filtered list
  useEffect(() => {
    if (filteredItems.length === 0) return;
    if (!filteredItems.some((item) => item.id === activeId)) {
      setActiveId(filteredItems[0].id);
    }
  }, [filteredItems, activeId]);

  // IntersectionObserver for Layered Sticky Scroll transitions
  useEffect(() => {
    if (filteredItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-chapter-id');
            if (id) {
              setActiveId(id);
            }
          }
        }
      },
      {
        root: null,
        rootMargin: '-28% 0px -42% 0px',
        threshold: 0.2,
      }
    );

    for (const item of filteredItems) {
      const node = chapterRefs.current[item.id];
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [filteredItems]);

  const activeIndex = useMemo(() => {
    const idx = filteredItems.findIndex((item) => item.id === activeId);
    return idx >= 0 ? idx : 0;
  }, [filteredItems, activeId]);

  const activeItem = filteredItems[activeIndex] || filteredItems[0] || null;

  const modalIndex = useMemo(() => {
    if (!modalItem) return -1;
    return filteredItems.findIndex((item) => item.id === modalItem.id);
  }, [filteredItems, modalItem]);

  // Modal keyboard controls
  useEffect(() => {
    if (!modalItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalItem(null);
        setIsZoomed(false);
      } else if (event.key === 'ArrowRight' && filteredItems.length > 1) {
        const nextIdx = (modalIndex + 1) % filteredItems.length;
        setModalItem(filteredItems[nextIdx]);
        setIsZoomed(false);
      } else if (event.key === 'ArrowLeft' && filteredItems.length > 1) {
        const prevIdx = (modalIndex - 1 + filteredItems.length) % filteredItems.length;
        setModalItem(filteredItems[prevIdx]);
        setIsZoomed(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalItem, modalIndex, filteredItems]);

  const processUploadedFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setAiError(null);

    const files = Array.from(fileList);
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setAiError(`"${file.name}" is not a supported image. Upload JPG, PNG, or WEBP.`);
        continue;
      }
      if (file.size > 12 * 1024 * 1024) {
        setAiError(`"${file.name}" exceeds 12 MB. Please choose a smaller photo.`);
        continue;
      }

      setAnalyzingName(file.name);
      try {
        const { previewDataUrl, analysis } = await analyzeUploadedTattooFile(file);
        const newId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        const newItem: PortfolioItem = {
          id: newId,
          title: analysis.title,
          category: analysis.style,
          artist: analysis.style.toLowerCase().includes('pierc')
            ? 'Studio Piercing Team'
            : 'Nithin Raj',
          placement: analysis.placement,
          duration: analysis.estimatedSession,
          inkPalette: analysis.inkPalette,
          description: analysis.caption,
          tags: analysis.tags,
          image: previewDataUrl,
          isUserUploaded: true,
          isAiAnalyzed: true,
        };

        setItems((prev) => [newItem, ...prev]);
        setActiveCategory('All Work');
        setActiveId(newId);

        setTimeout(() => {
          const el = chapterRefs.current[newId];
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 120);
      } catch (err) {
        setAiError(
          err instanceof Error
            ? err.message
            : 'Unable to analyze uploaded tattoo image right now.'
        );
      } finally {
        setAnalyzingName(null);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    void processUploadedFiles(event.target.files);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void processUploadedFiles(event.dataTransfer.files);
  };

  const handleReanalyzeExisting = async (item: PortfolioItem) => {
    if (analyzingId || analyzingName) return;
    setAiError(null);
    setAnalyzingId(item.id);

    try {
      const analysis = item.image.startsWith('data:')
        ? (
            await fetch('/api/analyze-tattoo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageBase64: item.image,
                mimeType: 'image/jpeg',
              }),
            }).then(async (r) => {
              const payload = await r.json();
              if (!r.ok || !payload.analysis) {
                throw new Error(payload.error || 'Vision AI analysis failed.');
              }
              return payload.analysis;
            })
          )
        : await analyzeLocalStudioAsset(item.image);

      setItems((prev) =>
        prev.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                title: analysis.title,
                category: analysis.style,
                placement: analysis.placement,
                duration: analysis.estimatedSession,
                inkPalette: analysis.inkPalette,
                description: analysis.caption,
                tags: analysis.tags,
                isAiAnalyzed: true,
              }
            : entry
        )
      );
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : 'Vision AI scan could not complete.'
      );
    } finally {
      setAnalyzingId(null);
    }
  };

  const jumpToChapter = (id: string) => {
    setActiveId(id);
    const el = chapterRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleBookSimilar = (item: PortfolioItem) => {
    setModalItem(null);
    setIsZoomed(false);
    onSelectForBooking({
      idea: `Inspired by "${item.title}" (${item.category}) — ${item.tags.slice(0, 3).join(', ')}`,
      placement:
        item.category.toLowerCase().includes('pierc')
          ? 'Ear / Nose / Body Piercing'
          : item.placement.toLowerCase().includes('wrist')
            ? 'Inner Wrist'
            : item.placement.toLowerCase().includes('back')
              ? 'Upper Back / Spine'
              : item.placement.toLowerCase().includes('forearm')
                ? 'Forearm / Inner Arm'
                : 'Other / Custom Placement',
      artist:
        item.artist === 'Nithin Raj'
          ? 'Nithin Raj (Lead Artist)'
          : 'Studio Piercing Specialist',
    });
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="portfolio" className="border-b border-white/10 bg-[#08080A]">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        {/* Section Heading & Automatic Vision AI Dropzone */}
        <div className="grid grid-cols-1 items-end gap-8 border-b border-white/10 pb-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#C8A04B] uppercase">
              Portfolio &amp; Vision AI Curator
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F5F2EB] sm:text-4xl text-balance">
              Layered Studio Archive
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#A19E95] sm:text-base">
              Scroll through recent ink and piercing work below. Upload your own tattoo photo or reference to let our Vision AI automatically identify style, placement, tags, and studio captions—then seamlessly insert it into the sticky gallery.
            </p>
          </div>

          {/* Automatic Vision AI Upload Dropzone */}
          <div className="lg:col-span-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-2xl border border-dashed p-5 transition-colors duration-150 ${
                isDragging
                  ? 'border-[#C8A04B] bg-[#C8A04B]/10'
                  : 'border-white/20 bg-[#101012] hover:border-[#C8A04B]/60'
              }`}
            >
              {analyzingName ? (
                <div className="flex items-center gap-4 py-2">
                  <Loader2 className="h-6 w-6 shrink-0 animate-spin text-[#C8A04B]" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#F5F2EB]">
                      Vision AI analyzing "{analyzingName}"...
                    </p>
                    <p className="mt-0.5 text-xs text-[#A19E95]">
                      Identifying style, motifs, anatomical placement, and generating gallery tags.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C8A04B]/30 bg-[#08080A] text-[#C8A04B]">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F5F2EB]">
                        Upload Tattoo for Instant Vision AI Tagging
                      </p>
                      <p className="mt-0.5 text-xs text-[#A19E95]">
                        Drop JPG, PNG, or WEBP here—automatically analyzed and added to the gallery.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-lg bg-[#C8A04B] px-4 py-2 text-xs font-semibold text-[#060607] transition-colors hover:bg-[#D8B25D] whitespace-nowrap"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Upload &amp; Analyze</span>
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Upload tattoo image for automatic Vision AI analysis"
              />
            </div>

            {aiError && (
              <div
                role="alert"
                className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-950/30 px-4 py-2.5 text-xs text-rose-300"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{aiError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAiError(null)}
                  aria-label="Dismiss error"
                  className="text-rose-300/80 hover:text-rose-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter tattoo styles"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-[#101012] p-1.5"
          >
            {categories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C8A04B] ${
                    active
                      ? 'bg-[#C8A04B] font-semibold text-[#060607]'
                      : 'text-[#A19E95] hover:bg-white/5 hover:text-[#F5F2EB]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <p className="font-mono text-xs text-[#A19E95] tabular-nums">
            {filteredItems.length} {filteredItems.length === 1 ? 'Work' : 'Works'} in View
          </p>
        </div>

        {/* Layered Sticky Scroll Gallery */}
        {filteredItems.length > 0 && activeItem && (
          <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* LEFT: Sticky Layered Visual Stage (Desktop) */}
            <div className="hidden lg:col-span-7 lg:block lg:sticky lg:top-24">
              <div className="relative h-[600px] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#060607] shadow-2xl">
                {/* Stacked Image Layers transitioning smoothly via opacity & scale */}
                {filteredItems.map((item, idx) => {
                  const isActive = item.id === activeItem.id;
                  const isPrevious = idx < activeIndex;
                  return (
                    <div
                      key={item.id}
                      aria-hidden={!isActive}
                      className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive
                          ? 'z-10 opacity-100 scale-100 translate-y-0'
                          : isPrevious
                            ? 'z-0 opacity-0 scale-[0.97] -translate-y-4 pointer-events-none'
                            : 'z-0 opacity-0 scale-[1.03] translate-y-4 pointer-events-none'
                      }`}
                    >
                      <ResilientImage
                        src={item.image}
                        alt={`${item.title} — ${item.category}`}
                        fallbackTitle={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#060607]/90 via-transparent to-[#060607]/55"
                      />
                    </div>
                  );
                })}

                {/* Top Sticky Stage Toolbar */}
                <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-[#F5F2EB]">
                    <span className="font-mono text-sm font-semibold text-[#C8A04B] tabular-nums">
                      {String(activeIndex + 1).padStart(2, '0')} /{' '}
                      {String(filteredItems.length).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true" className="text-white/40">
                      ·
                    </span>
                    <span>{activeItem.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={Boolean(analyzingId)}
                      onClick={() => void handleReanalyzeExisting(activeItem)}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#060607]/80 px-3 py-1.5 text-xs font-medium text-[#F5F2EB] backdrop-blur-sm transition-colors hover:border-[#C8A04B] hover:text-[#C8A04B] disabled:opacity-60"
                    >
                      {analyzingId === activeItem.id ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C8A04B]" />
                          <span>Scanning...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-[#C8A04B]" />
                          <span>Vision AI Scan</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModalItem(activeItem);
                        setIsZoomed(false);
                      }}
                      aria-label={`Inspect ${activeItem.title} in full-screen zoom`}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#060607]/80 px-3 py-1.5 text-xs font-medium text-[#F5F2EB] backdrop-blur-sm transition-colors hover:border-[#C8A04B] hover:text-[#C8A04B]"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Zoom</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Sticky Stage Info & Chapter Progress Rail */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                  <p className="text-xs font-medium text-[#C8A04B]">
                    {activeItem.placement} · {activeItem.artist}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold text-[#F5F2EB]">
                    {activeItem.title}
                  </h3>

                  {/* Interactive Chapter Stepper */}
                  <div className="mt-4 flex items-center gap-2">
                    {filteredItems.map((item, idx) => {
                      const active = item.id === activeItem.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => jumpToChapter(item.id)}
                          aria-label={`Jump to chapter ${idx + 1}: ${item.title}`}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                            active
                              ? 'bg-[#C8A04B]'
                              : 'bg-white/20 hover:bg-white/40'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Scroll-Driven Chapters (Images + AI Descriptions) */}
            <div className="divide-y divide-white/10 lg:col-span-5">
              {filteredItems.map((item, idx) => {
                const isActive = item.id === activeItem.id;
                return (
                  <article
                    key={item.id}
                    ref={(el) => {
                      chapterRefs.current[item.id] = el;
                    }}
                    data-chapter-id={item.id}
                    onClick={() => setActiveId(item.id)}
                    className={`py-8 transition-opacity duration-300 first:pt-0 lg:min-h-[470px] lg:flex lg:flex-col lg:justify-center lg:py-12 ${
                      isActive
                        ? 'opacity-100'
                        : 'lg:opacity-45 hover:lg:opacity-85'
                    }`}
                  >
                    {/* Mobile & Tablet Inline Layered Frame */}
                    <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-[#101012] lg:hidden">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalItem(item);
                          setIsZoomed(false);
                        }}
                        className="relative block aspect-[4/3] w-full overflow-hidden"
                      >
                        <ResilientImage
                          src={item.image}
                          alt={item.title}
                          fallbackTitle={item.title}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-[#060607]/75 text-[#F5F2EB]">
                          <Maximize2 className="h-4 w-4" />
                        </span>
                      </button>
                    </div>

                    {/* Chapter Metadata (Unboxed with · separators) */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#A19E95]">
                      <span className="font-mono font-semibold text-[#C8A04B] tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#F5F2EB]">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.placement}</span>
                      {(item.isAiAnalyzed || item.isUserUploaded) && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 text-[#C8A04B]">
                            <Sparkles className="h-3 w-3" />
                            <span>Vision AI Analyzed</span>
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-[#F5F2EB]">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#C7C3B9] sm:text-base">
                      {item.description}
                    </p>

                    {/* Descriptive AI Tags */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/10 bg-[#101012] px-2.5 py-1 text-xs text-[#D4D0C7]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Technical Breakdown */}
                    <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
                      <div>
                        <dt className="text-[#A19E95]">Ink / Material</dt>
                        <dd className="mt-1 font-medium text-[#F5F2EB]">
                          {item.inkPalette}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#A19E95]">Session &amp; Artist</dt>
                        <dd className="mt-1 font-medium text-[#F5F2EB]">
                          {item.duration} · {item.artist}
                        </dd>
                      </div>
                    </dl>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookSimilar(item);
                        }}
                        className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#C8A04B] px-4 py-2 text-xs font-semibold text-[#060607] transition-colors hover:bg-[#D8B25D]"
                      >
                        Book Similar Style
                      </button>

                      <button
                        type="button"
                        disabled={Boolean(analyzingId)}
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleReanalyzeExisting(item);
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-2 text-xs font-medium text-[#D4D0C7] transition-colors hover:border-[#C8A04B]/60 hover:text-[#F5F2EB] lg:hidden"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#C8A04B]" />
                        <span>
                          {analyzingId === item.id ? 'Scanning...' : 'Vision AI Scan'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalItem(item);
                          setIsZoomed(false);
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-2 text-xs font-medium text-[#D4D0C7] transition-colors hover:border-[#C8A04B]/60 hover:text-[#F5F2EB]"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Inspect Full Res</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* High-Resolution Lightbox Modal Zoom */}
      {modalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modalItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#040405]/92 p-4 backdrop-blur-md sm:p-6"
          onClick={() => {
            setModalItem(null);
            setIsZoomed(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0E0E10] shadow-2xl lg:grid lg:grid-cols-12"
          >
            <button
              type="button"
              onClick={() => {
                setModalItem(null);
                setIsZoomed(false);
              }}
              aria-label="Close modal"
              className="absolute top-3.5 right-3.5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-[#060607]/85 text-[#F5F2EB] transition-colors hover:border-[#C8A04B] hover:text-[#C8A04B]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex min-h-[300px] items-center justify-center overflow-auto bg-[#060607] lg:col-span-8 lg:min-h-[540px]">
              <button
                type="button"
                onClick={() => setIsZoomed((z) => !z)}
                aria-label={isZoomed ? 'Zoom out image' : 'Zoom in to inspect detail'}
                className={`relative flex h-full w-full items-center justify-center ${
                  isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              >
                <ResilientImage
                  src={modalItem.image}
                  alt={modalItem.title}
                  fallbackTitle={modalItem.title}
                  className={`max-h-[65vh] w-auto object-contain transition-transform duration-300 ease-out lg:max-h-[84vh] ${
                    isZoomed ? 'scale-150 sm:scale-[1.75]' : 'scale-100'
                  }`}
                />
              </button>

              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-between px-4">
                <div className="pointer-events-auto flex items-center gap-2">
                  {filteredItems.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const prevIdx =
                            (modalIndex - 1 + filteredItems.length) %
                            filteredItems.length;
                          setModalItem(filteredItems[prevIdx]);
                          setIsZoomed(false);
                        }}
                        aria-label="Previous piece"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-[#060607]/85 text-[#F5F2EB] backdrop-blur-sm transition-colors hover:border-[#C8A04B] hover:text-[#C8A04B]"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const nextIdx = (modalIndex + 1) % filteredItems.length;
                          setModalItem(filteredItems[nextIdx]);
                          setIsZoomed(false);
                        }}
                        aria-label="Next piece"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-[#060607]/85 text-[#F5F2EB] backdrop-blur-sm transition-colors hover:border-[#C8A04B] hover:text-[#C8A04B]"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsZoomed((z) => !z)}
                  className="pointer-events-auto inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-white/15 bg-[#060607]/85 px-3.5 py-1.5 text-xs font-medium text-[#F5F2EB] backdrop-blur-sm transition-colors hover:border-[#C8A04B] hover:text-[#C8A04B]"
                >
                  {isZoomed ? (
                    <>
                      <ZoomOut className="h-4 w-4" />
                      <span>Reset Zoom</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="h-4 w-4" />
                      <span>Zoom Detail</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between border-t border-white/10 p-6 sm:p-8 lg:col-span-4 lg:border-t-0 lg:border-l">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-[#C8A04B] uppercase">
                  {modalItem.category}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold leading-snug text-[#F5F2EB]">
                  {modalItem.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-[#C7C3B9]">
                  {modalItem.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {modalItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-[#08080A] px-2 py-0.5 text-xs text-[#D4D0C7]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <dl className="mt-6 divide-y divide-white/10 border-t border-b border-white/10 text-sm">
                  <div className="flex justify-between py-3">
                    <dt className="text-[#A19E95]">Artist</dt>
                    <dd className="font-medium text-[#F5F2EB]">{modalItem.artist}</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-[#A19E95]">Placement</dt>
                    <dd className="font-medium text-[#F5F2EB]">{modalItem.placement}</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-[#A19E95]">Session</dt>
                    <dd className="font-mono text-xs font-medium text-[#F5F2EB] tabular-nums">
                      {modalItem.duration}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleBookSimilar(modalItem)}
                  className="inline-flex min-h-[46px] w-full items-center justify-center rounded-lg bg-[#C8A04B] px-5 py-3 text-sm font-semibold text-[#060607] transition-colors hover:bg-[#D8B25D]"
                >
                  Book Similar Piece
                </button>
                <p className="text-center text-xs text-[#A19E95]">
                  Press ESC to close · Arrow keys to browse
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
