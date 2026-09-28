export type PortfolioCategory =
  | 'all'
  | 'before-after'
  | 'video-editing'
  | 'motion-graphics'
  | 'sound-design'
  | 'graphic-design';

export interface Project {
  id: string;
  title: string;
  category: string;
  categorySlug: 'commercial' | 'social' | 'brand' | 'event' | 'shortform' | 'post' | string;
  filterCategories?: PortfolioCategory[];
  description: string;
  image: string;
  videoUrl?: string;
  stats: string;
  aspect: 'wide' | 'tall' | 'standard';
  deliverables: string[];
  client: string;
  year: string;
  duration: string;
  role: string;
  challenge: string;
  solution: string;
  tagline?: string;
  service?: string;
  agencyCredit?: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  price: string;
  startingPrice: string;
  description: string;
  deliverables: string[];
  idealFor: string;
  image?: string;
  tagline?: string;
  recommendedTimeline?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatarText: string;
  rating: number;
  text: string;
  projectType: string;
  timeAgo: string;
}

export interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  avatar?: string;
  isFounder?: boolean;
  services?: string[];
  agency?: string;
  certificate?: {
    title: string;
    recipient: string;
    role: string;
    organization: string;
    hospital: string;
    event: string;
    dates: string;
    signatory: string;
    motto: string;
    image: string;
  };
}

export const AGENCY_CONTACT = {
  email: 'waleedghangla@gmail.com',
  phone: '03327865342',
  phoneFormatted: '0332 7865342',
  tel: 'tel:03327865342',
  mailto: 'mailto:waleedghangla@gmail.com',
  whatsappUrl: 'https://wa.me/923327865342',
};

export const PROJECTS: Project[] = [
  {
    id: 'raw-vs-edit-reel',
    title: 'Raw vs Agency Edit — High-Retention Reel',
    category: 'Short-Form & Video Editing',
    categorySlug: 'shortform',
    filterCategories: ['before-after', 'video-editing', 'motion-graphics', 'sound-design', 'graphic-design'],
    description: 'Dynamic split-screen editing breakdown demonstrating how pacing, motion graphics, sound design, and color grading transform raw footage into viral engagement.',
    image: '/assets/videos/raw-vs-edit-poster.jpg',
    videoUrl: '/assets/videos/AQNynW791wX9tJb7b-hHUNRno7DkLYo5ZeCEHB6HeWwSvkkVP2FhFRv9_ktgOmO_M_YxxryzZsK4nEPaJ1oPQiHwLT3rZ069L40 (1).mp4',
    stats: '2.4M Views · 94% Retention',
    aspect: 'wide',
    deliverables: ['Vertical 9:16 Master', 'Custom Sound Design', 'Kinetic Typography', 'ACES Color Grade'],
    client: 'Creator & Brand Collective',
    year: '2026',
    duration: '01:07',
    role: 'Pacing, Motion Graphics, Sound Design & Color',
    challenge: 'Eliminate drop-off in the first 3 seconds of talking-head video and maintain viewers through the 60-second mark.',
    solution: 'Designed synchronized B-roll cutaways, punchy kinetic captions, visual anchors, and audio cues to maximize watch time.'
  },
  {
    id: 'aura-atelier',
    title: 'This Is What Our Editing Looks Like.',
    tagline: 'From raw footage to a finished visual experience.',
    category: 'Agency Work',
    categorySlug: 'shortform',
    filterCategories: ['before-after', 'video-editing'],
    service: 'Video Editing',
    agencyCredit: 'Edited by WG MEDIA PRODUCTION',
    description: "This project showcases the editing work of WG MEDIA PRODUCTION. We took the client's original footage and crafted it into a polished, engaging final edit using professional pacing, transitions, sound design, color treatment, and motion graphics.",
    image: '/assets/videos/poster-phwye.jpg',
    videoUrl: '/assets/videos/AQPHwyEcn_Q9Bjmqn2nPWRNJbYKsmXfinrvQkDrtVuwgnyUNlI-5cirz56v_NGjEHtflET3pYl7XdXzEqRTIQp0M1DU6pazem5dIbnndLg (1).mp4',
    stats: 'Raw Footage → Final Edit',
    aspect: 'tall',
    deliverables: ['Edited by WG MEDIA PRODUCTION', 'Video Editing', 'Sound Design & Pacing', 'Color Treatment & Motion Graphics'],
    client: "Client's Original Footage",
    year: '2026',
    duration: '01:36',
    role: 'Edited by WG MEDIA PRODUCTION',
    challenge: "The client provided raw unedited footage. The objective was demonstrating how high-caliber agency editing elevates raw camera files into high-retention visual content without requiring expensive re-shoots.",
    solution: "WG MEDIA PRODUCTION crafted an engaging, high-retention edit with snappy pacing, dynamic transitions, multi-layered sound design, clean color treatment, and kinetic motion graphics."
  },
  {
    id: 'pulse-origins',
    title: 'Hear What Our Sound Design Adds.',
    tagline: 'From raw audio to a richer experience.',
    category: 'Sound Design',
    categorySlug: 'post',
    filterCategories: ['before-after', 'sound-design'],
    service: 'Sound Designing',
    agencyCredit: 'Sound Designed by WG MEDIA PRODUCTION',
    description: 'This project showcases the sound designing work of WG MEDIA PRODUCTION. We enhanced the original footage with carefully selected sound effects, audio layering, transitions, ambience, and detailed sound balancing to give the final edit more depth, energy, and impact.',
    image: '/assets/videos/poster-sfx-breakdown.jpg',
    videoUrl: '/assets/videos/sfx-breakdown-recent-video.mp4',
    stats: 'Raw Audio → Immersive Sound',
    aspect: 'tall',
    deliverables: ['Sound Designed by WG MEDIA PRODUCTION', 'Sound Designing', 'Multi-Track Foley & Risers', 'Impact Cues & Stem Balancing'],
    client: "Client's Original Footage & Audio",
    year: '2026',
    duration: '00:13',
    role: 'Sound Designed by WG MEDIA PRODUCTION',
    challenge: 'Original footage and audio lacked dynamic presence and tactile weight, causing key visual movements and transitions to feel flat.',
    solution: 'WG MEDIA PRODUCTION crafted an immersive soundscape with layered sound effects, tactile Foley, rhythmic transitions, spatial ambience, and balanced audio mix.'
  },
  {
    id: 'electric-sky',
    title: 'Motion Graphics Reels — Before & After',
    tagline: 'Raw visual assets transformed into animated storytelling.',
    category: 'Motion Graphics',
    categorySlug: 'post',
    filterCategories: ['before-after', 'motion-graphics', 'graphic-design'],
    service: 'Motion Graphics & Animation',
    agencyCredit: 'Animated by WG MEDIA PRODUCTION',
    description: 'A before-and-after breakdown demonstrating how custom 2D/3D motion graphics, kinetic typography, callouts, and animated overlays elevate raw footage into high-impact visual content.',
    image: '/assets/videos/poster-motion-graphics.jpg',
    videoUrl: '/assets/videos/motion-graphics-before-after.mp4',
    stats: 'Raw Assets → Motion Graphics Edit',
    aspect: 'tall',
    deliverables: ['Animated by WG MEDIA PRODUCTION', 'Kinetic Typography', 'Motion Overlays', 'Visual Callouts'],
    client: "Client's Original Assets",
    year: '2026',
    duration: '00:20',
    role: 'Animated & Produced by WG MEDIA PRODUCTION',
    challenge: 'Transforming static assets and plain video into dynamic, retention-focused reels with animated graphics.',
    solution: 'WG MEDIA PRODUCTION integrated custom 2D motion design, smooth easing animations, kinetic titles, and beat-synced visual elements.'
  },
  {
    id: 'hyper-gravity',
    title: 'We Turn Raw Footage Into Something Better.',
    tagline: 'Your footage. Our creative touch.',
    category: 'Agency Work',
    categorySlug: 'shortform',
    filterCategories: ['before-after', 'video-editing'],
    service: 'Video Editing',
    agencyCredit: 'Edited by WG MEDIA PRODUCTION',
    description: "This project demonstrates the video editing work of WG MEDIA PRODUCTION. Starting with the client's original footage, we built a refined final video through intentional cuts, storytelling, pacing, transitions, color grading, sound enhancement, and motion graphics. The result is a cleaner, more engaging, and professionally finished visual.",
    image: '/assets/videos/poster-phwye.jpg',
    videoUrl: '/assets/videos/AQPHwyEcn_Q9Bjmqn2nPWRNJbYKsmXfinrvQkDrtVuwgnyUNlI-5cirz56v_NGjEHtflET3pYl7XdXzEqRTIQp0M1DU6pazem5dIbnndLg (1).mp4',
    stats: 'Raw Footage → Final Edit',
    aspect: 'tall',
    deliverables: ['Edited by WG MEDIA PRODUCTION', 'Video Editing', 'Pacing & Storytelling', 'Color Grading & Motion Graphics'],
    client: "Client's Original Footage",
    year: '2026',
    duration: '01:36',
    role: 'Edited by WG MEDIA PRODUCTION',
    challenge: "Transforming raw client camera footage into a high-engagement, professionally finished visual without requiring reshoots.",
    solution: "WG MEDIA PRODUCTION applied intentional cuts, storytelling rhythm, pacing, seamless transitions, sound enhancement, and color grading."
  },
  {
    id: 'apex-workflow',
    title: 'From Raw Clips to a Powerful Final Cut.',
    tagline: "We don't just edit footage. We shape the story.",
    category: 'Agency Work',
    categorySlug: 'shortform',
    filterCategories: ['before-after', 'video-editing'],
    service: 'Video Editing',
    agencyCredit: 'Edited by WG MEDIA PRODUCTION',
    description: "This project showcases the professional video editing work of WG MEDIA PRODUCTION. We transformed the client's original footage into a polished final piece through thoughtful cuts, engaging pacing, seamless transitions, color grading, sound enhancement, and carefully placed motion graphics. Every element was refined to make the final video more engaging and professional.",
    image: '/assets/videos/poster-project-olwzc.jpg',
    videoUrl: '/assets/videos/AQOLwZcymxLdPnwtGYzQ2m-8CP6uJ1EUH3Gz6q5ZPq1lIf8VvLrlYmfdP7CJH-calYofucPZvn3X62mfHbqOdTubVFcWu9EpP3abppQ5Aw (1).mp4',
    stats: 'Raw Clips → Final Cut',
    aspect: 'tall',
    deliverables: ['Edited by WG MEDIA PRODUCTION', 'Video Editing', 'Thoughtful Cuts & Pacing', 'Color Grading & Motion Graphics'],
    client: "Client's Original Footage",
    year: '2026',
    duration: '00:34',
    role: 'Edited by WG MEDIA PRODUCTION',
    challenge: "Transforming the client's raw camera clips into a cohesive, high-retention video piece with dynamic storytelling.",
    solution: 'WG MEDIA PRODUCTION crafted an engaging narrative through intentional cuts, seamless transitions, tailored color grading, sound enhancement, and custom motion graphics.'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'video-editing',
    number: '01',
    title: 'Video Editing',
    price: 'Rs. 1,500',
    startingPrice: 'Rs. 1,500',
    description: 'Shorts, Reels, YouTube & Narrative',
    deliverables: ['Viral Retention Pacing', 'Reels & Shorts', 'Long-form YouTube'],
    image: '/src/assets/images/service_video_editing_1790156513478.jpg',
    tagline: 'High-Retention Editorial & Narrative Assembly',
    recommendedTimeline: '2–5 Days',
    idealFor: 'Creators, agencies, and businesses looking for regular, high-retention video output.'
  },
  {
    id: 'sound-designing',
    number: '02',
    title: 'Sound Designing',
    price: 'Rs. 2,000',
    startingPrice: 'Rs. 2,000',
    description: 'Custom Foley, SFX, Audio Balancing',
    deliverables: ['Custom Foley & SFX', 'Dolby Audio Balancing', 'Stem Mix & Master'],
    image: '/src/assets/images/service_color_sound_1790156864916.jpg',
    tagline: 'Multi-Track Foley, Spatial Ambiance & Impact SFX',
    recommendedTimeline: '1–3 Days',
    idealFor: 'Videos needing cinematic atmosphere, punchy impact, and crystal-clear clarity.'
  },
  {
    id: 'motion-graphics',
    number: '03',
    title: 'Motion Graphics',
    price: 'Rs. 2,500',
    startingPrice: 'Rs. 2,500',
    description: 'Logos, Animations, Visuals & Titles',
    deliverables: ['3D Kinetic Typography', 'Logo Stings', 'Visual FX Overlays'],
    image: '/src/assets/images/service_motion_graphics_1790156531407.jpg',
    tagline: '3D Kinetic Titles, CGI & Visual Systems',
    recommendedTimeline: '1–2 Weeks',
    idealFor: 'Tech companies, modern brands, and commercials needing sophisticated graphic layers.'
  },
  {
    id: 'photography',
    number: '04',
    title: 'Photography',
    price: 'Rs. 1,800',
    startingPrice: 'Rs. 1,800',
    description: 'Events, Products, Lifestyle & Portraits',
    deliverables: ['Commercial Editorial', 'Product Stills', 'High-Res Lookbooks'],
    image: '/src/assets/images/service_photography_1790156567137.jpg',
    tagline: 'High-End Editorial, Campaign & Studio Stills',
    recommendedTimeline: '3–7 Days',
    idealFor: 'E-commerce lookbooks, press kits, digital campaigns, and website imagery.'
  },
  {
    id: 'drone-shots',
    number: '05',
    title: 'Drone Shots',
    price: 'Rs. 3,000',
    startingPrice: 'Rs. 3,000',
    description: 'Aerial, Cinematic, Unique Perspectives',
    deliverables: ['FPV Cinematic Chase', 'Top-Down Landforms', '4K HDR Twilight'],
    image: '/src/assets/images/service_drone_shots_1790156549866.jpg',
    tagline: 'Cinematic FPV & Aerial Drone Perspectives',
    recommendedTimeline: '2–4 Days',
    idealFor: 'Brands, real estate, commercials, and events requiring dramatic aerial scale.'
  },
  {
    id: 'video-production',
    number: '06',
    title: 'Video Production',
    price: 'Rs. 3,500',
    startingPrice: 'Rs. 3,500',
    description: 'Cinematic Visuals, Ads, Brand Films',
    deliverables: ['Commercial Ads', 'Brand Films', 'Cinema 4K/8K'],
    image: '/src/assets/images/service_video_production_1790156487930.jpg',
    tagline: 'Full-Scale Cinema & Brand Storytelling',
    recommendedTimeline: '2–4 Weeks',
    idealFor: 'Brands launching flagship campaigns, new products, or narrative commercials.'
  }
];

// Single Source of Truth aliases and lookup helpers
export const SERVICES_DATA = SERVICES;

export const getServiceItem = (nameOrId?: string): Service => {
  if (!nameOrId) return SERVICES[0];
  const q = nameOrId.trim().toLowerCase();
  const direct = SERVICES.find(
    (s) => s.title.toLowerCase() === q || s.id.toLowerCase() === q
  );
  if (direct) return direct;

  if (q.includes('edit')) return SERVICES[0]; // Video Editing
  if (q.includes('sound') || q.includes('audio') || q.includes('foley')) return SERVICES[1]; // Sound Designing
  if (q.includes('motion') || q.includes('animat') || q.includes('vfx') || q.includes('graphic')) return SERVICES[2]; // Motion Graphics
  if (q.includes('photo')) return SERVICES[3]; // Photography
  if (q.includes('drone') || q.includes('aerial')) return SERVICES[4]; // Drone Shots
  if (q.includes('product') || q.includes('film') || q.includes('commercial') || q.includes('campaign') || q.includes('direct')) return SERVICES[5]; // Video Production

  return SERVICES[0];
};

export const getServicePrice = (nameOrId?: string): string => {
  return getServiceItem(nameOrId).price;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    clientName: 'Marcus Vance',
    role: 'Founder & CEO',
    company: 'Apex Performance Apparel',
    avatarText: 'MV',
    rating: 5,
    text: 'The edit completely changed how our brand looks online. The pacing, visuals and transitions were exactly what we needed to command premium market pricing.',
    projectType: 'Commercial Campaign & Reels',
    timeAgo: '2 weeks ago'
  },
  {
    id: 't2',
    clientName: 'Elena Rostova',
    role: 'Creative Director',
    company: 'Lumina Spirits Group',
    avatarText: 'ER',
    rating: 5,
    text: 'Delivered our product launch commercial two days ahead of schedule. The color grading alone elevated our product perceived value 10x. WG Media Production is our permanent partner.',
    projectType: 'Cinema Product Spot',
    timeAgo: '1 month ago'
  },
  {
    id: 't3',
    clientName: 'Julian Thorne',
    role: 'Digital Creator (1.4M Followers)',
    company: 'Thorne Media Lab',
    avatarText: 'JT',
    rating: 5,
    text: 'Finding an editing team that understands retention without resorting to cheap gimmicks is rare. They nailed the cinematic cadence and our average watch time increased by 44%.',
    projectType: 'Long-Form & YouTube Series',
    timeAgo: '3 weeks ago'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Waleed Ghangla',
    role: 'Founder & Owner',
    agency: 'WG MEDIA PRODUCTION',
    specialty: 'Video Editing, Sound Designing, Motion Graphics & Video Production',
    bio: "Waleed Ghangla is the Founder and Owner of WG MEDIA PRODUCTION, specializing in video editing, sound designing, motion graphics, and video production. He oversees the agency's creative direction and brings together the different stages of production to create polished visual content.",
    isFounder: true,
    avatar: '/assets/images/waleed_ghangla_avatar.jpg',
    services: [
      'Video Editing',
      'Sound Designing',
      'Motion Graphics',
      'Video Production'
    ],
    certificate: {
      title: 'Certificate of Participation',
      recipient: 'Malik Waleed Hassan',
      role: 'Social Media Manager & Video Editor',
      organization: 'Brig® Shafiq Ahmad Khan Niazi Memorial Trust Hospital Bhakkar',
      hospital: 'Brigadier Shafiq Trust Hospital',
      event: 'Eye Camp Surgeries',
      dates: '24th, 25th, and 26th November 2025',
      signatory: 'Dr Shehryar Ahmed Khan Niazi (Chief Executive Officer)',
      motto: 'Eye Camp — Support Eye Care · Save Vision',
      image: '/assets/images/waleed_certificate_real.jpg'
    }
  },
  {
    name: 'Turfa Shaukat',
    role: 'Video Editing & Graphic Design',
    bio: 'Video editing, graphics designing (customer service and data entry)',
    specialty: 'Video Editing, Graphics Designing',
    avatar: '/assets/images/turfa_shaukat_avatar.jpg'
  }
];
