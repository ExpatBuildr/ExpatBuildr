// src/data/playbook-data.ts
// Single source of truth for the Philippines playbook page.
// Edit numbers here and every total on the page recalculates.

export const CONFIG = {
  KIT_URL: 'https://expatbuildr.com/kit', // kit / checkout page
  KIT_PRICE: 65,
  PDF_URL: '#', // link to the PDF download
  RATE: 61, // default pesos per dollar
};

export const COUNTRIES = [
  { id: 'philippines', label: 'Philippines', live: true },
  { id: 'thailand', label: 'Thailand', live: false },
  { id: 'vietnam', label: 'Vietnam', live: false },
  { id: 'malaysia', label: 'Malaysia', live: false },
  { id: 'indonesia', label: 'Indonesia', live: false },
];

export const CHAPTERS = [
  { id: 'math', title: 'The math' },
  { id: 'numbers', title: 'My numbers' },
  { id: 'banking', title: 'Banking and money' },
  { id: 'move', title: 'The move' },
  { id: 'cities', title: 'Cities' },
  { id: 'first90', title: 'First 90 days' },
  { id: 'pitfalls', title: '47 pitfalls' },
  { id: 'visa', title: 'Visa reality' },
  { id: 'income', title: 'Remote income' },
  { id: 'plan', title: '30-day plan' },
];

// [category, Scottsdale monthly, Cebu note, Cebu monthly]
export const CMP: [string, number, string, number][] = [
  ['Rent', 800, '$276 (4BR house)', 276],
  ['Food', 800, '$160 (family of 7)', 160],
  ['Car / transport', 460, '$120 (motorbike)', 120],
  ['Car insurance', 160, '$0', 0],
  ['Car maintenance', 300, '$0', 0],
  ['Phone', 155, '$28 (3 SIMs)', 28],
  ['Internet', 120, '$27', 27],
  ['Utilities / electric', 110, '$110', 110],
  ['Entertainment', 150, '$50', 50],
];

export const SC: [string, number][] = [
  ['Rent (room in shared house, half of a $1,600 2BR)', 800],
  ['Car insurance (required in AZ)', 160],
  ['Car maintenance and repairs (monthly average)', 300],
  ['Gas (Phoenix sprawl means constant driving)', 150],
  ['Food and groceries (cooking plus eating out)', 800],
  ['Entertainment (bars, events, subscriptions)', 150],
  ['Internet (home)', 120],
  ['Car wash (desert dust is constant)', 30],
  ['Phone (T-Mobile)', 155],
  ['Credit card minimums (carrying balances)', 200],
  ['Sending money to PH (supporting family already there)', 400],
  ['Utilities / electric (AC in Arizona is not optional)', 110],
];

// [label, pesos, usd, note]
export const CE: [string, number, number, string][] = [
  ['Rent (4BR house)', 15600, 276, 'Includes 800p HOA'],
  ['Electric bill', 6200, 110, 'One AC unit alone is about 4,000p'],
  ['Phone (3 SIMs)', 1600, 28, 'Smart PH + Google Voice + eSIM US number'],
  ['Internet', 1500, 27, 'Home fiber'],
  ['Food (family of 7)', 9000, 160, 'Market shopping, home cooked'],
  ['Motorbike payment', 6200, 110, '2025 Aerox, brand new, 200 miles on arrival'],
  ['Gas (whole month)', 1100, 20, 'Full tank lasts weeks'],
  ['School supplies', 500, 9, "Kids' needs"],
];

export const CITIES = {
  cebu: { label: 'Cebu City', name: 'Cebu City', lo: 500, hi: 900 },
  manila: { label: 'Metro Manila', name: 'Metro Manila', lo: 800, hi: 1400 },
  davao: { label: 'Davao City', name: 'Davao City', lo: 300, hi: 600 },
  galaxy: { label: 'My setup (family of 7)', name: 'my setup (family of 7, mountain behind IT Park)', lo: 743, hi: 743 },
};

export type Group = { g: string; items: string[] };

export const CL_A: Group[] = [
  {
    g: 'Before you land',
    items: [
      'Keep your US phone plan active until you land. You need it during layovers in Tokyo, Hong Kong or Shanghai. Upgrade to an international plan temporarily, then cancel after you arrive.',
      'If you have a business phone number, pay off the device before you leave. A financed phone is carrier-locked and you cannot move the number.',
      'Get a Google Voice number before you fly. It is a free US number that works over wifi anywhere and becomes your permanent US contact number.',
      'Open a Wise account now and verify it before you need it.',
      'Book a 30-day Airbnb in your target city before you book your flight. Stable wifi and a kitchen are non-negotiable.',
      'Have at least $2,000 liquid in accessible accounts: two months of expenses as runway.',
      'Order Philippine pesos from your US bank before you leave if you can. The rate is not ideal, but cash on arrival removes day-one stress.',
    ],
  },
  {
    g: 'Week 1: arrive and stabilize',
    items: [
      'Check into your pre-booked Airbnb immediately. Do not hotel-hop.',
      'Get a Smart or Globe SIM from any SM Mall. A starter pack with data is about 299 pesos.',
      'Set up GCash right away using your Smart number. It is your daily payment infrastructure.',
      "Order familiar food through GrabFood or FoodPanda when you are stressed. McDonald's is everywhere and arrives in 20 to 30 minutes.",
      'Shop at SM Market inside any SM Mall, the most foreigner-friendly option. Health food stores in the malls are priced closer to US prices, so choose wisely.',
      'Locate the nearest ATM. Test your cards and note which ones charge fees.',
    ],
  },
  {
    g: 'Weeks 2 to 4: find your home',
    items: [
      'Start apartment hunting on Facebook Marketplace, the primary rental listing source in Cebu.',
      'Budget 2 months deposit plus 1 month advance on top of monthly rent.',
      'Check flooding history before signing anything. Avoid Lapu-Lapu City unless you are in a highrise, because flooding there is serious and motorbikes cannot cross flood water.',
      'If you choose a highrise, research the building standards and know your emergency exits. The Philippines has strong earthquakes.',
      'Renting with pets? Expect to pay significantly more, and many landlords refuse pets entirely.',
      'Test the internet at the unit during daytime hours and ask what provider the neighbors use.',
      'Negotiate the rent. The monthly rate is negotiable, especially for commitments of 6 months or more.',
      'Check the electric bills for the last 3 months. One AC unit runs around 4,000 pesos per month, and bills spike further with reconnection fees after a cutoff.',
    ],
  },
  {
    g: 'Months 2 to 3: get legal and stable',
    items: [
      'Apply for your ACR I-Card at the Bureau of Immigration. It is forced on you after 59 days anyway. It costs an extra $40 to $50 at renewal and unlocks 6-month renewals.',
      'Open a BDO or BPI bank account if possible. It is easier with a local partner or spouse.',
      'Rent a motorbike short-term while you learn the roads. Buying new is hard without a Filipino co-signer, because shops require one for seller financing.',
      'Build your remote work schedule around Cebu time (UTC+8) and your US client overlap hours.',
    ],
  },
];

export const PLAN: Record<string, { label: string; items: string[] }> = {
  us: {
    label: 'Still in the US',
    items: [
      'Run the Geo-Arbitrage Philippines calculator with your actual income. Get your real number today.',
      'Open a Wise account and verify it before you need it.',
      'Keep your current phone plan active for now. You need it during layovers, and you cancel after you land.',
      'If you have a business number on a financed device, pay off your phone before you leave so you can port the number.',
      'Start liquidating anything you will not ship: Marketplace, OfferUp, Facebook.',
      'Book a 30-day Airbnb in Cebu before you book your flight. Stable wifi is income infrastructure.',
      'Set a departure date and make it real. The planning phase has a shelf life.',
    ],
  },
  new: {
    label: 'Just arrived',
    items: [
      'Get a Smart SIM from any SM Mall on day one.',
      'Open GCash immediately using your Smart number.',
      'Use GrabFood for stress-free week-one meals: fast, everywhere, delivered by motorbike.',
      'Shop at SM Market inside the SM Mall for groceries. Organic options exist but are priced closer to US prices.',
      'Start the income and expense tracker on day one. Track every peso from the beginning.',
      'Visit the Bureau of Immigration to understand your visa timeline and ACR requirements.',
      'Join the Cebu Expats Facebook group and introduce yourself.',
    ],
  },
  est: {
    label: 'Established abroad',
    items: [
      'Get your ACR I-Card. It unlocks 6-month visa renewals and removes the constant immigration grind.',
      'Open a BDO or BPI account for direct PHP banking.',
      'Set up a second income stream. Even a small one reduces pressure.',
      'Track your arbitrage gap every month and watch it compound.',
      'Subscribe to Galaxy Arbitrage Weekly. Every issue covers one more lever you can pull.',
      'Reply to a Galaxy Arbitrage email with where you are at.',
    ],
  },
};

export const PIT_CATS = ['All', 'Money and banking', 'Housing', 'Visa', 'Daily life', 'Remote work', 'Quick list'];

// [number, category, title, body, fix]
export const PITS: [number, string, string, string, string][] = [
  [1, 'Money and banking', 'Using a foreign debit card at ATMs', 'Most PH banks charge $5 per withdrawal for foreign cards.', "Use a local partner's card: 18p fee versus $5. GCash cash-out at sari-sari stores is often cheaper (about 50p per 1,000p)."],
  [2, 'Money and banking', 'Keeping T-Mobile active after you arrive', 'At $155 a month that bill is almost as much as rent in Cebu. Roaming burns money fast, and Verizon and AT&T barely work in the Philippines anyway.', 'Upgrade to an international plan for your layover only, then cancel when you land. A Smart SIM is about 299p for data.'],
  [3, 'Money and banking', 'Not having $2,000 liquid on arrival', 'The first apartment requires 2 months deposit plus 1 month advance. If you are tight, you cannot secure housing.', 'Have cash accessible. Not in crypto. Not in stocks. Liquid cash.'],
  [4, 'Money and banking', 'Converting money at the airport', 'Airport exchange rates run 10 to 15% worse than market.', 'Use GCash, Wise or an ATM. Never the airport counter for large amounts.'],
  [5, 'Money and banking', 'Not opening GCash immediately', 'GCash is the financial infrastructure of everyday Philippines.', 'Get a Smart SIM on day one. Open GCash on day two.'],
  [6, 'Money and banking', 'Not notifying your US bank and cards before traveling', 'Banks flag foreign transactions and freeze cards. You can be left with zero access to your funds.', 'Call every card issuer before you fly and add a travel notice. Do it for all cards, not just one.'],
  [7, 'Housing', 'Hotel-hopping instead of booking a base', 'Hotels are expensive per night, wifi is inconsistent and you waste hours moving.', 'Book a 30-day Airbnb before you land, around $500 a month, for a stable base.'],
  [8, 'Housing', 'Not checking for flooding', 'Some apartments flood every rainy season and the landlord will not mention it.', 'Ask neighbors directly. Check Google Maps satellite view for low areas. Avoid Lapu-Lapu unless in a highrise.'],
  [9, 'Housing', 'Not checking internet speed before signing', 'Some areas have weak infrastructure, and a bad connection kills remote income.', 'Run a speed test at the unit during the day and ask which provider the neighbors use.'],
  [10, 'Housing', 'Ignoring the electric bill history', 'AC is expensive in the Philippines. One unit runs around 4,000p a month, and the bill can spike with reconnection fees if power gets cut.', 'Ask for the last 3 months of bills and budget for AC realistically.'],
  [11, 'Housing', 'Not negotiating rent', 'Posted prices are negotiable, especially for longer stays.', 'Offer 10 to 15% less. Commit to 6 months and use that as leverage.'],
  [12, 'Housing', 'Forgetting to factor in pet costs', 'Landlords charge significantly more for pets or refuse them entirely.', 'Be upfront about pets in the search and add the premium to your budget.'],
  [13, 'Visa', 'Missing your visa renewal window', 'Overstaying is illegal and costs more every day. It incurs 500p per month of overstay plus escalating immigration fees, and you cannot leave the country until you settle.', 'Set a calendar reminder 3 weeks before expiry. Never let it get close.'],
  [14, 'Visa', 'Not getting your ACR I-Card early', 'Without it you renew your visa every 1 to 2 months. The card is forced on you after 59 days anyway and costs an extra $40 to $50 at renewal.', 'Apply as soon as you have a permanent address. It unlocks 6-month renewals.'],
  [15, 'Visa', 'Paying forced expedited fees', 'Immigration offices now charge for expedited processing by default, even if you did not select it.', 'Budget 2,000p extra per renewal as a buffer, and renew well before expiry to push back.'],
  [16, 'Daily life', 'Eating at Western restaurants every meal', 'In the first week, Western food can run $30 to $50 a day.', 'Find your nearest palengke (wet market) in week one. Rice, protein and vegetables cost about 150p per person per day.'],
  [17, 'Daily life', 'Taking unmetered taxis', 'Yellow cabs are metered and fine for short trips. Black van taxis cost more for no reason. With any taxi, if you leave something inside you will not get it back.', 'Use Grab for most trips. Grab does not work in Davao, so use taxis there.'],
  [18, 'Daily life', 'Buying a motorbike before knowing the roads', 'Philippine traffic is chaotic, and going straight to ownership before you understand it is a risk.', 'Rent for 2 to 3 weeks first. Buy when you understand how traffic flows in your area.'],
  [19, 'Daily life', 'Not learning basic Bisaya phrases', 'Cebu is not Manila. English is less common, especially outside IT Park.', 'Learn: Pila? (how much), Salamat (thank you), Dili (no), Oo (yes). It changes every interaction.'],
  [20, 'Daily life', 'Not having a VPN', 'Many US companies block Philippine IPs and treat you like a hacker. Streaming, some banking portals and work tools can all be blocked.', 'Get ExpressVPN or NordVPN before you land. Some sites blacklist your IP permanently without one.'],
  [21, 'Remote work', 'Not mapping your work hours before you arrive', 'Cebu is UTC+8 and US clients are UTC-5 to UTC-8. You need a clear schedule before you land.', 'Decide your core overlap hours and build your Cebu life around them.'],
  [22, 'Remote work', 'Relying on one income source', 'Remote income fluctuates. One lean month in the Philippines is recoverable. Ongoing is stressful.', 'Start building a second stream before you leave the US.'],
];

// [number, title, body]
export const QUICK: [number, string, string][] = [
  [23, 'Bringing too much luggage', 'You can buy almost everything cheaper here.'],
  [24, 'Skipping travel insurance in the first month', 'Philippine hospitals require cash upfront. SafetyWing covers this cheaply.'],
  [25, 'Trusting random taxi drivers for apartment referrals', 'They get commissions. Find listings yourself on Facebook Marketplace.'],
  [26, 'Not registering with the US Embassy STEP program', 'Enrollment is free. In emergencies the embassy can find you.'],
  [27, 'Keeping all money in one account', 'Card skimming exists. Keep emergency funds separate.'],
  [28, 'Buying bottled water daily', 'A water filter or refill station costs 5 to 10p per container.'],
  [29, 'Not preparing for brownouts', 'Power outages happen, especially in wet season. Get a UPS for your router.'],
  [30, 'Signing up for slow internet', 'Converge is generally faster than PLDT for the price in Cebu.'],
  [31, 'Sending money via Western Union', 'GCash, Wise or a wire are cheaper for regular transfers.'],
  [32, 'Not having a backup power bank', 'Heat plus constant use drains batteries fast here. Power banks are cheap.'],
  [33, 'Expecting US customer service timelines', 'Service culture is warm but timelines are different. Build patience in.'],
  [34, 'Overlooking mall pharmacies', 'Many medications are dramatically cheaper and available without a prescription.'],
  [35, 'Not building suki relationships at the market', 'Regular customer status gets you better prices over time. Show up consistently.'],
  [36, 'Forgetting rainy season planning', 'June to November is wet season. Flooding can disrupt travel and affect housing areas.'],
  [37, 'Not budgeting a flight home per year', 'Cebu to the US is $600 to $1,200. Budget one round trip annually.'],
  [38, 'Not backing up documents digitally', 'Keep digital copies of your passport, visa stamps and ACR card in Google Drive, plus physical copies at home.'],
  [39, 'Assuming credit cards work everywhere', 'Many small businesses are cash-only. Always carry 1,000 to 2,000p cash.'],
  [40, 'Neglecting your US credit score', 'Keep one US card active with a small monthly charge.'],
  [41, 'Not building a local expat network', 'Other expats have already solved most of your problems. Find the Facebook groups.'],
  [42, 'Skipping the barangay certificate', 'It is required for many processes. Get it early as proof of local residency.'],
  [43, 'Over-relying on Airbnb for long stays', 'Airbnb 30-day rates run 30 to 40% higher than direct Facebook Marketplace rentals.'],
  [44, 'Not understanding palengke pricing', 'Wet market prices are not fixed. Everything is negotiable, especially at the end of the day.'],
  [45, 'Forgetting timezone math with US family', '8pm in Cebu is 7am in Phoenix. Schedule calls or you will miss everyone.'],
  [46, 'Not telling your bank about international travel', 'Cards get frozen for foreign activity if you did not add a travel notice.'],
  [47, 'Waiting too long to research US expat taxes', 'Look up the FEIE (Foreign Earned Income Exclusion). It may reduce your US tax liability significantly. Confirm with a qualified tax professional.'],
];

// ---------- helpers (used on the server render and mirrored in the client script) ----------
export const fvOf = (monthly: number, annual = 0.07, years = 20): number => {
  const r = annual / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
};
export const money = (n: number): string => '$' + Math.round(n).toLocaleString('en-US');
export const money2 = (n: number): string => {
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2).replace(/0$/, '') + 'M';
  return money(n);
};
