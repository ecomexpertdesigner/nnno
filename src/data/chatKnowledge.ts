import { SERVICES, TEAM_MEMBERS, AGENCY_CONTACT } from './content.ts';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  action?: {
    type: 'inquiry' | 'whatsapp' | 'call' | 'navigate' | 'estimate';
    label: string;
    payload?: string;
  };
}

export interface QuickPrompt {
  id: string;
  icon: string;
  label: string;
  query: string;
}

export const INITIAL_QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'rates',
    icon: '💰',
    label: 'Pricing & Packages',
    query: 'What are your video editing and production rates?',
  },
  {
    id: 'turnaround',
    icon: '⚡',
    label: 'Turnaround Times',
    query: 'How fast can you deliver my video?',
  },
  {
    id: 'estimate',
    icon: '🧮',
    label: 'Instant Quote Calculator',
    query: 'Calculate an instant project estimate',
  },
  {
    id: 'raw-footage',
    icon: '📦',
    label: 'Sending Raw Footage',
    query: 'How do I send you my raw clips and files?',
  },
  {
    id: 'team',
    icon: '👥',
    label: 'Talk to Waleed / Team',
    query: 'How do I speak directly with Waleed or Turfa?',
  },
];

export const INITIAL_GREETING: ChatMessage = {
  id: 'msg-welcome',
  sender: 'bot',
  text: `Hello! 👋 I'm **Nova**, WG Media Production's AI Support Assistant.

I can help you with:
• **Transparent rates** for Video Editing, Sound Design & Motion Graphics
• **Turnaround times** & expedited delivery
• **Instant project cost estimates**
• Sending your raw footage & revision policies
• Connecting you directly with **Waleed Ghangla** and the team

How can I assist your production today?`,
  timestamp: 'Just now',
  quickReplies: [
    'What are your editing rates?',
    'Calculate an instant estimate',
    'How fast is turnaround?',
    'I have raw footage ready',
    'Chat on WhatsApp',
  ],
};

interface MatchPattern {
  keywords: string[];
  response: (query: string) => {
    text: string;
    action?: ChatMessage['action'];
    quickReplies?: string[];
  };
}

export const KNOWLEDGE_PATTERNS: MatchPattern[] = [
  // 1. Pricing / Rates / Costs
  {
    keywords: ['price', 'pricing', 'rate', 'rates', 'cost', 'costs', 'fee', 'package', 'packages', 'how much', 'cheap', 'budget', 'charges', 'pkr', 'rs'],
    response: () => ({
      text: `Here is our transparent pricing grounded in WG Media Production's verified starter rates:

🎬 **Video Editing** — Starting at **Rs. 1,500** per reel/video
🔊 **Sound Designing** — Starting at **Rs. 2,000** (Foley, SFX & balance)
✨ **Motion Graphics** — Starting at **Rs. 2,500** (Kinetic 3D typography & VFX)
📸 **Photography** — Starting at **Rs. 1,800** (Commercial & product stills)
🚁 **Drone Shots** — Starting at **Rs. 3,000** (4K HDR aerial perspectives)
🎥 **Full Video Production** — Starting at **Rs. 3,500** (Script-to-master commercials)

💡 *Tip:* We also offer custom monthly retainers for high-volume creators and brands with bundled discounts.`,
      action: {
        type: 'inquiry',
        label: 'Open Full Project Inquiry Drawer',
        payload: 'Video Editing',
      },
      quickReplies: [
        'Calculate an instant estimate',
        'What is included in Video Editing?',
        'Do you offer monthly retainers?',
        'Chat on WhatsApp with Waleed',
      ],
    }),
  },

  // 2. Turnaround / Delivery Times
  {
    keywords: ['turnaround', 'time', 'fast', 'quick', 'urgent', 'delivery', 'days', 'hours', 'timeline', 'rush', 'how long', 'deadline'],
    response: () => ({
      text: `⏱️ **Our Standard & Rush Delivery Timelines:**

• **Short-Form Reels / TikToks:** 24 to 48 Hours *(Rush same-day delivery available upon request)*
• **Sound Design & Stem Balancing:** 1 to 3 Days
• **YouTube Long-Form / Vlogs:** 2 to 5 Days
• **Motion Graphics & 3D Typography:** 1 to 2 Weeks
• **Full Cinema Commercial Production:** 2 to 4 Weeks

⚡ All projects include milestone checkpoints so you can review early assembly cuts without waiting until final delivery.`,
      action: {
        type: 'inquiry',
        label: 'Book a Project with Deadline',
        payload: 'Video Editing',
      },
      quickReplies: [
        'Can you do a rush 24-hour edit?',
        'What are your revision policies?',
        'What are your video editing rates?',
      ],
    }),
  },

  // 3. Raw footage workflow
  {
    keywords: ['footage', 'raw', 'send', 'upload', 'drive', 'dropbox', 'wetransfer', 'camera', 'clips', 'files', 'format', '4k', 'prores', 'resolution'],
    response: () => ({
      text: `📦 **How to Send Your Raw Footage:**

1. **Upload your media** to Google Drive, Dropbox, WeTransfer, or Frame.io.
2. Share a view/download link with **waleedghangla@gmail.com** or send it to us via WhatsApp.
3. We accept all professional formats: **ProRes, Sony S-Log, Canon C-Log, RED RAW, BRAW, D-Log, and 4K 60/120fps**.
4. We perform initial file integrity checks and color space conforms within 2 hours of receipt.

Got your link ready right now?`,
      action: {
        type: 'whatsapp',
        label: 'Send Files via WhatsApp',
        payload: AGENCY_CONTACT.whatsappUrl,
      },
      quickReplies: [
        'What software do you use?',
        'What is your revision policy?',
        'Open Project Inquiry',
      ],
    }),
  },

  // 4. Instant Quote / Calculator
  {
    keywords: ['calculate', 'quote', 'estimate', 'calculator', 'how much for my project', 'custom quote'],
    response: () => ({
      text: `🧮 **Instant Project Scoper & Estimate:**

Select the primary format of your project below to view a tailored scope, or use our interactive calculator:

• **Reels / Shorts (Under 60s):** ~Rs. 1,500 – Rs. 3,500
• **YouTube Video (8–15 min):** ~Rs. 4,500 – Rs. 9,500
• **Commercial Brand Ad:** ~Rs. 8,000 – Rs. 18,000
• **3D Motion Graphics Overlay:** ~Rs. 3,000 – Rs. 7,000

Want an exact tailored quote for your specific footage duration and turnaround?`,
      action: {
        type: 'estimate',
        label: 'Launch Interactive Estimate Calculator',
      },
      quickReplies: [
        'I need 3 to 5 Reels per week',
        'I need a YouTube video edit',
        'I need 3D Motion Graphics',
        'Talk to Waleed directly',
      ],
    }),
  },

  // 5. Team / Waleed Ghangla / Turfa Shaukat
  {
    keywords: ['waleed', 'ghangla', 'turfa', 'shaukat', 'who', 'owner', 'founder', 'team', 'staff', 'editor', 'experience', 'credentials', 'certificate'],
    response: () => ({
      text: `👤 **About the WG Media Production Leadership Team:**

• **Waleed Ghangla** — Founder, Owner & Lead Creative Director. Specializes in cinematic video editing, pacing, sound design, and motion graphics. Certified for outstanding multimedia direction during the prestigious Brigadier Shafiq Memorial Medical Campaign.
• **Turfa Shaukat** — Video Editing, Graphics Design, customer relations & asset coordination.

Together, we ensure every cut is deliberate, retention-tested, and polished to international broadcast standards.`,
      action: {
        type: 'navigate',
        label: 'Meet the Full Team',
        payload: 'team',
      },
      quickReplies: [
        'View Waleed’s Certificate',
        'Chat with Waleed on WhatsApp',
        'Explore our Portfolio Projects',
      ],
    }),
  },

  // 6. WhatsApp & Direct Contact
  {
    keywords: ['whatsapp', 'call', 'phone', 'contact', 'talk', 'number', 'speak', 'email', 'reach', 'mobile', 'address'],
    response: () => ({
      text: `📞 **Connect With Us Directly:**

• **WhatsApp:** [0332 7865342](${AGENCY_CONTACT.whatsappUrl}) *(Fastest response, typically <15 mins)*
• **Direct Phone:** **0332 7865342** (Pakistan: +92 332 7865342)
• **Email:** **waleedghangla@gmail.com**
• **Operating Hours:** Monday – Saturday, 9:00 AM – 10:00 PM PKT

You can also submit a detailed project inquiry right here on the website!`,
      action: {
        type: 'whatsapp',
        label: 'Open WhatsApp Chat (+92 332 7865342)',
        payload: AGENCY_CONTACT.whatsappUrl,
      },
      quickReplies: [
        'Call 0332 7865342 now',
        'Open Project Inquiry Form',
        'View Portfolio Work',
      ],
    }),
  },

  // 7. Revisions & Satisfaction Guarantee
  {
    keywords: ['revision', 'revisions', 'changes', 'guarantee', 'satisfied', 'feedback', 'review', 'change'],
    response: () => ({
      text: `🔄 **Revisions & Quality Assurance:**

• **Included Revisions:** Every project comes with **2 to 3 comprehensive revision rounds** at no extra cost.
• **Time-Coded Feedback:** We supply review cuts via interactive review links where you can click exact timestamps to leave notes.
• **Guaranteed Retention:** If a hook or transition doesn't match your visual standard, we refine it until it hits perfection.
• **Final Delivery:** Masters delivered in uncompressed 4K ProRes/MP4 with separate audio stems upon request.`,
      action: {
        type: 'inquiry',
        label: 'Start a Project with Revisions Included',
        payload: 'Video Editing',
      },
      quickReplies: [
        'What software do you edit in?',
        'How fast is turnaround?',
        'What are your rates?',
      ],
    }),
  },

  // 8. Software & Technical Pipeline
  {
    keywords: ['software', 'tools', 'premiere', 'after effects', 'davinci', 'resolve', 'blender', 'plugins', 'color grade', 'lut', 'luts', 'foley'],
    response: () => ({
      text: `💻 **Our Production & Post-Production Suite:**

• **Video Editing:** Adobe Premiere Pro CC & DaVinci Resolve Studio 19
• **Color Grading:** ACES & DaVinci Wide Gamut calibrated workflow
• **Motion Graphics:** Adobe After Effects CC & Blender 3D
• **Audio & Sound Design:** Ableton Live & Adobe Audition with dedicated Foley libraries & Dolby stem balancing
• **Graphics Design:** Adobe Photoshop & Illustrator

We deliver industry-standard master files ready for YouTube, Instagram Reels, TikTok, and cinema broadcast.`,
      action: {
        type: 'navigate',
        label: 'View Project Case Studies',
        payload: 'projects',
      },
      quickReplies: [
        'What are your video editing rates?',
        'Can you do sound design only?',
        'I have raw footage ready',
      ],
    }),
  },

  // 9. Payment Methods
  {
    keywords: ['payment', 'pay', 'jazzcash', 'easypaisa', 'bank', 'transfer', 'invoice', 'crypto', 'advance', 'deposit', 'method'],
    response: () => ({
      text: `💳 **Payment Methods & Terms:**

• **Accepted Methods:** Bank Wire / Direct Transfer, JazzCash, EasyPaisa, and international payments.
• **Payment Structure:** 
  - 50% initial commitment upon project booking and asset transfer
  - 50% upon final master approval
• Transparent invoices provided with project breakdown. No hidden fees or surprise upcharges!`,
      action: {
        type: 'inquiry',
        label: 'Book with Secure Payment',
        payload: 'Video Editing',
      },
      quickReplies: [
        'Calculate an instant estimate',
        'Chat on WhatsApp with Waleed',
        'What is your turnaround time?',
      ],
    }),
  },

  // 10. Sound Design specific
  {
    keywords: ['sound', 'audio', 'sfx', 'foley', 'music', 'mix', 'voiceover', 'voice', 'sound design'],
    response: () => ({
      text: `🔊 **Sound Designing by WG Media Production:**

Our Sound Design service starts at **Rs. 2,000** and transforms flat video into a visceral, cinematic experience:
• Multi-track tactile Foley (footsteps, fabric, impacts, cinematic whooshes)
• Spatial audio layering & ambient depth
• Beat-synced risers, drops, and braams
• Dialogue clarity enhancement & noise reduction
• Final stem mixing and loudness compliance (-14 LUFS for streaming)

Check out our "Hear What Our Sound Design Adds" showcase in the portfolio!`,
      action: {
        type: 'navigate',
        label: 'Watch Sound Design Breakdown',
        payload: 'projects',
      },
      quickReplies: [
        'Can you add sound design to my existing edit?',
        'What is the turnaround time?',
        'Book Sound Design service',
      ],
    }),
  },

  // 11. Motion Graphics specific
  {
    keywords: ['motion', 'animation', 'graphic', 'graphics', 'logo', 'sting', 'typography', 'kinetic', 'vfx', '3d'],
    response: () => ({
      text: `✨ **Motion Graphics & Visual Animation:**

Starting at **Rs. 2,500**, we create captivating motion graphics that hold viewer attention:
• 3D kinetic typography & animated captions
• Animated brand logos & intro/outro stings
• Dynamic infographic callouts & UI breakdowns
• Split-screen comparisons & before-and-after animations
• Custom lower thirds and subscribe/follow cues

Check out our "Motion Graphics Reels — Before & After" in the Selected Work section!`,
      action: {
        type: 'inquiry',
        label: 'Inquire About Motion Graphics',
        payload: 'Motion Graphics',
      },
      quickReplies: [
        'Can you animate our company logo?',
        'What are your turnaround times?',
        'View Portfolio Work',
      ],
    }),
  },

  // 12. Monthly Retainers / Long-term contracts
  {
    keywords: ['retainer', 'monthly', 'bulk', 'recurring', 'creator pack', 'batch', 'contract', 'long term', 'regular'],
    response: () => ({
      text: `🚀 **Monthly Creator & Agency Retainers:**

Looking for consistent high-retention video output every week?
• **Creator Starter Pack:** 12 Vertical Reels / Month (Includes editing, captions, sound & color)
• **Pro Growth Retainer:** 20 Vertical Reels + 2 YouTube Long-Form edits / Month
• **Agency White-Label:** We serve as your dedicated remote post-production department under your agency branding.

Retainer clients receive priority turnaround (<24h), dedicated Slack/WhatsApp channels, and up to 25% savings compared to single orders.`,
      action: {
        type: 'whatsapp',
        label: 'Discuss Monthly Retainer on WhatsApp',
        payload: AGENCY_CONTACT.whatsappUrl,
      },
      quickReplies: [
        'What are individual video editing rates?',
        'How fast is priority turnaround?',
        'Open Project Inquiry',
      ],
    }),
  },
];

/**
 * Intelligent intent matcher for simulated AI responses
 */
export function getSimulatedAIResponse(userQuery: string): {
  text: string;
  action?: ChatMessage['action'];
  quickReplies?: string[];
} {
  const cleanQuery = userQuery.trim().toLowerCase();

  // 1. Direct match in knowledge patterns
  for (const item of KNOWLEDGE_PATTERNS) {
    const hasKeyword = item.keywords.some((kw) => {
      // word boundary check or substring match
      return cleanQuery.includes(kw);
    });

    if (hasKeyword) {
      return item.response(userQuery);
    }
  }

  // 2. Friendly fallback if general or greeting
  if (['hi', 'hello', 'hey', 'salam', 'aoa', 'greetings', 'yo'].some((g) => cleanQuery.startsWith(g) || cleanQuery === g)) {
    return {
      text: `Hello! 👋 Great to connect with you. I'm Nova, WG Media Production's virtual studio assistant.

How can I help you today? You can ask about our video editing rates, delivery turnaround, sound design, or request an instant project estimate!`,
      quickReplies: [
        'What are your editing rates?',
        'Calculate an instant estimate',
        'How fast can you edit a reel?',
        'Chat with Waleed on WhatsApp',
      ],
    };
  }

  // 3. Thank you / Affirmations
  if (['thanks', 'thank you', 'great', 'awesome', 'perfect', 'ok', 'okay', 'got it'].some((t) => cleanQuery.includes(t))) {
    return {
      text: `You're very welcome! 🙌 We would love to collaborate on your next project and turn your footage into something audiences truly remember.

Whenever you're ready to get started, you can submit an inquiry or reach out to Waleed on WhatsApp!`,
      action: {
        type: 'inquiry',
        label: 'Start Your Project Now',
        payload: 'Video Editing',
      },
      quickReplies: [
        'Open Project Inquiry',
        'Chat on WhatsApp (+92 332 7865342)',
        'What are your rates again?',
      ],
    };
  }

  // 4. Fallback contextual guidance
  return {
    text: `Thanks for asking about that! At **WG Media Production**, we specialize in high-retention video editing, cinematic sound design, motion graphics, drone cinematography, and full video production.

Here are the best ways we can help right now:
• **Video Editing Starter:** From Rs. 1,500 / reel (24–48h turnaround)
• **Custom Sound Design:** From Rs. 2,000 with tactile Foley & stem balance
• **Instant Project Quote:** Tailored to your exact video length & footage

Would you like to calculate an instant cost estimate, explore our portfolio, or chat directly with Waleed?`,
    action: {
      type: 'inquiry',
      label: 'Submit a Project Inquiry',
      payload: 'Video Editing',
    },
    quickReplies: [
      'What are your editing rates?',
      'Calculate an instant estimate',
      'How do I send raw footage?',
      'Chat on WhatsApp with Waleed',
    ],
  };
}
