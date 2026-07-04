import { ServiceItem, PortfolioItem, PricingTier, TestimonialItem, GalleryItem, UpcomingEvent, BlogPost, FAQItem } from './types';

export const servicesData: ServiceItem[] = [
  {
    id: 'corporate-events',
    title: 'Corporate Events',
    description: 'Bespoke corporate dinners, annual galas, and immersive brand experiences tailored to your business objectives.',
    longDescription: 'From high-profile board meetings to grand annual galas, we deliver seamless logistics, immersive brand storytelling, and sophisticated atmospheres that represent your corporate prestige on a global scale.',
    iconName: 'Building2',
    category: 'Corporate',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'weddings',
    title: 'Luxury Weddings',
    description: 'Enchanting bespoke weddings in historic UK castles, luxury estates, and breathtaking global destinations.',
    longDescription: 'We specialize in ultra-luxury wedding planning, offering complete design direction, vendor curation, and flawless day-of choreography to make your absolute dream wedding a stress-free, breathtaking reality.',
    iconName: 'Heart',
    category: 'Private',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'product-launches',
    title: 'Product Launches',
    description: 'High-impact press and consumer launch events designed to capture global media attention and drive engagement.',
    longDescription: 'We combine state-of-the-art visual production, custom spatial architecture, and flawless stage management to ensure your product makes an unforgettable global entrance.',
    iconName: 'Sparkles',
    category: 'Corporate',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'conferences',
    title: 'Conferences & Exhibitions',
    description: 'Large-scale international symposiums and state-of-the-art trade shows with integrated hybrid virtual solutions.',
    longDescription: 'End-to-end technical production, venue sourcing, registration architecture, and custom exhibition stand design. We keep thousands of global delegates connected and engaged.',
    iconName: 'Presentation',
    category: 'Corporate',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'award-ceremonies',
    title: 'Award Ceremonies',
    description: 'Prestigious red-carpet ceremonies honoring industry pioneers with top-tier AV production.',
    longDescription: 'From custom stage design and red-carpet guest arrival protocols to broadcast-quality audio-visual orchestration, we design award shows that radiate prestige and celebrate success.',
    iconName: 'Trophy',
    category: 'Corporate',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'private-events',
    title: 'Private Celebrations',
    description: 'Discreet and exclusive high-society gatherings, elite milestones, and private estate parties.',
    longDescription: 'Strictly confidential, meticulously curated private soirées for discerning hosts. We handle gourmet catering selection, world-class entertainment, and bespoke scenery creation.',
    iconName: 'Crown',
    category: 'Private',
    imageUrl: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'birthday-parties',
    title: 'Milestone Birthdays',
    description: 'Immersive themed birthday extravaganzas featuring world-class live entertainment and decor.',
    longDescription: 'Whether it is an intimate 50th birthday in a French villa or a theatrical 30th bash in London, we create custom concepts, curate elite performers, and deliver pure magic.',
    iconName: 'Gift',
    category: 'Private',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'charity-events',
    title: 'Charity & Gala Fundraisers',
    description: 'Distinguished fundraising galas that maximize patronage engagement and auction success.',
    longDescription: 'We merge impactful storytelling with elegant entertainment to cultivate an atmosphere of generosity. Flawless live auctions, major donor hospitality, and visual impact are guaranteed.',
    iconName: 'Coins',
    category: 'Corporate',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'festivals',
    title: 'Bespoke Festivals',
    description: 'Sleek cultural, food, and music boutique festivals with complex multi-stage site management.',
    longDescription: 'Licensing, vendor management, health and safety compliance, site logistics, and main stage production. We create beautifully designed, highly secured outdoor brand festivals.',
    iconName: 'Music',
    category: 'Luxury Events',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'event-decoration',
    title: 'Luxury Event Decoration',
    description: 'Masterful floral designs, tailored lighting layouts, and custom spatial styling.',
    longDescription: 'Our in-house design studio crafts complete artistic environments. We coordinate premium table linens, bespoke floral architecture, custom-built backdrops, and sensory mood lighting.',
    iconName: 'Palette',
    category: 'Private',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop'
  }
];

export const portfolioData: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'The Lumina Tech Summit',
    client: 'Lumina Global Holdings',
    location: 'The Shard, London',
    category: 'Corporate',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
    year: '2025',
    guestCount: '450 Delegates',
    highlights: ['360-degree interactive projections', 'Keynotes by world tech leaders', 'Exclusive high-tea networking lounge']
  },
  {
    id: 'p2',
    title: 'A Midsummer Castle Romance',
    client: 'Lady Beatrice & Lord Charles',
    location: 'Highclere Castle, Hampshire',
    category: 'Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
    year: '2025',
    guestCount: '180 VIPs',
    highlights: ['Bespoke glass marquee over rose garden', 'Michelin-starred 5-course banquet', '60-piece philharmonic orchestra']
  },
  {
    id: 'p3',
    title: 'Aero-V Velocity Launch',
    client: 'Aero-V Automotive Group',
    location: 'Royal Albert Hall, London',
    category: 'Luxury Events',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000&auto=format&fit=crop',
    year: '2026',
    guestCount: '600 Guests',
    highlights: ['Kinetic laser reveal show', 'International press core coverage', 'VIP afterparty inside custom hangar']
  },
  {
    id: 'p4',
    title: 'The Riviera Soirée',
    client: 'Private Client',
    location: 'Cap d\'Antibes, French Riviera',
    category: 'Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000&auto=format&fit=crop',
    year: '2025',
    guestCount: '90 Guests',
    highlights: ['Private beach custom installation', 'Symphonic drone light show over Mediterranean', 'Performance by Grammy-nominated pop artist']
  },
  {
    id: 'p5',
    title: 'International Fintech Gala',
    client: 'Alliance Finance UK',
    location: 'The Savoy, London',
    category: 'Conference',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop',
    year: '2026',
    guestCount: '350 Executive Partners',
    highlights: ['Custom modular stage architecture', 'Live broadcast feed to 15 global hubs', 'Charity champagne auction raising £2.1M']
  },
  {
    id: 'p6',
    title: 'Aura Soundscapes Festival',
    client: 'Lighthouse Arts Council',
    location: 'Cotswolds Downs, UK',
    category: 'Festival',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop',
    year: '2025',
    guestCount: '1,500 Patron Passes',
    highlights: ['Three architect-designed wooden acoustic pavilions', 'Curated artisanal British culinary marketplace', 'Glamping luxury geodesic domes']
  }
];

export const pricingData: PricingTier[] = [
  {
    name: 'Starter',
    price: '£4,500',
    description: 'Expert planning supervision and design orchestration for intimate boutique gatherings or custom private parties.',
    features: [
      'Dedicated lead planner & coordinator',
      'Initial concept mood boards & spatial layout design',
      'Sourcing of premium localized vendors',
      'Detailed event day timeline and schedule flow',
      '6 hours of on-site coordinator presence',
      'Post-event wraps and feedback log'
    ],
    isPopular: false,
    ctaText: 'Select Starter Suite'
  },
  {
    name: 'Professional',
    price: '£9,500',
    description: 'Our award-winning comprehensive end-to-end planning service for high-tier corporate conferences and grand weddings.',
    features: [
      'Complete end-to-end event management suite',
      '3D spatial rendering & architectural mockups',
      'Exclusive access to our elite global vendor network',
      'Budget management & contract negotiation guidance',
      'Full audio-visual production supervision',
      '12 hours of on-site execution team (up to 4 members)',
      'VIP guest hospitality protocols & travel coordination'
    ],
    isPopular: true,
    ctaText: 'Enquire Professional Plan'
  },
  {
    name: 'Luxury Custom',
    price: 'Bespoke',
    description: 'Immersive architectural transformations, destination event planning, and complete elite security protocol for high-society milestones.',
    features: [
      'Global destination planning with complete travel logistics',
      'Unlimited bespoke custom design fabrications',
      'Discreet celebrity guest & high-profile talent curation',
      'Dedicated 24/7 concierge & communications lead',
      'Full NDA compliance & strictly private media embargoes',
      'Multi-day event orchestration & site construction',
      'Elite security protocols & perimeter coordination'
    ],
    isPopular: false,
    ctaText: 'Book VIP Consultation'
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Victoria Stirling',
    role: 'Vice President of Global Events',
    company: 'Fintech Alliance London',
    content: 'AURA events did what three other digital agencies deemed impossible. They planned, designed, and executed our 500-delegate global summit in under six weeks. The precision, the visual layout of the presentation stages, and the flawless protocol made it a major success.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 't2',
    name: 'The Hon. Edward Spencer',
    role: 'Host',
    company: 'Spencer Private Estate',
    content: 'We contracted AURA for my daughter\'s estate wedding at Mayfair. Their creative vision is simply unmatched. They transformed our estate grounds into a magical, gold-accented cathedral of flowers. Spacing, decor, and micro-interactions with guests were perfect.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 't3',
    name: 'Amélie Laurent',
    role: 'Chief Brand Officer',
    company: 'Aero-V Motors',
    content: 'The automotive launch in London was a masterpiece of luxury branding. AURA combined high-end architecture with modern kinetic light choreography. Our global partners are still praising the execution. Highly recommended for any luxury product reveal.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop'
  }
];

export const galleryData: GalleryItem[] = [
  {
    id: 'g1',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
    caption: 'Global Leaders Conference Stage',
    category: 'Corporate'
  },
  {
    id: 'g2',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
    caption: 'Bespoke Floral Wedding Walkway',
    category: 'Wedding'
  },
  {
    id: 'g3',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop',
    caption: 'Cap d\'Antibes Birthday Gala Lighting',
    category: 'Birthday'
  },
  {
    id: 'g4',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
    caption: 'Kinetic Hologram Presentation Lounge',
    category: 'Corporate'
  },
  {
    id: 'g5',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop',
    caption: 'Artisanal Festival Pavilion Structures',
    category: 'Festival'
  },
  {
    id: 'g6',
    imageUrl: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=600&auto=format&fit=crop',
    caption: 'Imperial Gold Tableware Setup',
    category: 'Luxury Events'
  }
];

export const upcomingEventsData: UpcomingEvent[] = [
  {
    id: 'ue1',
    title: 'The London Luxury Brand Summit',
    date: 'Sep 18, 2026',
    location: 'Savoy Hall, London, UK',
    time: '09:00 - 18:00 BST',
    category: 'Corporate',
    description: 'An elite convening of creative directors, market analysts, and high-fashion founders discussing the next decade of prestige branding.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
    availableSeats: 45
  },
  {
    id: 'ue2',
    title: 'AURA Bridal Masterclass & Showcase',
    date: 'Oct 05, 2026',
    location: 'The Ritz, Piccadilly, London',
    time: '13:00 - 17:30 BST',
    category: 'Wedding',
    description: 'An exclusive viewing of award-winning tablescapes, bespoke wedding gowns, and sensory floral sculptures curated by international designers.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
    availableSeats: 20
  },
  {
    id: 'ue3',
    title: 'Vanguard Automotive Launch Gala',
    date: 'Nov 12, 2026',
    location: 'Royal Exhibition Centre, London',
    time: '19:30 - 23:30 GMT',
    category: 'Luxury Events',
    description: 'The exclusive public unveil of the custom hydrogen super-saloon with private orchestral accompaniment, champagne lounge, and light shows.',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop',
    availableSeats: 15
  }
];

export const blogPostsData: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Art of Immersive Spatial Design',
    excerpt: 'How modern architects and visual producers collaborate to design multi-sensory high-end experiences that elevate corporate storytelling.',
    category: 'Creative Design',
    date: 'Jun 28, 2026',
    readTime: '6 min read',
    author: 'Alistair Sterling',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'b2',
    title: 'Top 5 Historical UK Wedding Castles',
    excerpt: 'Our handpicked selection of highly historical castles and estates across Hampshire, Yorkshire, and Scotland that host breathtaking weddings.',
    category: 'Weddings',
    date: 'May 14, 2026',
    readTime: '9 min read',
    author: 'Beatrice Vance',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'b3',
    title: 'Planning Low-Carbon Luxury Gatherings',
    excerpt: 'How AURA is spearheading luxury carbon-neutral logistics, localized dining menus, and recyclable architectural staging setups.',
    category: 'Sustainability',
    date: 'Apr 22, 2026',
    readTime: '5 min read',
    author: 'Gavin Henderson',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?q=80&w=600&auto=format&fit=crop'
  }
];

export const faqData: FAQItem[] = [
  {
    id: 'f1',
    question: 'How far in advance should we book AURA for our global event?',
    answer: 'For premium corporate events, conferences, and high-end weddings, we strongly recommend booking 6 to 12 months in advance. This ensures absolute priority venue sourcing and locks in key artisan vendors and custom fabrication structures. However, for express turnarounds, our agile global team can execute major events on shorter timelines.'
  },
  {
    id: 'f2',
    question: 'Do you manage destination events outside of the United Kingdom?',
    answer: 'Yes, absolutely. While AURA is proudly based in Mayfair, London, over 40% of our luxury events are executed globally. We have active logistics networks and local production support across the French Riviera, Amalfi Coast, Monaco, Paris, Dubai, New York, and select Caribbean private islands.'
  },
  {
    id: 'f3',
    question: 'How do you handle client privacy, confidentiality, and media exposure?',
    answer: 'Confidentiality is a cornerstone of our agency service. We regularly execute high-society milestones and corporate launches under strict NDA guidelines. Our security liaisons coordinate with private protection forces, verify all on-site personnel, and can impose absolute media/social bans to guarantee complete privacy.'
  },
  {
    id: 'f4',
    question: 'What is included in your "end-to-end" event management service?',
    answer: 'Our professional plan covers complete venue styling, 3D architectural mockups, budget spreadsheets, vendor negotiations, health and safety licensing, technical AV support, luxury catering curation, attendee guest registrations, and comprehensive on-site directors coordinating every minute of the day.'
  },
  {
    id: 'f5',
    question: 'Can you curate and negotiate with celebrity performers or guest keynotes?',
    answer: 'Yes, we have established direct relationships with global entertainment booking agencies, artist managements, and high-profile keynote bureaus. We negotiate contract riders, handle technical riders, and manage luxury hospitality suites for top-tier musical guests and global leaders.'
  }
];

export const clientLogos = [
  { name: 'Aero Automotive', logo: 'AERO' },
  { name: 'Vanguard Invest', logo: 'VANGUARD' },
  { name: 'Stirling & Co', logo: 'STIRLING' },
  { name: 'Lumina Tech', logo: 'LUMINA' },
  { name: 'Imperial Hospitality', logo: 'IMPERIAL' },
  { name: 'Geneva Pharma', logo: 'GENEVA' },
  { name: 'Oracle Capital', logo: 'ORACLE' }
];

export const processSteps = [
  {
    step: '01',
    title: 'Consultation',
    description: 'We meet over champagne or virtual suite to capture your vision, core aesthetic priorities, guest demographics, and target deliverables.'
  },
  {
    step: '02',
    title: 'Planning',
    description: 'Our lead planners map out comprehensive budget structures, negotiate exclusive venue dates, and layout global supply itineraries.'
  },
  {
    step: '03',
    title: 'Design',
    description: 'We craft bespoke 3D spatial renders, select exquisite textiles, and draft tailor-made floral blueprints with specialized lighting.'
  },
  {
    step: '04',
    title: 'Execution',
    description: 'Our elite technical team installs state-of-the-art AV, coordinates guest paths, and orchestrates day-of operations micro-by-micro.'
  },
  {
    step: '05',
    title: 'Successful Event',
    description: 'Watch your luxury milestone manifest beautifully as you celebrate stress-free, leaving guests with a profound, lasting memory.'
  }
];
