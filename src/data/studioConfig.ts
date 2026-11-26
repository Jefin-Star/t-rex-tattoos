export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  artist: string;
  placement: string;
  duration: string;
  inkPalette: string;
  description: string;
  tags: string[];
  image: string;
  isUserUploaded?: boolean;
  isAiAnalyzed?: boolean;
}

export interface StudioStandard {
  index: string;
  title: string;
  description: string;
}

export interface PricingTier {
  service: string;
  startingPrice: string;
  note: string;
  details: string[];
}

export const STUDIO_CONFIG = {
  brandName: 'T-REX TATTOOS & PIERCING',
  shortName: 'T-REX',
  tagline: 'Precision Ink. Permanent Craft.',
  heroSubtitle:
    'Custom tattoo artistry and surgical-grade body piercing crafted in a sterile, private studio environment—open 24/7 for scheduled sessions and late-night consultations.',
  logoUrl: '/assets/aistudio/b09d29d1-9205-4258-b503-af8955f63952_ba71bc7b.jpg',
  heroImage: '/src/assets/images/hero_tattoo_studio_1795346571479.jpg',
  aboutParagraph:
    'Experience top-tier artistry with Lead Artist Nithin Raj, bringing over five years of professional expertise. Our studio is open 24/7, Monday through Sunday, offering tattoos starting at ₹800 and piercings from ₹500.',
  leadArtist: {
    name: 'Nithin Raj',
    role: 'Master Tattoo Artist & Founder',
    experience: '5+ Years Experience',
    portraitUrl: '/assets/aistudio/aca1eb79-e05e-4acf-bfdb-5ef32875b5bd_a002dd5e.jpg',
    specialties: [
      'Black & Grey Realism',
      'Micro-Realism & 3D',
      'Custom Illustrative Sleeves',
      'Sterile Body Piercings',
    ],
    bio: 'Bringing over 5 years of professional tattooing expertise—blending razor-sharp anatomical flow, rich monochrome depth, and bespoke custom artistry from initial sketch to healed permanence.',
  },
  hours: {
    label: 'Open 24/7',
    days: 'Monday – Sunday',
    full: 'Open 24/7, Monday through Sunday',
  },
  pricing: {
    tattooStarting: '₹800',
    piercingStarting: '₹500',
    tiers: [
      {
        service: 'Custom Tattoos',
        startingPrice: '₹800',
        note: 'Starting price · Minimal & script pieces',
        details: [
          'Complimentary design consultation & stencil sizing',
          'Single-use sterile needle cartridges & vegan-friendly black/color inks',
          'Custom sleeves, portraits & large-scale pieces quoted per session',
        ],
      },
      {
        service: 'Body Piercings',
        startingPrice: '₹500',
        note: 'Starting price · Includes standard jewelry',
        details: [
          'Lobe, helix, nose, septum, eyebrow, navel & industrial placements',
          'Autoclave-sterilized tools & hypoallergenic surgical-grade jewelry',
          'Detailed aftercare guide & complimentary healing check-ins',
        ],
      },
    ] as PricingTier[],
  },
  contact: {
    whatsappDisplay: '96056 36575',
    whatsappLink: 'https://wa.me/919605636575',
    phoneHref: 'tel:+919605636575',
    email: 'trextattoosandpiercing@gmail.com',
    instagramHandle: '@t_rex_tattoo_and_piercing',
    instagramUrl:
      'https://www.instagram.com/t_rex_tattoo_and_piercing?lqvp=d2ZwMDN5bzV4dG04&utm_source=qr',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3923850430606!2d75.7521158!3d11.654725200000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba67fe41a99a5c3%3A0x74c90be47135e6f0!2sT-Rex%20Tattoos%20%26%20Piercing!5e1!3m2!1sen!2sin!4v1795344520410!5m2!1sen!2sin',
    mapDirectUrl:
      'https://www.google.com/maps/search/?api=1&query=T-Rex+Tattoos+%26+Piercing&query_place_id=ChIJw6WZGpR_pjsR8O41cbALyXQ',
    addressLabel: 'T-Rex Tattoos & Piercing Studio · View Pin on Google Maps',
  },
  standards: [
    {
      index: '01.',
      title: 'Hospital-Grade Sterilization',
      description:
        'Every reusable instrument undergoes medical autoclave sterilization cycles with sealed indicator pouches opened right in front of you.',
    },
    {
      index: '02.',
      title: 'Single-Use Needles & Premium Inks',
      description:
        '100% disposable needle cartridges, barrier-wrapped workstations, and high-retention, skin-safe pigments for crisp healed tones.',
    },
    {
      index: '03.',
      title: 'Bespoke Anatomical Design',
      description:
        'No rushed flash templates—every custom piece is proportioned to follow natural muscle contour, skin tone, and long-term aging.',
    },
    {
      index: '04.',
      title: 'Open 24/7 Around Your Schedule',
      description:
        'Whether you prefer a calm afternoon session or a private late-night appointment, our studio doors are open Monday through Sunday.',
    },
  ] as StudioStandard[],
  artistsList: [
    'Nithin Raj (Lead Artist)',
    'Studio Piercing Specialist',
    'Any Available Artist',
  ],
  placementsList: [
    'Forearm / Inner Arm',
    'Inner Wrist',
    'Upper Arm / Shoulder',
    'Full / Half Sleeve',
    'Chest / Collarbone',
    'Upper Back / Spine',
    'Wrist / Ankle',
    'Ribcage / Side',
    'Ear / Nose / Body Piercing',
    'Other / Custom Placement',
  ],
};

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'theyyam-crown-stone-portrait',
    title: 'Theyyam Crown & Stone-Weathered Gaze',
    category: 'Black & Grey',
    artist: 'Nithin Raj',
    placement: 'Forearm',
    duration: '6.5 Hours · Single Session',
    inkPalette: 'Triple-Black Pigment, Grey Wash & Crisp White Highlights',
    description:
      'Monumental black-and-grey realism portrait of a traditional Kerala ritual performer crowned in a multi-tiered metallic headdress and beaded collar. Subtle stone-crack facial textures and deep obsidian shading bring sculptural depth across the forearm.',
    tags: ['Theyyam Portrait', 'Black & Grey Realism', 'Ornate Crown', 'Forearm Piece', 'High Contrast'],
    image: '/assets/aistudio/90f196d4-3afe-4822-9c99-74c969facc04_351ebdc2.jpg',
    isAiAnalyzed: true,
  },
  {
    id: 'gilded-helix-ear-constellation',
    title: 'Gilded Helix & Cascade Ear Constellation',
    category: 'Body Piercing',
    artist: 'Studio Piercing Team',
    placement: 'Vertical Helix, Outer Rim & Lobe',
    duration: '35 Mins · Sterile Procedure',
    inkPalette: 'Gold-Tone Implant Jewelry & Faceted Crystal Clusters',
    description:
      'Meticulously mapped multi-point ear curation uniting a vertical helix floral barbell with graduated crystal cartilage studs along the outer rim and gold jhumka lobe drops. Balanced for crisp anatomical spacing and low-trauma healing.',
    tags: ['Vertical Helix', 'Curated Ear', 'Gold & Crystal', 'Cartilage Stack', 'Lobe Styling'],
    image: '/assets/aistudio/01a75bb8-02c7-472f-bc9a-72af56462ec5_8e0495a0.jpg',
    isAiAnalyzed: true,
  },
  {
    id: 'black-widow-3d-wrist',
    title: '3D Black Widow & Cast Web',
    category: 'Micro-Realism',
    artist: 'Nithin Raj',
    placement: 'Inner Wrist',
    duration: '2 Hours · Single Session',
    inkPalette: 'Triple-Black Pigment & Soft Drop-Shadow Wash',
    description:
      'Lifelike arachnid rendered with crisp white-ink specular highlights and radial cast-shadow webbing that creates an illusion of depth hovering over the wrist.',
    tags: ['3D Illusion', 'Micro-Realism', 'Spider & Web', 'Inner Wrist', 'High Contrast'],
    image: '/assets/aistudio/75fc77eb-5214-4df3-ab31-9a26798cb806_8b70c261.jpg',
  },
  {
    id: 'wolf-headdress-warrior',
    title: 'Wolf-Crowned Warrior Portrait',
    category: 'Black & Grey',
    artist: 'Nithin Raj',
    placement: 'Outer Forearm',
    duration: '5.5 Hours · Single Session',
    inkPalette: 'Black & Grey Wash with Cyan-Blue Eye Accents',
    description:
      'Intricate illustrative portrait uniting a feathered war bonnet, carved wolf-skull helm, geometric facial markings, and piercing electric-blue irises.',
    tags: ['Illustrative Portrait', 'Wolf Skull', 'Feathered Headdress', 'Color Accent', 'Forearm'],
  image: '/assets/aistudio/046f30d1-5d28-490e-8a4c-1047ebcd5aaf_ff46b5dd.jpg',
  },
  {
    id: 'surreal-dark-mario',
    title: 'Dark Surrealist Mario Study',
    category: 'Black & Grey',
    artist: 'Nithin Raj',
    placement: 'Inner Forearm',
    duration: '4.5 Hours · Single Session',
    inkPalette: 'Opaque Grey Wash & Fine Skin Texture Shading',
    description:
      'A twisted pop-culture reinterpretation rendered with hyper-detailed facial creases, stippled stubble, and a clawed hand reaching outward from the forearm.',
    tags: ['Surreal Horror', 'Pop-Culture Twist', 'Black & Grey', 'Forearm Piece', 'Character Art'],
    image: '/assets/aistudio/86cdec21-79c2-4148-8a4d-057860c53558_4195744e.jpg',
  },
  {
    id: 'eagle-compass-upper-back',
    title: 'Soaring Eagle & Cardinal Compass',
    category: 'Blackwork',
    artist: 'Nithin Raj',
    placement: 'Upper Back',
    duration: '3.5 Hours · Single Session',
    inkPalette: 'Precision Liner & Smooth Whip-Shading',
    description:
      'Symmetrical bird of prey spreading layered flight feathers directly above a crisp geometric compass dial marking West, South, and East.',
    tags: ['Eagle Wings', 'Compass Rose', 'Symmetrical', 'Upper Back', 'Whip Shading'],
    image: '/assets/aistudio/0ad5bbc5-c53a-405e-a7bc-18e0f521aafd_5c8ce151.jpg',
  },
  {
    id: 'helix-triple-lobe-stack',
    title: 'Crystal Fan Helix & Triple Lobe Stack',
    category: 'Body Piercing',
    artist: 'Studio Piercing Team',
    placement: 'Ear Cartilage & Lobe',
    duration: '25 Mins · Sterile Procedure',
    inkPalette: 'Surgical Titanium & Faceted Gem Studs',
    description:
      'Precision-aligned vertical helix featuring a multi-stone fan top balanced by graduated solitaire lobe studs and a sparkling floral cluster at the base.',
    tags: ['Helix Piercing', 'Triple Lobe', 'Crystal Studs', 'Curated Ear', 'Sterile Setup'],
    image: '/assets/aistudio/aabba487-2a45-424c-bd3f-74cbbe93f293_ef81a451.jpg',
  },
  {
    id: 'splash-ink-eagle-forearm',
    title: 'Abstract Ink-Splash Eagle Portrait',
    category: 'Black & Grey',
    artist: 'Nithin Raj',
    placement: 'Inner Forearm',
    duration: '3 Hours · Single Session',
    inkPalette: 'Black & Grey Sketch Realism with Wash Splatters',
    description:
      'Focused raptor profile emerging from expressive ink drips and fine stippled feather transitions for a dynamic painterly silhouette.',
    tags: ['Eagle Portrait', 'Ink Splash', 'Sketch Realism', 'Forearm', 'Monochrome'],
    image: '/assets/aistudio/b86880c7-4a30-432c-9310-8ea4188491f5_d9c755d7.jpg',
  },
];
