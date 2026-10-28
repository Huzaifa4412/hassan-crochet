const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  });
}

const TOKEN = process.env.SANITY_API_TOKEN;
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6m1z3oqp';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-23';

if (!TOKEN) {
  console.error('ERROR: SANITY_API_TOKEN is missing from .env.local');
  process.exit(1);
}

let keyCounter = 1;
function genKey() {
  return 'emb_' + (keyCounter++).toString(36) + '_' + Math.random().toString(36).substring(2, 7);
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

// 2. Upload asset helper
async function uploadAsset(buffer, filename, mimeType) {
  console.log(`Uploading ${filename} to Sanity Content Lake (${DATASET})...`);
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

// 3. Generate high-res 1600x1100 Infographic SVG
function buildInfographicSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" width="1600" height="1100">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap');
      .title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; fill: #2C2420; }
      .subtitle { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; fill: #7A6F68; }
      .tag { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 2px; fill: #9E5A44; text-transform: uppercase; }
      .card-title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 23px; fill: #2C2420; }
      .card-verdict { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 12.5px; letter-spacing: 1.5px; text-transform: uppercase; }
      .card-label { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 13.5px; fill: #382B24; }
      .card-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; fill: #5C5049; line-height: 1.45; }
      .num-badge { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 14px; fill: #FFFFFF; }
      .bar-title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 18px; fill: #2C2420; }
      .bar-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; fill: #5C5049; }
    </style>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FAF6F0" />
      <stop offset="100%" stop-color="#F2E9DE" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FDFBF9" />
    </linearGradient>
    <filter id="shadow" x="-3%" y="-3%" width="106%" height="106%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#4A3728" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1600" height="1100" fill="url(#bgGrad)" />

  <!-- Outer Container Card -->
  <g filter="url(#shadow)">
    <rect x="50" y="45" width="1500" height="1010" rx="28" fill="url(#cardGrad)" stroke="#E8DDD3" stroke-width="2" />
  </g>

  <!-- Top Category Tag -->
  <rect x="100" y="78" width="370" height="34" rx="17" fill="#F6ECE4" />
  <text x="285" y="100" text-anchor="middle" class="tag">KNITTY PETIT • EMBROIDERY ARCHITECTURE</text>

  <!-- Header Title & Subtitle -->
  <text x="100" y="155" class="title" font-size="36">Baby Name Sweater Embroidery: Stitches, Fonts &amp; Comfort Guide</text>
  <text x="100" y="190" class="subtitle" font-size="16.5">Comparing tactile 3D chain stitch, flat duplicate stitch, and machine embroidery for infant knitwear safety and longevity.</text>

  <!-- 3 Side-by-Side Comparison Columns -->

  <!-- COLUMN 1: Hand Chain Stitch (The Heirloom Gold Standard) -->
  <g filter="url(#shadow)">
    <rect x="100" y="228" width="440" height="630" rx="22" fill="#FFFFFF" stroke="#2E7D32" stroke-width="2.5" />
    
    <!-- Top Recommendation Banner -->
    <rect x="100" y="228" width="440" height="48" rx="20" fill="#E8F5E9" />
    <circle cx="135" cy="252" r="13" fill="#2E7D32" />
    <text x="135" y="257" text-anchor="middle" class="num-badge">✓</text>
    <text x="160" y="257" class="card-verdict" fill="#2E7D32">GOLD STANDARD • TACTILE HEIRLOOM</text>

    <!-- Header -->
    <text x="130" y="315" class="card-title">Hand Chain Stitch</text>
    <text x="130" y="337" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" fill="#5C5049">Loop-by-loop chunky yarn embroidery</text>

    <line x1="130" y1="355" x2="510" y2="355" stroke="#EFE4DA" stroke-width="1.5" />

    <!-- Metric 1: Visual Profile -->
    <text x="130" y="380" class="card-label">Visual Profile &amp; Texture</text>
    <text x="130" y="400" class="card-val">Elevated 3D rope-like loop texture (3–4mm profile).</text>
    <text x="130" y="418" class="card-val">Stands out sharply in milestone photography.</text>

    <!-- Metric 2: Knit Elasticity -->
    <text x="130" y="455" class="card-label">Knit Elasticity &amp; Drape</text>
    <text x="130" y="475" class="card-val">Flexible interlocking loops expand and contract</text>
    <text x="130" y="493" class="card-val">naturally with sweater stretch. Zero bunching.</text>

    <!-- Metric 3: Font Versatility -->
    <text x="130" y="530" class="card-label">Font &amp; Script Compatibility</text>
    <text x="130" y="550" class="card-val">Best for organic cursive, fluid script, and soft loops.</text>
    <text x="130" y="568" class="card-val">Flawless on names with 3 to 7 letters.</text>

    <!-- Metric 4: Infant Skin Comfort -->
    <text x="130" y="605" class="card-label">Interior Skin Comfort (Inside-Out)</text>
    <text x="130" y="625" class="card-val">Starting/ending knots are buried inside knit fibers.</text>
    <text x="130" y="643" class="card-val">Zero hard plastic nodules or scratchy mesh.</text>

    <!-- Metric 5: Wash Durability -->
    <text x="130" y="680" class="card-label">Wash Durability &amp; Longevity</text>
    <text x="130" y="700" class="card-val">Retains plush loft through gentle hand washes.</text>
    <text x="130" y="718" class="card-val">Becomes softer with every wear cycle.</text>

    <!-- Overall Rating Badge -->
    <rect x="130" y="755" width="380" height="42" rx="10" fill="#F1F8F1" stroke="#C8E6C9" stroke-width="1.5" />
    <text x="320" y="781" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13.5" fill="#2E7D32">★ 10/10 • PREFERRED BY NURSERY ARTISANS</text>
  </g>

  <!-- COLUMN 2: Duplicate Stitch (Swiss Darning) -->
  <g filter="url(#shadow)">
    <rect x="580" y="228" width="440" height="630" rx="22" fill="#FFFFFF" stroke="#1E3A8A" stroke-width="1.5" />
    
    <!-- Top Recommendation Banner -->
    <rect x="580" y="228" width="440" height="48" rx="20" fill="#EFF6FF" />
    <circle cx="615" cy="252" r="13" fill="#1E3A8A" />
    <text x="615" y="257" text-anchor="middle" class="num-badge">II</text>
    <text x="640" y="257" class="card-verdict" fill="#1E3A8A">VINTAGE ACCURACY • BEST FOR INITIALS</text>

    <!-- Header -->
    <text x="610" y="315" class="card-title">Duplicate Stitch</text>
    <text x="610" y="337" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" fill="#5C5049">Over-stitching existing 'V' knit stitches</text>

    <line x1="610" y1="355" x2="990" y2="355" stroke="#EFE4DA" stroke-width="1.5" />

    <!-- Metric 1: Visual Profile -->
    <text x="610" y="380" class="card-label">Visual Profile &amp; Texture</text>
    <text x="610" y="400" class="card-val">Completely flush with knit surface; looks woven</text>
    <text x="610" y="418" class="card-val">into sweater structure. Pixelated vintage grid look.</text>

    <!-- Metric 2: Knit Elasticity -->
    <text x="610" y="455" class="card-label">Knit Elasticity &amp; Drape</text>
    <text x="610" y="475" class="card-val">Matches the native sweater stretch 100%.</text>
    <text x="610" y="493" class="card-val">Does not alter garment drape or chest flexibility.</text>

    <!-- Metric 3: Font Versatility -->
    <text x="610" y="530" class="card-label">Font &amp; Script Compatibility</text>
    <text x="610" y="550" class="card-val">Ideal for block letters, varsity monograms, and icons.</text>
    <text x="610" y="568" class="card-val">Cannot create smooth organic cursive diagonals.</text>

    <!-- Metric 4: Infant Skin Comfort -->
    <text x="610" y="605" class="card-label">Interior Skin Comfort (Inside-Out)</text>
    <text x="610" y="625" class="card-val">Horizontal yarn floats across reverse. Very soft</text>
    <text x="610" y="643" class="card-val">and skin-safe, but long floats can snag baby fingers.</text>

    <!-- Metric 5: Wash Durability -->
    <text x="610" y="680" class="card-label">Wash Durability &amp; Longevity</text>
    <text x="610" y="700" class="card-val">High durability; integrates directly into stitches.</text>
    <text x="610" y="718" class="card-val">Cannot unravel without damaging sweater core.</text>

    <!-- Overall Rating Badge -->
    <rect x="610" y="755" width="380" height="42" rx="10" fill="#F0F7FF" stroke="#BFDBFE" stroke-width="1.5" />
    <text x="800" y="781" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13.5" fill="#1E3A8A">★ 8.5/10 • EXCELLENT FOR MONOGRAMS</text>
  </g>

  <!-- COLUMN 3: Machine Satin Stitch -->
  <g filter="url(#shadow)">
    <rect x="1060" y="228" width="440" height="630" rx="22" fill="#FFFFFF" stroke="#C62828" stroke-width="1.5" />
    
    <!-- Top Recommendation Banner -->
    <rect x="1060" y="228" width="440" height="48" rx="20" fill="#FFEBEE" />
    <circle cx="1095" cy="252" r="13" fill="#C62828" />
    <text x="1095" y="257" text-anchor="middle" class="num-badge">!</text>
    <text x="1120" y="257" class="card-verdict" fill="#C62828">COMMERCIAL FAST-FASHION • HIGH PUCKER RISK</text>

    <!-- Header -->
    <text x="1090" y="315" class="card-title">Machine Satin Stitch</text>
    <text x="1090" y="337" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" fill="#5C5049">High-speed computerized embroidery needle</text>

    <line x1="1090" y1="355" x2="1470" y2="355" stroke="#EFE4DA" stroke-width="1.5" />

    <!-- Metric 1: Visual Profile -->
    <text x="1090" y="380" class="card-label">Visual Profile &amp; Texture</text>
    <text x="1090" y="400" class="card-val">Flat, shiny polyester sheen. Lacks the artisanal, chunky</text>
    <text x="1090" y="418" class="card-val">organic aesthetic parents want in keepsake photos.</text>

    <!-- Metric 2: Knit Elasticity -->
    <text x="1090" y="455" class="card-label">Knit Elasticity &amp; Drape</text>
    <text x="1090" y="475" class="card-val">Extremely rigid. Does not stretch with sweater,</text>
    <text x="1090" y="493" class="card-val">causing severe puckering around chest stitches.</text>

    <!-- Metric 3: Font Versatility -->
    <text x="1090" y="530" class="card-label">Font &amp; Script Compatibility</text>
    <text x="1090" y="550" class="card-val">High precision for crisp digital typefaces.</text>
    <text x="1090" y="568" class="card-val">Often looks sterile and mass-manufactured.</text>

    <!-- Metric 4: Infant Skin Comfort -->
    <text x="1090" y="605" class="card-label">Interior Skin Comfort (Inside-Out)</text>
    <text x="1090" y="625" class="card-val">Requires stiff synthetic stabilizer mesh underneath.</text>
    <text x="1090" y="643" class="card-val">Sharp backing edges prickle sensitive baby chest.</text>

    <!-- Metric 5: Wash Durability -->
    <text x="1090" y="680" class="card-label">Wash Durability &amp; Longevity</text>
    <text x="1090" y="700" class="card-val">Thread survives wash, but fabric puckers permanently</text>
    <text x="1090" y="718" class="card-val">as cotton yarn shrinks at a different rate than polyester.</text>

    <!-- Overall Rating Badge -->
    <rect x="1090" y="755" width="380" height="42" rx="10" fill="#FFF5F5" stroke="#FFCDD2" stroke-width="1.5" />
    <text x="1280" y="781" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13.5" fill="#C62828">⚠ 4/10 • AVOID FOR ECZEMA &amp; CHUNKY KNITS</text>
  </g>

  <!-- Bottom Takeaways Bar -->
  <g filter="url(#shadow)">
    <rect x="100" y="885" width="1400" height="135" rx="18" fill="#FFFFFF" stroke="#E2D6CB" stroke-width="1.5" />
  </g>

  <!-- 4 Mini Columns in Bottom Bar -->
  <!-- 1: Letter Count -->
  <text x="130" y="925" class="bar-title">Letter Count Rule</text>
  <text x="130" y="950" class="bar-text">3–5 letters: Bold center script</text>
  <text x="130" y="972" class="bar-text">6–8 letters: Gentle arch placement</text>
  <text x="130" y="994" class="bar-text">9+ letters: Petite monoline script</text>

  <line x1="450" y1="905" x2="450" y2="1000" stroke="#EFE4DA" stroke-width="1.5" />

  <!-- 2: Color Contrast -->
  <text x="480" y="925" class="bar-title">Color Contrast</text>
  <text x="480" y="950" class="bar-text">High-contrast yarn (e.g. Oatmeal</text>
  <text x="480" y="972" class="bar-text">+ Terracotta, Sage + Cream) pops</text>
  <text x="480" y="994" class="bar-text">100% sharper in photos.</text>

  <line x1="810" y1="905" x2="810" y2="1000" stroke="#EFE4DA" stroke-width="1.5" />

  <!-- 3: Skin Protection -->
  <text x="840" y="925" class="bar-title">Sensitive Skin Backing</text>
  <text x="840" y="950" class="bar-text">Verify buried yarn knots and soft</text>
  <text x="840" y="972" class="bar-text">fusible cloud cover (Tender Touch)</text>
  <text x="840" y="994" class="bar-text">for zero scratchiness on infant skin.</text>

  <line x1="1170" y1="905" x2="1170" y2="1000" stroke="#EFE4DA" stroke-width="1.5" />

  <!-- 4: Knitty Petit Standard -->
  <text x="1200" y="925" class="bar-title">Artisan Assurance</text>
  <text x="1200" y="950" class="bar-text">100% Combed milk-cotton yarn,</text>
  <text x="1200" y="972" class="bar-text">hand-embroidered by master crafters</text>
  <text x="1200" y="994" class="bar-text">for heirloom nursery keepsakes.</text>

</svg>
  `;
}

async function main() {
  console.log('🚀 Starting Autonomous Blog Publishing Engine for Knitty Petit...');

  // Step 1: Generate Infographic SVG & Convert to PNG
  console.log('Generating 1600x1100 Infographic SVG...');
  const svgString = buildInfographicSvg();
  const infographicPngBuffer = await sharp(Buffer.from(svgString))
    .png({ quality: 95 })
    .toBuffer();

  const publicInfographicPath = path.join(__dirname, '..', 'public', 'baby-name-sweater-embroidery-fonts-stitches-guide-infographic.png');
  fs.writeFileSync(publicInfographicPath, infographicPngBuffer);
  console.log(`Saved infographic locally to ${publicInfographicPath}`);

  // Step 2: Upload Infographic PNG to Sanity
  const infographicAssetId = await uploadAsset(
    infographicPngBuffer,
    'baby-name-sweater-embroidery-fonts-stitches-guide-infographic.png',
    'image/png'
  );
  console.log(`Infographic uploaded to Sanity! Asset ID: ${infographicAssetId}`);

  // Step 3: Check & Upload Hero Image
  const heroPath = path.join(__dirname, '..', 'public', 'baby-name-sweater-embroidery-guide-hero.jpg');
  let heroAssetId;
  if (fs.existsSync(heroPath)) {
    console.log('Reading editorial hero image from public folder...');
    const heroBuffer = fs.readFileSync(heroPath);
    heroAssetId = await uploadAsset(
      heroBuffer,
      'baby-name-sweater-embroidery-guide-hero.jpg',
      'image/jpeg'
    );
    console.log(`Editorial hero uploaded to Sanity! Asset ID: ${heroAssetId}`);
  } else {
    console.log('Hero image not found locally, using established high-res Sanity asset...');
    heroAssetId = 'image-5acf43a9e6e3edb22e6305590b0525adcd7bbc33-1920x1920-heif';
  }

  // Pre-existing curated authentic assets for body images
  const processAssetId = 'image-463bdfd8b1a0501845713ecb8a912668ca7d251d-1024x1024-jpg'; // Handcrafting process
  const productAssetId = 'image-5acf43a9e6e3edb22e6305590b0525adcd7bbc33-1920x1920-heif'; // Product packshot
  const oatmealAssetId = 'image-3f6b6a98d126701ae32f61bef91690e91537487c-800x800-heif'; // Oatmeal swatch
  const inSituAssetId = 'image-82e29ee1e954f0bbf163a0bb968433a9c62c070d-990x990-webp'; // Nursery in-situ

  // Step 4: Assemble Comprehensive Editorial Body (Portable Text)
  console.log('Constructing high E-E-A-T PortableText content payload...');

  const body = [
    // Direct Answer Lead (Position 0 / AI Overview ready)
    p([
      {
        text: "The ideal embroidery style for a baby name sweater is a hand-stitched chain stitch using thick, combed milk-cotton yarn in a relaxed cursive script. Unlike stiff machine embroidery or flat duplicate stitching, hand chain loops create an elevated 3D texture that naturally flexes with the knit fabric, while soft interior knot-burying ensures zero scratchiness against delicate newborn chest skin.",
        marks: ["strong"]
      }
    ]),

    p([
      "Few nursery keepsakes capture the tender wonder of infancy quite like a personalized, hand-embroidered baby name sweater. Whether chosen for a hospital coming-home announcement, baby's first holiday portrait, or a thoughtful baby shower gift, the way a baby's name is stitched onto knitwear defines everything: its visual charm, tactile comfort, and heirloom longevity."
    ]),

    p([
      "Yet for new parents and gift-givers exploring customization options, the terminology can feel overwhelming. What is the difference between a chain stitch and duplicate stitch? Why do some personalized sweaters pucker and bunch after a single wash? How do you prevent interior embroidery threads from scratching an infant's sensitive, eczema-prone chest? And which font style reads cleanly when a child's name has eight letters instead of four?"
    ]),

    p([
      "In this definitive artisan guide from the ",
      { text: "Knitty Petit", marks: ["link_knitty"] },
      " studio, we break down the science of knitwear embroidery, font anatomy, color contrast pairings, and sensitive-skin protection protocols so you can design or choose a personalized baby sweater that stays breathtaking for generations."
    ], [
      { _key: "link_knitty", _type: "link", href: "/products/hand-embroidered-kids-name-sweaters", blank: false }
    ]),

    // Section 1: The Anatomy of Knitwear Embroidery
    h2("The Physics of Knitwear: Why Embroidery Technique Dictates Longevity"),

    p([
      "To understand why embroidery styles vary so drastically on baby sweaters, one must first appreciate the physical difference between woven fabrics (such as denim jackets, cotton onesies, or linen swaddles) and hand-knitted or crochet garments. Woven textiles possess a rigid, perpendicular grid structure with minimal multi-directional stretch. In contrast, knitted garments are composed of interlocking loops that expand, stretch, and breathe dynamically with infant movement."
    ]),

    p([
      "When standard embroidery methods—such as high-density machine satin stitching—are applied to a pliable knit sweater, the contrast in tension is catastrophic. Industrial embroidery machines pull fine polyester threads at high speeds, anchoring them with stiff backing paper. The moment the sweater is washed or pulled over baby's head, the cotton knit stretches while the rigid embroidered block refuses to budge. The result is unsightly puckering, puckered ripples around the collar, and warped letters."
    ]),

    quote("“Knitted fabric is alive—it stretches, relaxes, and contours to baby's body. True artisanal sweater embroidery works in harmony with the knit rather than fighting against it.”"),

    p([
      "Artisanal hand-embroidery solves this challenge by employing flexible yarn techniques. By working needle and yarn loop-by-loop through the knit without rigid mechanical clamping, each letter gains the natural elasticity required to stretch with the garment and snap back into place flawlessly."
    ]),

    // Inline Image: Handcrafted Process
    inlineImage(
      processAssetId,
      "Artisan hands carefully working a thick loop chain stitch into an oatmeal cotton baby sweater",
      "Handcrafting each letter loop-by-loop ensures natural flexibility and prevents knit fabric distortion."
    ),

    // Section 2: Comparing Stitches
    h2("The 4 Core Embroidery Stitches Compared: Chain Stitch vs. Duplicate vs. Machine"),

    p([
      "When browsing bespoke baby knitwear on ",
      { text: "our Etsy shop", marks: ["link_etsy"] },
      " or specialty boutiques, you will encounter four primary stitching techniques. Understanding their unique characteristics helps you select the exact aesthetic and durability your nursery requires."
    ], [
      { _key: "link_etsy", _type: "link", href: "https://www.etsy.com/listing/4489116946/custom-baby-name-sweater-personalized", blank: true }
    ]),

    h3("1. Hand Chain Stitch (The Modern Heirloom Standard)"),
    p([
      "Chain stitch is the undisputed crown jewel of modern baby name sweaters. Worked entirely by hand using a blunt tapestry needle and chunky 5-ply milk-cotton or combed cotton yarn, each stitch forms an interconnected teardrop loop that nests into the next. This creates a rounded, continuous rope of yarn that sits 3 to 4 millimeters above the surface of the sweater."
    ]),
    bullet([
      { text: "Pros: ", marks: ["strong"] },
      "Magnificent 3D tactile texture that photographs with stunning clarity; extraordinary flexibility that stretches naturally with ribbed knits; zero stiff paper backings required."
    ]),
    bullet([
      { text: "Cons: ", marks: ["strong"] },
      "Labor-intensive and requires master artisan tension control to ensure uniform letter height and curvature."
    ]),
    bullet([
      { text: "Best For: ", marks: ["strong"] },
      "Flowing cursive script, baby name announcements, milestone portraits, and tactile sensory enjoyment."
    ]),

    h3("2. Duplicate Stitch (Swiss Darning)"),
    p([
      "Duplicate stitch—often called Swiss darning—is a traditional technique where an artisan traces the existing 'V'-shaped stitches of a stockinette knit using a tapestry needle and yarn of equal gauge. Instead of sitting on top of the fabric like chain stitch, duplicate stitch directly reinforces and mirrors the sweater's underlying structure."
    ]),
    bullet([
      { text: "Pros: ", marks: ["strong"] },
      "Completely flush with the garment; 100% identical stretch to the sweater; authentic vintage varsity appearance."
    ]),
    bullet([
      { text: "Cons: ", marks: ["strong"] },
      "Cannot create smooth organic curves or cursive handwriting; constrained to a pixelated grid."
    ]),
    bullet([
      { text: "Best For: ", marks: ["strong"] },
      "Single-letter monograms, collegiate block initials, and geometric nursery motifs (such as hearts, pine trees, or stars)."
    ]),

    h3("3. Machine Satin Stitch (Commercial Fast Fashion)"),
    p([
      "Common on mass-manufactured department store knitwear, machine satin stitch uses thousands of micro-fine polyester or rayon threads tightly packed over an industrial tear-away stabilizer backing."
    ]),
    bullet([
      { text: "Pros: ", marks: ["strong"] },
      "Rapid turnaround and razor-sharp digital font reproduction."
    ]),
    bullet([
      { text: "Cons: ", marks: ["strong"] },
      "Creates a heavy, stiff shield across baby's chest; prone to severe puckering after washing; leaves scratchy synthetic stabilizer edges that irritate sensitive infant skin."
    ]),
    bullet([
      { text: "Best For: ", marks: ["strong"] },
      "Heavyweight woven canvas bags or stiff fleece jackets—rarely recommended for delicate heirloom knitwear."
    ]),

    h3("4. Stem & Backstitch (Minimalist Fine Monoline)"),
    p([
      "Stem stitch and split backstitch use thinner yarn or 6-strand embroidery floss to create a delicate, continuous single-line stroke. While it lacks the bold, chunky loft of chain stitch, it offers whisper-soft subtlety for smaller details."
    ]),
    bullet([
      { text: "Best For: ", marks: ["strong"] },
      "Subtle birth years (e.g., 'est. 2026'), delicate floral stems, or secondary middle names placed discretely on the sweater cuff."
    ]),

    // Visual Infographic Placement
    inlineImage(
      infographicAssetId,
      "Detailed comparison matrix of baby name sweater embroidery stitches, font sizing, and sensitive skin backing",
      "Infographic: Evaluating hand chain stitch, duplicate stitch, and machine embroidery across elasticity, aesthetics, and skin safety."
    ),

    // Section 3: Font Selection Guide
    h2("The Font & Script Selection Guide: Readability Meets Aesthetic"),

    p([
      "Selecting the right lettering style is equal parts art and engineering. What looks charming on a two-dimensional computer mockup can translate very differently when translated into chunky, dimensional yarn loops. Here are the three primary font archetypes and the golden rules of letter spacing."
    ]),

    h3("Style A: Fluid Artisanal Cursive (The Registry Favorite)"),
    p([
      "Relaxed, modern cursive script is the definitive look of the contemporary baby name sweater. The connected strokes allow the yarn chain to flow seamlessly from letter to letter without awkward thread jumps, creating a warm, personalized signature aesthetic."
    ]),
    p([
      { text: "Optimal Letter Count: ", marks: ["strong"] },
      "3 to 6 letters (e.g., ",
      { text: "Liam, Mia, Noah, Oliver, Emma, Jack", marks: ["em"] },
      "). Shorter names allow the artisan to maximize yarn loft and stitch height (typically 2.5 to 3.5 inches tall), centering the name boldly across the chest."
    ]),

    h3("Style B: Vintage Block & Collegiate Serif"),
    p([
      "Featuring clean vertical strokes and understated crossbars, block lettering offers a nostalgic, collegiate charm reminiscent of classic varsity knitwear. Because each letter stands independently, spacing (kerning) must be calculated with precision to avoid awkward gaps."
    ]),
    p([
      { text: "Optimal Letter Count: ", marks: ["strong"] },
      "1 to 4 letters, or capitalized initials (e.g., ",
      { text: "LEO, THEO, OTIS, B", marks: ["em"] },
      "). Block lettering creates an energetic, graphic focal point that looks exceptionally handsome on baby boys and toddlers."
    ]),

    h3("Style C: Petite Condensed Monoline (The Long-Name Solution)"),
    p([
      "What if your little one has a majestic longer name like ",
      { text: "Charlotte, Alexander, Genevieve, or Sebastian", marks: ["em"] },
      "? If stitched in an oversized, wide cursive font, an 8- or 9-letter name would spill awkwardly into the armpits, causing the letters to fold out of sight when baby lies on their back."
    ]),
    p([
      "For names with 7 or more letters, master artisans utilize a ",
      { text: "gently condensed cursive script", marks: ["strong"] },
      " or a graceful arched trajectory. By curving the name upward across the chest line in a subtle smile arc, every letter remains centered, readable, and beautifully proportioned within the camera frame."
    ]),

    // Product Packshot
    inlineImage(
      productAssetId,
      "Knitty Petit personalized baby name sweater showing crisp centered hand-embroidered cursive lettering",
      "Balanced letter kerning and centered chest placement ensure complete readability in newborn photos."
    ),

    // Section 4: Color Theory & Swatch Contrast Matrix
    h2("The Color Theory of Name Sweaters: High Contrast vs. Tone-on-Tone"),

    p([
      "One of the most frequent regrets parents express when ordering custom knitwear elsewhere is poor legibility: ",
      { text: "“The colors looked pretty together in my head, but in photos, you can barely read my baby's name.”", marks: ["em"] }
    ]),

    p([
      "Knitted fabric is inherently three-dimensional, featuring ribbed valleys, yarn texture, and natural shadows. If the embroidery thread value is too close to the sweater color (such as soft cream embroidery on a white sweater, or light tan on oatmeal), natural room lighting and smartphone camera sensors flatten the contrast, making the name disappear into the background."
    ]),

    p([
      "At Knitty Petit, we follow the ",
      { text: "High-Contrast Harmonious Palette Principle", marks: ["strong"] },
      "—pairing warm, nature-inspired tones with strong visual separation. Here are our time-tested studio pairings across our 16 knitwear colorways:"
    ]),

    bullet([
      { text: "Oatmeal Sweater: ", marks: ["strong"] },
      "Pair with Rich Terracotta, Cinnamon, or Deep Chestnut. This is our #1 bestseller worldwide—a warm, bohemian contrast that looks breathtaking against neutral nursery decor."
    ]),
    bullet([
      { text: "Sage Green Sweater: ", marks: ["strong"] },
      "Pair with Warm Vanilla, Buttercream, or Forest Pine. Creates an earthy, botanical aesthetic inspired by European woodland nurseries."
    ]),
    bullet([
      { text: "Dusty Rose Sweater: ", marks: ["strong"] },
      "Pair with Champagne, Soft Taupe, or Crisp Cloud White. Offers a romantic, vintage French heirloom charm for baby girls."
    ]),
    bullet([
      { text: "Navy Blue Sweater: ", marks: ["strong"] },
      "Pair with Bright White, Oatmeal Sand, or Soft Sky Blue. Classic, crisp, and nautical—exceptional for fall and winter family portraits."
    ]),
    bullet([
      { text: "Camel / Khaki Sweater: ", marks: ["strong"] },
      "Pair with Marshmallow Cream or Soft Charcoal. A sophisticated, gender-neutral luxury pairing that pairs effortlessly with denim or linen bloomers."
    ]),

    // Inline Image: Neutral Swatch Palette
    inlineImage(
      oatmealAssetId,
      "Knitty Petit Oatmeal and neutral sweater color swatch highlighting subtle heathered yarn fibers",
      "Heathered neutral knits provide the perfect canvas for rich earthy embroidery threads."
    ),

    // Section 5: The Inside-Out Comfort Test
    h2("The “Inside-Out” Comfort Test: Protecting Sensitive Newborn Skin"),

    p([
      "While an embroidered baby sweater may look divine from the outside, the true measure of pediatric quality lies on the ",
      { text: "inside", marks: ["strong"] },
      ". Infant skin is up to 30% thinner than adult skin and lacks a fully developed acid mantle. Hard knots, rough thread tails, and stiff backing papers rubbing directly against a newborn's chest can quickly cause red friction marks, contact dermatitis, or eczema flare-ups."
    ]),

    p([
      "To ensure uncompromised infant comfort, every heirloom sweater should pass the ",
      { text: "Three-Point Artisan Comfort Protocol", marks: ["strong"] },
      ":"
    ]),

    h3("1. The Zero-Tearaway Policy"),
    p([
      "Commercial embroidery frequently utilizes stiff polyester or paper tear-away stabilizers to keep stitches straight. Even after washing, fibrous remnants remain trapped beneath the stitches, creating prickly edges. Knitty Petit artisans use water-soluble tracing stabilizers (such as Sulky Stick-N-Stitch) that dissolve 100% cleanly in cool water, leaving zero synthetic backing behind."
    ]),

    h3("2. Fiber-Buried Knots"),
    p([
      "Rather than tying hard, bulbous knots at the start and finish of each letter, master crafters use a technique known as ",
      { text: "weaving in yarn tails", marks: ["em"] },
      ". The thread ends are threaded invisibly back into the core fibers of the sweater's knit ribbing, ensuring the reverse side feels as soft and pillowy as the front."
    ]),

    h3("3. Soft Fusible Cloud Cover (Optional Sensitive-Skin Seal)"),
    p([
      "For newborns with active infantile eczema or extreme tactile sensitivity, parents can request a protective fusible comfort layer (such as Sulky Tender Touch or Madeira Comfort Wear). This featherlight, ultra-soft knit interlining is heat-sealed over the inside reverse stitches, creating a velvety, seamless cloud between the embroidery and baby's chest."
    ]),

    p([
      "For a deeper scientific dive into hypoallergenic yarn safety and infant skin barriers, explore our clinical guide on ",
      { text: "Cotton vs. Wool for Baby Sweaters: Which Fiber Is Safest for Sensitive Skin & Eczema?", marks: ["link_skin"] },
      "."
    ], [
      { _key: "link_skin", _type: "link", href: "/blog/cotton-vs-wool-baby-clothes-sensitive-skin-guide", blank: false }
    ]),

    // Section 6: DIY vs Buying
    h2("DIY Hand Embroidery vs. Artisan Studio Handcrafting: What Parents Should Know"),

    p([
      "With the explosion of baby name sweaters on social media, many creative parents and grandparents wonder: ",
      { text: "“Can I DIY this myself on a store-bought sweater?”", marks: ["em"] }
    ]),

    p([
      "The answer is yes—with patience, practice, and the right tools! If you wish to try your hand at DIY name embroidery, you will need: a chunky cotton or cotton-blend sweater, water-soluble stick-and-stitch stabilizer paper, a size 18–20 blunt chenille or tapestry needle, and high-quality 5-ply milk-cotton yarn."
    ]),

    p([
      "However, DIY beginners should be mindful of three common technical hurdles:"
    ]),

    bullet([
      { text: "Tension Inconsistency: ", marks: ["strong"] },
      "Pulling loop chains too tightly will cause the sweater chest to pucker into an irreversible cup shape; leaving loops too loose allows infant fingers or pacifier clips to snag the yarn."
    ]),
    bullet([
      { text: "Kerning & Curve Distortion: ", marks: ["strong"] },
      "Stitching on a 3D stretchy knit without a hoop requires exceptional hand coordination. Letters can easily drift diagonally or crowd together."
    ]),
    bullet([
      { text: "Wash Unraveling: ", marks: ["strong"] },
      "If starting and ending anchor knots are not anchored correctly into the sweater's purl bumps, a single washing machine cycle can unravel days of painstaking work."
    ]),

    p([
      "If you prefer guaranteed perfection, ordering from an established artisan studio like ",
      { text: "Knitty Petit", marks: ["link_catalog"] },
      " ensures computer-calibrated kerning, premium colorfast cotton yarn, and seasoned artisan handcrafting backed by hundreds of 5-star reviews."
    ], [
      { _key: "link_catalog", _type: "link", href: "/products/hand-embroidered-kids-name-sweaters", blank: false }
    ]),

    // Section 7: Sizing, Care & Styling Integration
    h2("Curating the Complete Keepsake: Sizing & Milestone Photography"),

    p([
      "To get the maximum joy and longevity from your custom embroidered sweater, keep these practical styling and longevity strategies in mind:"
    ]),

    p([
      { text: "Size for Two Seasons: ", marks: ["strong"] },
      "Babies double their birth weight in five months. When ordering a newborn keepsake, we strongly recommend sizing up to ",
      { text: "0–3 Months or 3–6 Months", marks: ["strong"] },
      " and rolling the cuffs once for the birth announcement. This ensures the sweater fits comfortably for both the fresh-48 hospital photoshoot and monthly milestone portraits all through the first half-year. Read our full breakdown in ",
      { text: "What Size Baby Name Sweater Should You Get? The Complete Sizing, Fit & Gift Guide", marks: ["link_sizing"] },
      "."
    ], [
      { _key: "link_sizing", _type: "link", href: "/blog/what-size-baby-name-sweater-should-you-get", blank: false }
    ]),

    p([
      { text: "Styling Announcement Flat Lays: ", marks: ["strong"] },
      "Pair your personalized name sweater with a ribbed knit beanie, neutral wooden name plaque, and a soft muslin swaddle for a clean Scandinavian nursery aesthetic. Discover our top photo setups in ",
      { text: "Baby Name Announcement Outfits: 7 Aesthetic Ways to Style an Embroidered Name Sweater", marks: ["link_announce"] },
      "."
    ], [
      { _key: "link_announce", _type: "link", href: "/blog/baby-name-announcement-sweater-styling-ideas", blank: false }
    ]),

    p([
      { text: "Gentle Washing Rituals: ", marks: ["strong"] },
      "Never toss hand-embroidered knitwear into a high-heat dryer. Hand wash inside-out in cool water with a mild, dye-free baby detergent, gently press out moisture in a clean cotton towel, and dry flat away from direct sunlight. Follow our complete care instructions in ",
      { text: "How to Wash and Care for a Hand-Embroidered Baby Sweater", marks: ["link_wash"] },
      "."
    ], [
      { _key: "link_wash", _type: "link", href: "/blog/how-to-wash-hand-embroidered-baby-sweater", blank: false }
    ]),

    // In-situ Nursery Asset
    inlineImage(
      inSituAssetId,
      "Baby name sweater placed in a sunlit nursery keepsake memory box with milestones cards",
      "A hand-embroidered sweater transcends seasonal fast fashion, becoming an enduring childhood keepsake."
    ),

    // Section 8: Google People Also Ask (PAA) FAQs
    h2("Frequently Asked Questions About Baby Name Sweater Embroidery"),

    h3("What is the best stitch for embroidering a baby's name on a sweater?"),
    p([
      "Hand chain stitch is universally recognized as the best embroidery stitch for chunky baby sweaters. It creates an elevated 3D rounded line that mimics hand-drawn cursive script, stands out vividly in photographs, and flexes naturally with the elasticity of the knit fabric without puckering."
    ]),

    h3("Will the back of an embroidered sweater scratch my baby's chest?"),
    p([
      "Not when crafted by skilled artisans. At Knitty Petit, our names are stitched without stiff commercial paper backings, and all yarn ends are invisibly woven directly into the sweater fibers. For babies with ultra-sensitive skin or eczema, an optional iron-on soft cloud cover (Sulky Tender Touch) seals all reverse stitches under a silky-soft protective barrier."
    ]),

    h3("Can you embroider a long name (7–9 letters) on a baby sweater?"),
    p([
      "Yes! For longer names (such as Charlotte, Alexander, or Genevieve), artisans use a slightly condensed cursive script or place the name along a gentle upward smile arc. This keeps the lettering centered across the chest without spilling into the armpits or getting lost when baby lies down."
    ]),

    h3("What yarn is safest for baby sweater embroidery?"),
    p([
      "100% Combed milk-cotton or organic cotton yarn is the safest choice. Unlike rough sheep wool (which contains lanolin that can trigger contact dermatitis) or cheap scratchy acrylics, combed cotton is smooth, hypoallergenic, breathable, and lint-free."
    ]),

    h3("How long does it take to hand-embroider a custom baby sweater?"),
    p([
      "Because every letter is calibrated, traced, and individually hand-stitched loop-by-loop, artisan crafting takes between 2 to 4 hours per sweater, depending on name length and custom motifs. We recommend ordering 3 to 4 weeks before your planned photoshoot or baby shower."
    ])
  ];

  // Step 5: Assemble Post Document
  const postDocument = {
    _type: 'post',
    _id: 'baby-name-sweater-embroidery-fonts-stitches-guide',
    title: 'Baby Name Sweater Embroidery Styles: The Complete Guide to Fonts, Stitches, Colors & Sensitive Skin Backing',
    slug: {
      _type: 'slug',
      current: 'baby-name-sweater-embroidery-fonts-stitches-guide'
    },
    publishedAt: new Date().toISOString(),
    author: {
      _type: 'reference',
      _ref: '60162e96-7437-4a07-b476-9d5397f6e7aa' // Huzaifa
    },
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: heroAssetId
      },
      alt: 'Artisanal oatmeal chunky knit baby sweater featuring 3D chain-stitched cursive name embroidery in terracotta yarn with wooden embroidery hoop and organic cotton skeins'
    },
    excerpt: 'Explore the definitive guide to baby name sweater embroidery: hand chain stitch vs. duplicate stitch, cursive vs. block fonts, high-contrast yarn palettes, and scratch-free backing for sensitive newborn skin.',
    categories: ['crochet-tips', 'tutorials', 'care-guides', 'inspiration'],
    seo: {
      metaTitle: 'Baby Name Sweater Embroidery Styles: Fonts, Stitches & Skin Guide',
      metaDescription: 'Designing a custom baby name sweater? Learn the difference between chain stitch vs duplicate stitch, font legibility rules, and scratch-free backing for sensitive skin.',
      keywords: [
        'baby name sweater embroidery',
        'best font for baby name sweater',
        'chain stitch baby sweater',
        'baby name sweater stitches',
        'embroidered baby name sweater backing',
        'baby sweater embroidery sensitive skin',
        'baby name sweater color combinations',
        'duplicate stitch vs chain stitch sweater'
      ]
    },
    body
  };

  // Step 6: Publish Document to Sanity Content Lake
  console.log('Publishing post to Sanity Content Lake via Mutate API...');
  const mutationPayload = {
    mutations: [
      {
        createOrReplace: postDocument
      }
    ]
  };

  const mutateRes = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mutationPayload)
  });

  const mutateData = await mutateRes.json();
  if (!mutateRes.ok) {
    throw new Error(`Sanity publish failed: ${JSON.stringify(mutateData)}`);
  }

  console.log('🎉 Successfully Published Post to Sanity Content Lake!');
  console.log('Document ID:', postDocument._id);
  console.log('Slug:', postDocument.slug.current);
  console.log('URL: /blog/' + postDocument.slug.current);
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
