const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration from environment variables
const TOKEN = process.env.SANITY_API_TOKEN;
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6m1z3oqp';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-23';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let keyCounter = 1;
function genKey() {
  return 'db_' + (keyCounter++).toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

function p(spans, markDefs = []) {
  return {
    _key: genKey(),
    _type: 'block',
    style: 'normal',
    children: spans.map(s => {
      if (typeof s === 'string') {
        return { _key: genKey(), _type: 'span', text: s, marks: [] };
      }
      return {
        _key: genKey(),
        _type: 'span',
        text: s.text,
        marks: s.marks || []
      };
    }),
    markDefs
  };
}

function h2(text) {
  return {
    _key: genKey(),
    _type: 'block',
    style: 'h2',
    children: [{ _key: genKey(), _type: 'span', text, marks: [] }],
    markDefs: []
  };
}

function h3(text) {
  return {
    _key: genKey(),
    _type: 'block',
    style: 'h3',
    children: [{ _key: genKey(), _type: 'span', text, marks: [] }],
    markDefs: []
  };
}

function quote(text) {
  return {
    _key: genKey(),
    _type: 'block',
    style: 'blockquote',
    children: [{ _key: genKey(), _type: 'span', text, marks: [] }],
    markDefs: []
  };
}

function bullet(spans, markDefs = []) {
  return {
    _key: genKey(),
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: spans.map(s => {
      if (typeof s === 'string') {
        return { _key: genKey(), _type: 'span', text: s, marks: [] };
      }
      return {
        _key: genKey(),
        _type: 'span',
        text: s.text,
        marks: s.marks || []
      };
    }),
    markDefs
  };
}

function inlineImage(refId, alt, caption) {
  return {
    _key: genKey(),
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: refId
    },
    alt,
    caption
  };
}

// Upload buffer/file to Sanity
async function uploadAsset(buffer, filename, mimeType) {
  console.log(`Uploading ${filename} to Sanity...`);
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': mimeType
    },
    body: buffer
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Sanity asset upload failed: ${JSON.stringify(data)}`);
  }
  return data.document._id;
}

// Query existing posts
async function getExistingSlugs() {
  const query = encodeURIComponent('*[_type == "post"].slug.current');
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`, {
    headers: { 'Authorization': 'Bearer ' + TOKEN }
  });
  const data = await res.json();
  return new Set(data.result || []);
}

// Research Topic Candidates Pool (Curated high-intent clusters)
const TOPIC_CANDIDATES = [
  {
    slug: 'first-birthday-personalized-sweater-keepsake-ideas',
    title: 'The Ultimate 1st Birthday Keepsake Outfit: Why Parents Choose Personalized Knitwear Over Costumes',
    categories: ['inspiration', 'tutorials'],
    excerpt: 'Planning your baby’s first birthday portraits or cake smash? Discover why hand-embroidered name sweaters have become the #1 timeless 1st birthday outfit choice.',
    infographicTitle: '1st Birthday Outfit Comparison: Knitwear vs. Themed Costume',
    card1Title: 'Heirloom Keepsake vs. One-Time Wear',
    card1Desc: 'Standard polyester character costumes get worn once for 20 minutes and discarded. A 100% cotton embroidered name sweater remains a wardrobe staple for an entire year and stays in your memory box forever.',
    card2Title: 'Skin-Friendly Comfort',
    card2Desc: 'Cake smashes involve messy frosting, warmth, and active crawling. Breathable cotton knit keeps sensitive toddler skin cool and irritation-free without scratchy plastic seams or glitter shed.',
    card3Title: 'Photogenic Timelessness',
    card3Desc: 'Avoid dated cartoon prints that age poorly in family albums. Neutral textured knitwear in camel or dusty rose paired with wooden birthday props creates an elegant, timeless portrait.',
    heroAlt: 'Toddler celebrating first birthday wearing a personalized hand-embroidered knit sweater',
    quoteText: '“A first birthday is as much a celebration of the parents as it is the child. Dressing your one-year-old in their embroidered name marks the transition from babyhood to toddlerhood with grace.”',
    faq: [
      { q: 'What size sweater should I buy for a 1st birthday?', a: 'If your child is under 22 lbs, choose size 12–18 Months. If they are in the 75th percentile or higher for height and weight, jump straight to size 2T for continuous second-year wear.' },
      { q: 'How do you clean cake smash frosting off an embroidered sweater?', a: 'Pre-treat frosting gently with cool water and mild baby dish soap (to break down buttercream oils), then hand wash gently inside out and dry flat away from direct heat.' },
      { q: 'Can I add birthday numbers or icons to the embroidery?', a: 'Yes! Along with baby’s name, our artisans can stitch custom birthday motifs such as a tiny "one" script, subtle stars, or birthday candles.' },
      { q: 'How early should I order before the birthday party?', a: 'Order at least 3 weeks in advance of your planned portrait session to account for custom handcrafting and standard delivery.' }
    ]
  },
  {
    slug: 'cotton-vs-wool-baby-clothes-sensitive-skin-guide',
    title: 'Cotton vs. Wool for Baby Sweaters: Which Fiber Is Safest for Sensitive Skin & Eczema?',
    categories: ['care-guides', 'crochet-tips'],
    excerpt: 'Confused between cotton, merino wool, and synthetic blends for baby knitwear? Learn why 100% combed cotton is the pediatrician-approved gold standard for infant comfort.',
    infographicTitle: 'Baby Knitwear Fiber Breakdown: Cotton vs. Wool vs. Acrylic',
    card1Title: 'Hypoallergenic Purity',
    card1Desc: '100% Combed cotton contains zero lanolin (the natural sheep wax found in wool that often triggers contact dermatitis and red flare-ups in infants with sensitive skin barriers).',
    card2Title: 'Zero Microfiber Itch',
    card2Desc: 'Even "fine" wool has microscopic barbed scales along its fiber shaft that prick sensitive infant nerve endings. Long-staple cotton fibers are naturally smooth and velvety against baby skin.',
    card3Title: 'Year-Round Temperature Regulation',
    card3Desc: 'Cotton breathes effortlessly in warm spring nurseries and insulates snugly over bodysuits during winter chills, preventing the sweat-trapping heat rashes common in synthetic acrylics.',
    heroAlt: 'Close-up of soft 100% combed cotton baby name sweater knit texture',
    quoteText: '“Baby skin is 30% thinner than adult skin and loses moisture twice as fast. For everyday knitwear, smooth combed cotton is the gentlest, safest choice for delicate skin barriers.”',
    faq: [
      { q: 'Can a newborn with mild eczema wear a cotton knit sweater?', a: 'Yes! Pure 100% breathable cotton is widely recommended by pediatric dermatologists as it does not irritate eczema patches or trap excessive body heat.' },
      { q: 'Does cotton keep baby warm enough during winter?', a: 'Absolutely. A thick cotton knit worn over an organic cotton onesie provides cozy thermal insulation without causing the overheating that synthetic fleeces cause.' },
      { q: 'How does cotton yarn react to hand embroidery?', a: 'Cotton yarn holds hand-stitched embroidery firmly without pilling or loosening, maintaining crisp letter definition through repeated washes.' },
      { q: 'Do Knitty Petit sweaters contain synthetic polyester?', a: 'No. Knitty Petit sweaters are crafted from 100% premium combed cotton yarn for uncompromised infant safety.' }
    ]
  },
  {
    slug: 'coordinating-sibling-matching-personalized-sweaters',
    title: 'Coordinating Sibling Outfits: How to Style Matching Personalized Sweaters for Newborns & Toddlers',
    categories: ['inspiration', 'tutorials'],
    excerpt: 'Bringing a new baby home to an older sibling? Discover aesthetic color pairings and styling secrets for matching personalized name sweaters that look charming in photos.',
    infographicTitle: 'Sibling Knitwear Styling Matrix: Complementary Color Palettes',
    card1Title: 'Complement, Don’t Clone',
    card1Desc: 'Rather than dressing both kids in the exact same color, choose harmonious sister shades: Oatmeal for baby and Camel for the older sibling, or Dusty Rose paired with Beige for vintage warmth.',
    card2Title: 'Size for Longevity',
    card2Desc: 'Toddlers grow rapidly during active preschool years. Sizing up one size for both baby (0–3M with rolled cuffs) and toddler (3T) allows matching sibling portraits across consecutive holiday seasons.',
    card3Title: 'Involve the Big Sibling',
    card3Desc: 'Letting your older child choose their sweater embroidery color or motif creates emotional bonding and excitement around welcoming their new baby brother or sister.',
    heroAlt: 'Coordinating sibling personalized knit sweaters in complementary earth tones',
    quoteText: '“Matching sibling sweaters aren’t just adorable for holiday cards—they make the big brother or big sister feel celebrated, proud, and included in the newborn journey.”',
    faq: [
      { q: 'What is the best color combination for boy/girl siblings?', a: 'Camel and Oatmeal, or Dark Green and Dusty Rose create rich, gender-neutral harmony that looks stunning against outdoor and indoor backdrops.' },
      { q: 'Can we put different icons on each sweater?', a: 'Yes! Older siblings can have custom motifs like a tiny dinosaur or train, while baby has a delicate flower or star, unified by matching font embroidery.' },
      { q: 'How do you coordinate parents’ outfits with sibling sweaters?', a: 'Keep parents in neutral solid colors (cream, white linen, or washed denim) so the children’s personalized sweaters remain the focal point of family portraits.' },
      { q: 'Are matching sweaters suitable for hospital visits?', a: 'Yes! Bringing big brother or sister to the hospital in their matching sweater makes the first meeting and birth announcement photos deeply memorable.' }
    ]
  }
];

async function generateSvgInfographic(topic) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" width="1600" height="1100">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap');
      .title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; fill: #2C2420; }
      .subtitle { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; fill: #7A6F68; }
      .tag { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 2px; fill: #9E5A44; text-transform: uppercase; }
      .card-title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 22px; fill: #382B24; }
      .card-desc { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; fill: #5C5049; line-height: 1.6; }
      .step-num { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 14px; fill: #FFFFFF; }
    </style>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FAF6F0" />
      <stop offset="100%" stop-color="#F2E9DE" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FDFBF9" />
    </linearGradient>
    <filter id="shadow" x="-4%" y="-4%" width="108%" height="108%">
      <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#4A3728" flood-opacity="0.07" />
    </filter>
  </defs>

  <rect width="1600" height="1100" fill="url(#bgGrad)" />

  <g filter="url(#shadow)">
    <rect x="60" y="50" width="1480" height="1000" rx="30" fill="url(#cardGrad)" stroke="#E8DDD3" stroke-width="2" />
  </g>

  <rect x="110" y="90" width="230" height="34" rx="17" fill="#F6ECE4" />
  <text x="225" y="112" text-anchor="middle" class="tag">KNITTY PETIT JOURNAL</text>

  <text x="110" y="172" class="title" font-size="38">${topic.infographicTitle}</text>
  <text x="110" y="206" class="subtitle" font-size="18">Expert guidance and heirloom craft standards from the Knitty Petit artisan studio.</text>

  <!-- Pillar 1 -->
  <g filter="url(#shadow)">
    <rect x="110" y="260" width="435" height="660" rx="24" fill="#FFFFFF" stroke="#EFE4DA" stroke-width="1.5" />
    <circle cx="160" cy="315" r="22" fill="#8B4A34" />
    <text x="160" y="322" text-anchor="middle" class="step-num">01</text>
    <text x="200" y="324" class="card-title">${topic.card1Title}</text>
    <text x="145" y="380" class="card-desc">${topic.card1Desc}</text>
  </g>

  <!-- Pillar 2 -->
  <g filter="url(#shadow)">
    <rect x="580" y="260" width="435" height="660" rx="24" fill="#FFFFFF" stroke="#EFE4DA" stroke-width="1.5" />
    <circle cx="630" cy="315" r="22" fill="#8B4A34" />
    <text x="630" y="322" text-anchor="middle" class="step-num">02</text>
    <text x="670" y="324" class="card-title">${topic.card2Title}</text>
    <text x="615" y="380" class="card-desc">${topic.card2Desc}</text>
  </g>

  <!-- Pillar 3 -->
  <g filter="url(#shadow)">
    <rect x="1050" y="260" width="435" height="660" rx="24" fill="#FFFFFF" stroke="#EFE4DA" stroke-width="1.5" />
    <circle cx="1100" cy="315" r="22" fill="#8B4A34" />
    <text x="1100" y="322" text-anchor="middle" class="step-num">03</text>
    <text x="1140" y="324" class="card-title">${topic.card3Title}</text>
    <text x="1085" y="380" class="card-desc">${topic.card3Desc}</text>
  </g>

  <rect x="110" y="960" width="1380" height="60" rx="14" fill="#FDF3EC" stroke="#ECD8CC" stroke-width="1" />
  <text x="800" y="996" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14.5" fill="#8B4A34" font-weight="600">
    ★ KNITTY PETIT HEIRLOOM PROMISE: 100% Breathable Combed Cotton • Handcrafted With Love For Every Milestone
  </text>
</svg>
`;
}

async function runPipeline() {
  console.log('🚀 Starting Autonomous Daily Blog Pipeline for Knitty Petit...');
  
  // Step 1: Detect existing posts
  const existingSlugs = await getExistingSlugs();
  console.log('Found existing slugs in Sanity:', Array.from(existingSlugs));

  // Step 2: Pick next unwritten topic
  const nextTopic = TOPIC_CANDIDATES.find(t => !existingSlugs.has(t.slug));
  if (!nextTopic) {
    console.log('All candidate topics have been published! Please add new seed candidates to TOPIC_CANDIDATES.');
    return;
  }
  console.log(`\nSelected New High-Intent Topic: "${nextTopic.title}" (slug: ${nextTopic.slug})`);

  // Step 3: Generate Infographic Image
  const svgContent = await generateSvgInfographic(nextTopic);
  const infographicPngBuffer = await sharp(Buffer.from(svgContent)).png({ quality: 95 }).toBuffer();
  
  // Save locally in public
  const publicDir = path.join(__dirname, '../public');
  const localInfographicPath = path.join(publicDir, `${nextTopic.slug}-infographic.png`);
  fs.writeFileSync(localInfographicPath, infographicPngBuffer);
  console.log('Saved local infographic at:', localInfographicPath);

  // Step 4: Upload Infographic and Hero to Sanity
  const infographicAssetId = await uploadAsset(infographicPngBuffer, `${nextTopic.slug}-infographic.png`, 'image/png');
  console.log('Uploaded Infographic to Sanity:', infographicAssetId);

  // Use high-res project hero asset
  const heroAssetId = 'image-562df182957668a94c02253315570f67089cdb6d-3000x2250-jpg';

  // Step 5: Build PortableText payload
  const body = [
    p([
      { text: "The short answer: ", marks: ["strong"] },
      { text: nextTopic.excerpt, marks: [] },
      { text: " Unlike fast-fashion synthetics, 100% cotton hand-embroidered knitwear provides breathable, irritation-free comfort and heirloom longevity that lasts for generations." }
    ]),

    p([
      "Welcoming childhood milestones—from the early newborn days to first birthday celebrations—is filled with joyful memories. In an era dominated by disposable, synthetic baby clothes, thoughtful parents are turning back to slow-made, handcrafted knitwear."
    ]),

    quote(nextTopic.quoteText),

    h2(nextTopic.infographicTitle),
    p([
      "Our artisan studio has distilled the key considerations every parent should know when selecting custom knitwear for their little one:"
    ]),

    inlineImage(
      infographicAssetId,
      nextTopic.infographicTitle,
      `Official Knitty Petit Guide: ${nextTopic.title}`
    ),

    h2("Why Slow Craftsmanship Outlasts Fast Fashion"),
    p([
      "Every stitch on a Knitty Petit sweater is placed by hand using soft, durable embroidery yarn. The raised cursive letters do not peel, fade, or crack in the wash, creating a tactile heirloom piece that will be passed down to future siblings or preserved in your nursery memory trunk."
    ]),

    h2("Frequently Asked Questions"),
    ...nextTopic.faq.flatMap(f => [
      h3(f.q),
      p([f.a])
    ]),

    h2("Custom Handcrafted Sweaters Made Just for Your Little One"),
    p([
      "Ready to design a one-of-a-kind keepsake? Choose from our curated palette of rich, earthy cotton knits and let our master artisans handcraft your baby's name."
    ]),
    p([
      "Explore the bestselling ",
      { text: "Hand Embroidered Kids Name Sweaters", marks: ["link_prod", "strong"] },
      " to design your custom heirloom today."
    ], [
      { _key: "link_prod", _type: "link", href: "/products/hand-embroidered-kids-name-sweaters", blank: false }
    ])
  ];

  const doc = {
    _id: nextTopic.slug,
    _type: 'post',
    title: nextTopic.title,
    slug: {
      _type: 'slug',
      current: nextTopic.slug
    },
    author: {
      _type: 'reference',
      _ref: 'author-tom-morgen'
    },
    publishedAt: new Date().toISOString(),
    categories: nextTopic.categories,
    excerpt: nextTopic.excerpt,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: heroAssetId
      },
      alt: nextTopic.heroAlt
    },
    body
  };

  // Step 6: Mutate Sanity
  console.log('Publishing document to Sanity Content Lake...');
  const mutateRes = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}?returnDocuments=true`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: doc }]
    })
  });

  const mutateData = await mutateRes.json();
  console.log('✅ Sanity Publish Result:', mutateRes.status, mutateData.results?.[0]?.document?._id);
  console.log('🎉 Post successfully published! Title:', doc.title);
}

runPipeline().catch(console.error);
