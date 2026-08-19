import {
  Zap,
  Target,
  Globe,
  Pencil,
  Clock,
  Sparkles,
  Heart,
  Coins,
  Home
} from 'lucide-astro';

export const pillars = [
  {
    id: 'remote-income',
    name: 'Remote Income',
    label: 'Jobs, Income & Sniping',
    description: 'Tactical protocols for securing high-yield remote opportunities and micro-SaaS revenue.',
    icon: Zap,
    color: 'text-red-500',
    accent: 'bg-red-500/10',
    cta: 'Start Sniping',
    heroImage: '/images/remote-work.jpg',
    longDescription: 'The Remote Income pillar focuses on high-speed monetization. From job sniping to data arbitrage and micro-SaaS assets, we build the infrastructure required to generate consistent, location-independent yield.'
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    label: 'Outreach, Systems & Automation',
    description: 'Professional-grade client acquisition frameworks and autonomous lead engines.',
    icon: Target,
    color: 'text-emerald-500',
    accent: 'bg-emerald-500/10',
    cta: 'Activate Systems',
    heroImage: '/images/lead-gen.jpg',
    longDescription: 'Lead Generation is the engine of your business. We architect autonomous outreach systems, multi-vector intent scoring, and high-conversion client acquisition loops that decouple growth from manual labor.'
  },
  {
    id: 'geo-arbitrage',
    name: 'Geo-Arbitrage',
    label: 'Lifestyle, Cost & Global Living',
    description: 'Global living strategies, cost-optimization, and sovereign digital nomad protocols.',
    icon: Globe,
    color: 'text-cyan-400',
    accent: 'bg-cyan-400/10',
    cta: 'Engineer Lifestyle',
    heroImage: '/images/geo-arbitrage.jpg',
    longDescription: 'Geo-Arbitrage is the ultimate optimization for the sovereign individual. We leverage global market disconnects to engineer a high-performance lifestyle, significantly reducing burn while maximizing experience and security.'
  },
  {
    id: 'build-in-public',
    name: 'Build in Public',
    label: 'Process, Systems & Transparency',
    description: 'The live documentation of building a one-person business ecosystem from Southeast Asia.',
    icon: Pencil,
    color: 'text-violet-400',
    accent: 'bg-violet-400/10',
    cta: 'Follow the Build',
    heroImage: '/images/build-in-public-pillar.jpeg',
    longDescription: 'Build in Public documents the real journey — wins, failures, systems, and experiments — of constructing a one-person digital business ecosystem from Southeast Asia. Public execution compounds trust and turns transparency into leverage.'
  },
  {
    id: 'time-arbitrage',
    name: 'Time Arbitrage',
    label: 'Async Systems, SOPs & Delegation',
    description: 'Async systems, SOPs, delegation frameworks, and how to turn timezone differences into a compounding advantage.',
    icon: Clock,
    color: 'text-orange-500',
    accent: 'bg-orange-500/10',
    cta: 'Build Async Systems',
    heroImage: '/images/blog/pillars/time-arbitrage-hub.png',
    longDescription: 'Time arbitrage is the discipline of multiplying your output without multiplying your hours. For expat founders operating across time zones, the right systems, SOPs, and delegation stack turn the timezone gap into a compounding advantage.'
  },
  {
    id: 'ai-arbitrage',
    name: 'AI Arbitrage',
    label: 'Tools, Workflows & Multi-Agent Systems',
    description: 'The AI tools, workflows, and multi-agent systems that give solo expat founders team-size output on a lean budget.',
    icon: Sparkles,
    color: 'text-violet-500',
    accent: 'bg-violet-500/10',
    cta: 'Build Your AI Stack',
    heroImage: '/images/blog/pillars/ai-arbitrage-hub.png',
    longDescription: 'AI arbitrage is the practice of using artificial intelligence to capture capabilities that previously required a full team. For expat founders running lean from Southeast Asia, the right AI stack closes the gap between solo operator and agency-scale output.'
  },
  {
    id: 'health-arbitrage',
    name: 'Health Arbitrage',
    label: 'Healthcare, Dental & Wellness Abroad',
    description: 'Private hospitals, dental tourism, health insurance, and fitness infrastructure for expat founders living abroad.',
    icon: Heart,
    color: 'text-emerald-500',
    accent: 'bg-emerald-500/10',
    cta: 'Get Health Intel',
    heroImage: '/images/blog/pillars/health-arbitrage-hub.png',
    longDescription: 'Health arbitrage is access to world-class healthcare, dental, fitness, and longevity infrastructure at a fraction of what it costs in the United States. For expat founders, staying healthy is not a lifestyle choice — it is operational infrastructure.'
  },
  {
    id: 'market-arbitrage',
    name: 'Market Arbitrage',
    label: 'Currency, Investing & Information Edge',
    description: 'Currency strategy, FEIE, investing from abroad, and information asymmetry plays for expat founders building wealth.',
    icon: Coins,
    color: 'text-amber-500',
    accent: 'bg-amber-500/10',
    cta: 'Find Your Edge',
    heroImage: '/images/blog/pillars/market-arbitrage-hub.png',
    longDescription: 'Market arbitrage is the practice of identifying and capturing value in the gap between where assets, information, or capital are undervalued and where they are not. For expat founders, opportunities range from currency strategy and cross-border investing to information asymmetry plays.'
  },
  {
    id: 'relocation-stay',
    name: 'Relocation & Stay Strategy',
    label: 'Visas, Moves & Long-Term Legal Footing',
    description: 'Visa pathways, moving logistics, and long-term legal residency strategy for expat founders choosing where to stay.',
    icon: Home,
    color: 'text-indigo-500',
    accent: 'bg-indigo-500/10',
    cta: 'Talk Through Your Move',
    heroImage: '/images/blog/pillars/relocation-stay-hub.png',
    longDescription: 'Relocation & Stay Strategy covers the legal and logistical backbone of living abroad long-term — visa pathways, residency permits, the physical move itself, and the decisions that determine whether a founder can stay somewhere for years instead of months.',
    // NOTE: This pillar intentionally does NOT use the standard 65% hard
    // content gate. Gate behavior in this codebase is driven per-article by
    // `post.data.category` (HARD_GATE_CATEGORIES) and the `gated` frontmatter
    // flag in src/pages/blog/[...path].astro — it is not read from this
    // pillars config today. To keep articles in this pillar soft-gated (or
    // ungated) with a primary CTA to /consulting instead of /newsletter,
    // set each article's frontmatter accordingly (e.g. `gated: false`, or a
    // `category` outside HARD_GATE_CATEGORIES, or add its slug to the
    // soft-CTA slug set) rather than relying on pillarId. See the chat
    // output for full detail — this is flagged, not auto-enforced.
    gateMode: 'soft',
    ctaOverride: '/consulting'
  }
];

export const getPillarById = (id: string) => pillars.find(p => p.id === id);
