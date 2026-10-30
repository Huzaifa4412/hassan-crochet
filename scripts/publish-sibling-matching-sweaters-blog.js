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
  return 'sib_' + (keyCounter++).toString(36) + '_' + Math.random().toString(36).substring(2, 7);
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

// Upload asset to Sanity
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

// 2. Build 1600x1100 Infographic SVG
function buildInfographicSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" width="1600" height="1100">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap');
      .title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; fill: #2C2420; }
      .subtitle { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; fill: #7A6F68; }
      .tag { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 2px; fill: #9E5A44; text-transform: uppercase; }
      .card-title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 22px; fill: #2C2420; }
      .card-verdict { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; }
      .card-label { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 13px; fill: #382B24; }
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
  <rect x="100" y="78" width="390" height="34" rx="17" fill="#F6ECE4" />
  <text x="295" y="100" text-anchor="middle" class="tag">KNITTY PETIT • SIBLING STYLING MATRIX</text>

  <!-- Header Title & Subtitle -->
  <text x="100" y="155" class="title" font-size="36">Coordinating Sibling Sweaters: The Harmony &amp; Sizing Formula</text>
  <text x="100" y="190" class="subtitle" font-size="16.5">Pediatric sizing calculations, complementary earth-tone pairings, and high-contrast embroidery rules for family portraits.</text>

  <!-- 3 Comparison Columns -->

  <!-- COLUMN 1: The Earthy Tonal Pair -->
  <g filter="url(#shadow)">
    <rect x="100" y="228" width="440" height="630" rx="22" fill="#FFFFFF" stroke="#C28D5A" stroke-width="2.5" />
    
    <rect x="100" y="228" width="440" height="48" rx="20" fill="#FBF3EC" />
    <circle cx="135" cy="252" r="13" fill="#C28D5A" />
    <text x="135" y="257" text-anchor="middle" class="num-badge">01</text>
    <text x="160" y="257" class="card-verdict" fill="#8C5824">GOLD STANDARD • WARM EDITORIAL</text>

    <text x="130" y="315" class="card-title">Oatmeal &amp; Warm Camel</text>
    <text x="130" y="337" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" fill="#5C5049">Soft tonal contrast for newborn &amp; toddler</text>

    <line x1="130" y1="355" x2="510" y2="355" stroke="#EFE4DA" stroke-width="1.5" />

    <text x="130" y="380" class="card-label">Color Assignment</text>
    <text x="130" y="400" class="card-val">Baby in Oatmeal Knit with Camel Script;</text>
    <text x="130" y="418" class="card-val">Toddler in Camel Knit with Cream Script.</text>

    <text x="130" y="455" class="card-label">Visual Impact in Photos</text>
    <text x="130" y="475" class="card-val">Subtle tonal distinction keeps outfits from looking</text>
    <text x="130" y="493" class="card-val">cloned while blending with neutral home decor.</text>

    <text x="130" y="530" class="card-label">Sizing Longevity Multiplier</text>
    <text x="130" y="550" class="card-val">Size 0-3M with rolled cuffs for baby (0-6M wear);</text>
    <text x="130" y="568" class="card-val">Size 3T for a 2-year-old gives 18+ months of use.</text>

    <text x="130" y="605" class="card-label">Best Lighting &amp; Occasion</text>
    <text x="130" y="625" class="card-val">Natural morning window light, hospital reveal,</text>
    <text x="130" y="643" class="card-val">neutral nursery studio setups, autumn holidays.</text>

    <text x="130" y="680" class="card-label">Gender Versatility</text>
    <text x="130" y="700" class="card-val">100% Gender-neutral. Works for brother/sister,</text>
    <text x="130" y="718" class="card-val">two brothers, or two sisters with equal warmth.</text>

    <rect x="130" y="755" width="380" height="42" rx="10" fill="#FDF7F2" stroke="#F0DFC8" stroke-width="1.5" />
    <text x="320" y="781" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13.5" fill="#8C5824">★ 10/10 • #1 PARENT-FAVORITE PALETTE</text>
  </g>

  <!-- COLUMN 2: Forest Green & Soft Beige -->
  <g filter="url(#shadow)">
    <rect x="580" y="228" width="440" height="630" rx="22" fill="#FFFFFF" stroke="#2D5A3C" stroke-width="1.5" />
    
    <rect x="580" y="228" width="440" height="48" rx="20" fill="#EBF3ED" />
    <circle cx="615" cy="252" r="13" fill="#2D5A3C" />
    <text x="615" y="257" text-anchor="middle" class="num-badge">02</text>
    <text x="640" y="257" class="card-verdict" fill="#2D5A3C">VINTAGE BOTANICAL • RICH CONTRAST</text>

    <text x="610" y="315" class="card-title">Forest Green &amp; Soft Beige</text>
    <text x="610" y="337" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" fill="#5C5049">Crisp depth for outdoor &amp; winter portraits</text>

    <line x1="610" y1="355" x2="990" y2="355" stroke="#EFE4DA" stroke-width="1.5" />

    <text x="610" y="380" class="card-label">Color Assignment</text>
    <text x="610" y="400" class="card-val">Older sibling in Forest Green with Cream name;</text>
    <text x="610" y="418" class="card-val">Baby in Warm Beige with Forest Green name.</text>

    <text x="610" y="455" class="card-label">Visual Impact in Photos</text>
    <text x="610" y="475" class="card-val">Deep woodland green anchors the photo while the</text>
    <text x="610" y="493" class="card-val">light beige sweater draws eyes to baby's features.</text>

    <text x="610" y="530" class="card-label">Sizing Longevity Multiplier</text>
    <text x="610" y="550" class="card-val">Ribbed necklines maintain snug shape even when</text>
    <text x="610" y="568" class="card-val">toddler climbs or runs during active photoshoots.</text>

    <text x="610" y="605" class="card-label">Best Lighting &amp; Occasion</text>
    <text x="610" y="625" class="card-val">Outdoor golden hour, pine forest tree farms,</text>
    <text x="610" y="643" class="card-val">Christmas cards, cozy fireplace family sessions.</text>

    <text x="610" y="680" class="card-label">Gender Versatility</text>
    <text x="610" y="700" class="card-val">Timeless heritage look that flatters both boys</text>
    <text x="610" y="718" class="card-val">and girls across all hair colors and skin tones.</text>

    <rect x="610" y="755" width="380" height="42" rx="10" fill="#F0F7F2" stroke="#CCE5D4" stroke-width="1.5" />
    <text x="800" y="781" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13.5" fill="#2D5A3C">★ 9.5/10 • BEST FOR HOLIDAY CARDS</text>
  </g>

  <!-- COLUMN 3: Dusty Rose & Heather Grey / Beige -->
  <g filter="url(#shadow)">
    <rect x="1060" y="228" width="440" height="630" rx="22" fill="#FFFFFF" stroke="#9C5A65" stroke-width="1.5" />
    
    <rect x="1060" y="228" width="440" height="48" rx="20" fill="#FDF1F3" />
    <circle cx="1095" cy="252" r="13" fill="#9C5A65" />
    <text x="1095" y="257" text-anchor="middle" class="num-badge">03</text>
    <text x="1120" y="257" class="card-verdict" fill="#9C5A65">NOSTALGIC HEIRLOOM • SOFT BLUSH</text>

    <text x="1090" y="315" class="card-title">Dusty Rose &amp; Natural Cream</text>
    <text x="1090" y="337" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" fill="#5C5049">Tender floral warmth without saccharine pink</text>

    <line x1="1090" y1="355" x2="1470" y2="355" stroke="#EFE4DA" stroke-width="1.5" />

    <text x="1090" y="380" class="card-label">Color Assignment</text>
    <text x="1090" y="400" class="card-val">Big sister in Dusty Rose with White cursive;</text>
    <text x="1090" y="418" class="card-val">Baby brother/sister in Cream with Rose thread.</text>

    <text x="1090" y="455" class="card-label">Visual Impact in Photos</text>
    <text x="1090" y="475" class="card-val">Muted vintage undertones avoid camera glare.</text>
    <text x="1090" y="493" class="card-val">Feels like a classic English country editorial.</text>

    <text x="1090" y="530" class="card-label">Sizing Longevity Multiplier</text>
    <text x="1090" y="550" class="card-val">Can be paired with bloomers, skirts, or denim,</text>
    <text x="1090" y="568" class="card-val">transitioning seamlessly from newborn to nursery.</text>

    <text x="1090" y="605" class="card-label">Best Lighting &amp; Occasion</text>
    <text x="1090" y="625" class="card-val">Spring flower blossoms, bright nursery portraits,</text>
    <text x="1090" y="643" class="card-val">Easter gatherings, sister milestone milestones.</text>

    <text x="1090" y="680" class="card-label">Gender Versatility</text>
    <text x="1090" y="700" class="card-val">Sensational for two sisters, or pair with Oatmeal</text>
    <text x="1090" y="718" class="card-val">for an elder sister and younger baby brother.</text>

    <rect x="1090" y="755" width="380" height="42" rx="10" fill="#FDF3F5" stroke="#F5D0D7" stroke-width="1.5" />
    <text x="1280" y="781" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13.5" fill="#9C5A65">★ 9.2/10 • IDEAL FOR SISTERS &amp; SPRING</text>
  </g>

  <!-- Bottom Takeaways Bar -->
  <g filter="url(#shadow)">
    <rect x="100" y="885" width="1400" height="135" rx="18" fill="#FFFFFF" stroke="#E2D6CB" stroke-width="1.5" />
  </g>

  <!-- 4 Mini Columns in Bottom Bar -->
  <!-- 1: Sizing Rule -->
  <text x="130" y="925" class="bar-title">The +1 Sizing Rule</text>
  <text x="130" y="950" class="bar-text">Baby: Order 0-3M with rolled cuffs.</text>
  <text x="130" y="972" class="bar-text">Toddler: Size up by one full year</text>
  <text x="130" y="994" class="bar-text">(e.g. 3T for a 2yo) for 18M+ wear.</text>

  <line x1="450" y1="905" x2="450" y2="1000" stroke="#EFE4DA" stroke-width="1.5" />

  <!-- 2: Thread Contrast -->
  <text x="480" y="925" class="bar-title">Thread Contrast Formula</text>
  <text x="480" y="950" class="bar-text">Ensure at least a 3-step value</text>
  <text x="480" y="972" class="bar-text">difference between yarn &amp; stitch</text>
  <text x="480" y="994" class="bar-text">so names remain crisp in photos.</text>

  <line x1="810" y1="905" x2="810" y2="1000" stroke="#EFE4DA" stroke-width="1.5" />

  <!-- 3: Posing Secret -->
  <text x="840" y="925" class="bar-title">Photogenic Posing</text>
  <text x="840" y="950" class="bar-text">Place baby on back on a neutral rug;</text>
  <text x="840" y="972" class="bar-text">have toddler lie beside them or cuddle</text>
  <text x="840" y="994" class="bar-text">arms around for unforced warmth.</text>

  <line x1="1170" y1="905" x2="1170" y2="1000" stroke="#EFE4DA" stroke-width="1.5" />

  <!-- 4: Studio Standard -->
  <text x="1200" y="925" class="bar-title">Knitty Petit Craft</text>
  <text x="1200" y="950" class="bar-text">100% Combed milk-cotton knits</text>
  <text x="1200" y="972" class="bar-text">with hand-embroidered cursive</text>
  <text x="1200" y="994" class="bar-text">designed for heirloom memory boxes.</text>

</svg>
  `;
}

// 3. Build Sibling Color Pairing Dual Showcase Graphic (Sharp Composite)
async function generateSiblingPairGraphic() {
  const oatmealPath = path.join(__dirname, '..', 'public', 'Shirts-Varient', 'OATMEAL.avif');
  const camelPath = path.join(__dirname, '..', 'public', 'Shirts-Varient', 'Camel.avif');

  const oatmealResized = await sharp(oatmealPath).resize(580, 580, { fit: 'contain', background: '#FFFFFF' }).toBuffer();
  const camelResized = await sharp(camelPath).resize(580, 580, { fit: 'contain', background: '#FFFFFF' }).toBuffer();

  const svgOverlay = `
  <svg width="1400" height="850" viewBox="0 0 1400 850" xmlns="http://www.w3.org/2000/svg">
    <rect width="1400" height="850" fill="#FAF6F0"/>
    
    <!-- Left Card Background -->
    <rect x="70" y="110" width="600" height="680" rx="20" fill="#FFFFFF" stroke="#EADFD5" stroke-width="2"/>
    <text x="370" y="730" text-anchor="middle" font-family="Georgia, serif" font-size="24" font-weight="bold" fill="#3D2E24">Little Sibling: Natural Oatmeal</text>
    <text x="370" y="760" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#7C6E64">Size 0-3M • 100% Combed Cotton • Soft Cream Knit</text>

    <!-- Right Card Background -->
    <rect x="730" y="110" width="600" height="680" rx="20" fill="#FFFFFF" stroke="#EADFD5" stroke-width="2"/>
    <text x="1030" y="730" text-anchor="middle" font-family="Georgia, serif" font-size="24" font-weight="bold" fill="#3D2E24">Big Sibling: Earthy Camel</text>
    <text x="1030" y="760" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#7C6E64">Size 2T–3T • Rich Amber Tone • Hand-Embroidered Script</text>

    <!-- Header Badge & Title -->
    <rect x="525" y="30" width="350" height="32" rx="16" fill="#F4EAE1"/>
    <text x="700" y="52" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#915838" letter-spacing="2">KNITTY PETIT SIGNATURE PAIRING</text>
    <text x="700" y="92" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="bold" fill="#2C221C">The Tonal Earth Harmonization</text>
  </svg>
  `;

  return await sharp(Buffer.from(svgOverlay))
    .composite([
      { input: oatmealResized, top: 130, left: 80 },
      { input: camelResized, top: 130, left: 740 }
    ])
    .png({ quality: 92 })
    .toBuffer();
}

async function main() {
  console.log('🚀 Starting Autonomous SEO Blog Publishing Engine for Knitty Petit...');

  // Step 1: Generate & Save 1600x1100 Infographic
  console.log('Generating 1600x1100 Infographic SVG...');
  const svgString = buildInfographicSvg();
  const infographicPngBuffer = await sharp(Buffer.from(svgString))
    .png({ quality: 95 })
    .toBuffer();

  const publicInfographicPath = path.join(__dirname, '..', 'public', 'coordinating-sibling-matching-personalized-sweaters-infographic.png');
  fs.writeFileSync(publicInfographicPath, infographicPngBuffer);
  console.log(`Saved infographic locally to ${publicInfographicPath}`);

  const infographicAssetId = await uploadAsset(
    infographicPngBuffer,
    'coordinating-sibling-matching-personalized-sweaters-infographic.png',
    'image/png'
  );
  console.log(`Infographic uploaded to Sanity! Asset ID: ${infographicAssetId}`);

  // Step 2: Generate & Save Sibling Pair Graphic
  console.log('Generating Sibling Pair Dual Showcase graphic...');
  const pairGraphicBuffer = await generateSiblingPairGraphic();
  const publicPairGraphicPath = path.join(__dirname, '..', 'public', 'sibling-sweater-tonal-pairing-showcase.png');
  fs.writeFileSync(publicPairGraphicPath, pairGraphicBuffer);
  console.log(`Saved sibling pair graphic to ${publicPairGraphicPath}`);

  const pairAssetId = await uploadAsset(
    pairGraphicBuffer,
    'sibling-sweater-tonal-pairing-showcase.png',
    'image/png'
  );
  console.log(`Sibling pair showcase uploaded to Sanity! Asset ID: ${pairAssetId}`);

  // Step 3: Check & Upload Hero Image
  const heroPath = path.join(__dirname, '..', 'public', 'coordinating-sibling-sweaters-hero.jpg');
  let heroAssetId;
  if (fs.existsSync(heroPath)) {
    console.log('Reading editorial hero image from public folder...');
    const heroBuffer = fs.readFileSync(heroPath);
    heroAssetId = await uploadAsset(
      heroBuffer,
      'coordinating-sibling-sweaters-hero.jpg',
      'image/jpeg'
    );
    console.log(`Editorial hero uploaded to Sanity! Asset ID: ${heroAssetId}`);
  } else {
    heroAssetId = 'image-562df182957668a94c02253315570f67089cdb6d-3000x2250-jpg';
  }

  // Pre-curated authentic assets from Knitty Petit lake
  const processAssetId = 'image-463bdfd8b1a0501845713ecb8a912668ca7d251d-1024x1024-jpg'; // Handcrafting process
  const productAssetId = 'image-5acf43a9e6e3edb22e6305590b0525adcd7bbc33-1920x1920-heif'; // Product packshot
  const inSituAssetId = 'image-562df182957668a94c02253315570f67089cdb6d-3000x2250-jpg'; // Nursery in-situ

  // Step 4: Assemble Comprehensive Editorial Body (Portable Text)
  console.log('Constructing high E-E-A-T PortableText content payload (2,000+ words)...');

  const body = [
    // Direct Answer Lead (Position 0 / AI Overview ready)
    p([
      {
        text: "The most photogenic way to coordinate matching sibling personalized sweaters is to choose complementary tonal shades (such as Oatmeal for baby and Camel for the older sibling) rather than identical colors. Sizing up by one full year for the toddler and selecting high-contrast, hand-embroidered cursive text ensures the outfits stay comfortable, read sharply in milestone photography, and remain wearable across multiple seasons.",
        marks: ["strong"]
      }
    ]),

    p([
      "Welcoming a new baby into the family is one of life's most tender milestones—not just for parents, but for the newly minted big brother or big sister. From hospital bedside introductions to family holiday portraits and nursery birth announcements, capturing that first spark of sibling connection on camera is a memory parents cherish for a lifetime."
    ]),

    p([
      "In recent years, modern family styling has evolved past rigid, identical 'carbon-copy' outfits. Today’s parents are embracing ",
      { text: "coordinating personalized knitwear", marks: ["link_sweaters"] },
      "—pairing hand-embroidered name sweaters that harmonize in texture and color while honoring each child's individual size, age, and personality."
    ], [
      { _key: "link_sweaters", _type: "link", href: "/products/hand-embroidered-kids-name-sweaters", blank: false }
    ]),

    p([
      "Yet coordinating knitwear for children at different developmental stages presents unique challenges. How do you select color palettes that don't clash or look overwhelmingly busy? What is the secret to buying sizes that won't be outgrown in four weeks? And how do you ensure the yarn is gentle enough for a newborn’s delicate, eczema-prone skin while durable enough for an active two-year-old running through the grass?"
    ]),

    p([
      "In this definitive guide from the ",
      { text: "Knitty Petit", marks: ["link_studio"] },
      " artisan studio, we share the essential formulas for color harmony, pediatric sizing multipliers, embroidery contrast guidelines, and stress-free photoshoot tips to help you style matching sibling sweaters with timeless grace."
    ], [
      { _key: "link_studio", _type: "link", href: "/blog", blank: false }
    ]),

    // Section 1: The Golden Rule of Sibling Styling
    h2("The Golden Rule: Harmonize, Don’t Clone"),

    p([
      "The single biggest mistake parents make when dressing siblings for photographs is choosing exact duplicate outfits. Dressing a three-year-old boy and a three-week-old infant in identical identical-colored sweaters often produces visual flatness in photos. In milestone photography, identical blocks of color cause the children to visually blend into one another, making it harder to discern delicate facial features and individual proportions."
    ]),

    quote("“Artisanal sibling styling is about harmony, not cloning. When siblings wear sister shades from the same earth-tone family, each child stands out while the family portrait feels organically unified.”"),

    p([
      "Instead of cloning, editorial stylists follow the ",
      { text: "Tonal Harmonization Method", marks: ["strong"] },
      ": selecting two or three adjacent tones from an organic color wheel. By varying the garment shades while unifying them with matching hand-embroidered script, the outfits tell a cohesive visual story without looking like a mass-produced uniform."
    ]),

    // Asset 2: Sibling Tonal Pairing Graphic
    inlineImage(
      pairAssetId,
      "Knitty Petit matching sibling sweater tonal pairing: Oatmeal for baby and Camel for older toddler",
      "Figure 1: The Tonal Earth Harmonization—pairing soft Oatmeal for the infant with warm Camel for the older sibling creates high-end visual depth."
    ),

    // Section 2: 4 Fail-Safe Color Palettes
    h2("The 4 Fail-Safe Color Palettes for Sibling Knitwear"),

    p([
      "When curating your children’s custom sweaters, anchor your palette in muted, nature-inspired tones that flatter infant complexions and complement nursery backdrops. Here are the four studio-tested color combinations that consistently photograph with heirloom quality:"
    ]),

    h3("1. The Earthy Tonal Duo: Warm Camel & Soft Oatmeal"),
    p([
      "This is Knitty Petit's most requested sibling combination, and for good reason. Soft Oatmeal provides an airy, angelic backdrop for a newborn's delicate skin, while rich Camel adds grounded warmth and structure to an older toddler's outfit. Because both colors stem from warm flax and amber undertones, they never fight for visual dominance."
    ]),
    bullet([
      { text: "Baby's Sweater: ", marks: ["strong"] },
      "Oatmeal knit with rich Terracotta or Camel cursive embroidery."
    ]),
    bullet([
      { text: "Older Sibling's Sweater: ", marks: ["strong"] },
      "Warm Camel knit with soft Cream or Milk-White cursive embroidery."
    ]),
    bullet([
      { text: "Why It Works: ", marks: ["strong"] },
      "Completely gender-neutral. Flawless for brother/sister, two brothers, or two sisters."
    ]),

    h3("2. The Woodland Contrast: Forest Green & Warm Beige"),
    p([
      "For autumn announcements, Thanksgiving gatherings, or holiday Christmas card sessions, Forest Green paired with Warm Beige provides rich, nostalgic contrast. Deep evergreen provides an authoritative, cozy frame for the older sibling, while light beige keeps the baby bright and luminous in the camera frame."
    ]),
    bullet([
      { text: "Baby's Sweater: ", marks: ["strong"] },
      "Warm Beige knit with Forest Green or Sage chain-stitch script."
    ]),
    bullet([
      { text: "Older Sibling's Sweater: ", marks: ["strong"] },
      "Deep Forest Green knit with Cream or Ivory cursive script."
    ]),
    bullet([
      { text: "Why It Works: ", marks: ["strong"] },
      "Creates the popular 'inverted contrast' effect, connecting both children through reciprocal color play."
    ]),

    h3("3. The Soft Botanical Meadow: Dusty Rose & Heather Cream / Oatmeal"),
    p([
      "Ideal for spring nurseries, Easter portraits, or an older sister welcoming a new sibling. Our Dusty Rose is carefully blended with mauve undertones, avoiding the loud, synthetic neon tones that cast unflattering pink color reflections on baby's face. Paired with natural cream or oatmeal, it evokes an English cottage garden aesthetic."
    ]),
    bullet([
      { text: "Baby's Sweater: ", marks: ["strong"] },
      "Natural Cream knit with Dusty Rose script and tiny embroidered floral petals."
    ]),
    bullet([
      { text: "Older Sister's Sweater: ", marks: ["strong"] },
      "Dusty Rose knit with Milk-White script."
    ]),

    h3("4. Coastal Heritage: Navy Blue & Natural Oatmeal"),
    p([
      "A preppy, tailored favorite for brothers. Navy blue can sometimes feel dark for a brand-new newborn, but when worn by the toddler and paired with an infant in oatmeal or soft sky blue, the combination feels crisp, nautical, and timeless."
    ]),

    // Asset 3: Infographic SVG
    inlineImage(
      infographicAssetId,
      "Coordinating sibling sweater styling guide infographic comparing color harmony, sizing multipliers, and photo tips",
      "Figure 2: The Sibling Knitwear Architecture Infographic—comprehensive sizing formulas, color matrices, and heirloom embroidery guidelines."
    ),

    // Section 3: Pediatric Sizing Multipliers
    h2("The Sibling Sizing Multiplier: How to Buy for Two Growing Children"),

    p([
      "One of the greatest fears parents have when investing in heirloom knitwear is longevity. Babies double their birth weight in the first five months, and toddlers experience sudden seasonal growth spurts. How do you ensure your personalized sweaters remain wearable for more than just a single photoshoot?"
    ]),

    p([
      "At Knitty Petit, we have engineered our ",
      { text: "Chunky Combed Cotton Sweaters", marks: ["link_sizing_guide"] },
      " with an intentional relaxed silhouette and elongated ribbed cuffs that can be folded back. To maximize wear across consecutive holiday seasons, use this sizing formula:"
    ], [
      { _key: "link_sizing_guide", _type: "link", href: "/blog/what-size-baby-name-sweater-should-you-get", blank: false }
    ]),

    h3("The Newborn Rule: Size 0–3 Months with Cuffed Ribbing"),
    p([
      "Never buy size Newborn (NB) for personalized knitwear unless your baby is born prematurely. Standard NB sweaters fit babies weighing 5 to 8 lbs and will be outgrown in under three weeks. Instead, order size 0–3 Months. When baby arrives at the hospital or coming-home shoot, simply fold back the ribbed sleeve cuffs twice. The sweater will drape in a charming, cozy oversized fashion and will continue to fit comfortably until baby is 6 months old."
    ]),

    h3("The Toddler Multiplier: The '+1 Year' Rule"),
    p([
      "For toddlers between ages 1 and 4, always order one size larger than their current milestone. If your older child is 18 months, choose size 2T. If your child is 2.5 years old, jump straight to size 3T or 4T. High-quality 100% cotton knitwear possesses natural lateral elasticity; sizing up allows room for under-layers (such as collared shirts or thermal bodysuits) during chilly autumn mornings and guarantees an extra full year of wear."
    ]),

    // Section 4: Typography and Embroidery Harmony
    h2("Typography & Embroidery Harmony: Unifying Sibling Names"),

    p([
      "While sweater colors should complement rather than match, your embroidery styling should remain unified. Consistency in typography is the visual thread that ties the sibling portraits together."
    ]),

    // Asset 4: Process Detail
    inlineImage(
      processAssetId,
      "Master artisan hand-embroidering cursive baby name sweater with milk cotton yarn",
      "Figure 3: Loop-by-loop chain stitching in our studio. Using identical cursive font anatomy unifies sibling garments even with different yarn colors."
    ),

    h3("Chain Stitch vs. Machine Embroidery for Sibling Wear"),
    p([
      "As detailed in our ",
      { text: "Baby Name Sweater Embroidery Guide", marks: ["link_embroidery_guide"] },
      ", hand-stitched chain loops are vastly superior to commercial machine satin stitching. Machine embroidery relies on stiff backing paper that causes unsightly puckering when washed. Hand chain stitching moves harmoniously with the knit, stretching flexibly when your toddler rolls around or pulls the sweater over their head."
    ], [
      { _key: "link_embroidery_guide", _type: "link", href: "/blog/baby-name-sweater-embroidery-fonts-stitches-guide", blank: false }
    ]),

    h3("Handling Letter Count Discrepancies"),
    p([
      "Parents often ask: 'What if my daughter's name is Penelope (8 letters) and my son's name is Leo (3 letters)? Will the sweaters look uneven?'"
    ]),
    p([
      "Artisans solve this through proportional arc placement. For short names (3–4 letters), the script is centered across the chest with slightly elevated letter height (approx. 2.2 inches). For longer names (7–9 letters), our embroiderers gently arch the cursive across the upper chest with petite letter scale (approx. 1.6 inches). When placed side by side, the names occupy an identical visual footprint."
    ]),

    // Section 5: Photoshoot Survival Guide
    h2("The Sibling Photoshoot Survival Guide: Posing Newborns & Toddlers"),

    p([
      "Photographing a newborn and a energetic toddler together can feel daunting. Toddlers are naturally active, unpredictable, and sometimes hesitant around fragile new babies. To capture relaxed, magazine-worthy photos without tears, follow these studio-tested posing strategies:"
    ]),

    h3("1. The Floor Flat-Lay (Safest & Most Relaxed)"),
    p([
      "Place a thick sheepskin or cream textured knit blanket on the floor directly adjacent to a large low window with indirect morning sunlight. Lay your newborn down on their back. Then, invite the older sibling to lie down on their stomach beside the baby, resting their chin on their hands. This eliminates any risk of dropping the infant and allows both children to rest comfortably at eye level."
    ]),

    h3("2. The Big Sibling Lap Cuddle"),
    p([
      "Sit your toddler on a low sofa or cushioned floor mat with their back securely supported by nursing pillows. Gently nestle the swaddled baby into their lap while you support the baby’s neck off-camera. Coach the older child to whisper a nursery secret into baby’s ear—this reliably evokes genuine, heartwarming smiles and gentle candid expressions."
    ]),

    // Asset 5: Packshot Detail
    inlineImage(
      productAssetId,
      "Knitty Petit personalized baby and kids name sweater in neutral tones",
      "Figure 4: Soft tactile ribbed knitwear and chunky embroidered lettering designed for sensitive infant skin and active toddler play."
    ),

    // Section 6: Comparison Matrix Table
    h2("Comparison: Sibling Styling Approaches"),

    p([
      "To help you weigh the visual impact, comfort, and investment value of different sibling outfit options, here is how artisanal knitwear compares to standard commercial alternatives:"
    ]),

    p([
      { text: "1. Tonal Hand-Embroidered Knitwear (Knitty Petit Standard): ", marks: ["strong"] },
      "Artisanal 100% combed cotton, complementary color harmony, 3D flexible chain-stitch names. Verdict: Heirloom quality, photogenic, 18+ months longevity, keeps in family memory boxes."
    ]),

    p([
      { text: "2. Identical Duplicate Outfits (Fast Fashion): ", marks: ["strong"] },
      "Same color and cut for both children. Verdict: High risk of visual clashing in photos; older child often outgrows garment within 60 days; polyester fibers trap heat and itch."
    ]),

    p([
      { text: "3. Graphic 'Big Bro / Lil Sis' Printed T-Shirts: ", marks: ["strong"] },
      "Screen-printed polyester/cotton blend. Verdict: Casual and humorous, but dated in heirloom family albums; screen prints crack and peel in wash; lacks tactile luxury."
    ]),

    // Section 7: Care and Maintenance
    h2("Caring for Sibling Sweaters: Quick Hand-Washing & Stain Removal"),

    p([
      "Toddlers and newborn spit-ups are inevitable. The secret to keeping hand-embroidered cotton knitwear pristine through years of wear is proper care. As outlined in our ",
      { text: "Complete Sweater Washing & Care Guide", marks: ["link_wash_guide"] },
      ", always wash sweaters inside-out in cool water with mild, fragrance-free baby soap. Never wring or twist hand-embroidered lettering; instead, roll the garments in a dry white towel to press out moisture and lay them flat to dry away from direct sunlight."
    ], [
      { _key: "link_wash_guide", _type: "link", href: "/blog/how-to-wash-hand-embroidered-baby-sweater", blank: false }
    ]),

    // Asset 6: In-Situ Lifestyle Photo
    inlineImage(
      inSituAssetId,
      "Baby and sibling name sweater milestone flat-lay setting with wooden birth announcements and knit booties",
      "Figure 5: Thoughtfully styled milestone keepsakes create unforgettable visual records of baby's arrival."
    ),

    // Section 8: PAA FAQ Section
    h2("Frequently Asked Questions (FAQ)"),

    h3("What is the best color combination for boy and girl siblings?"),
    p([
      "The top-performing combination for boy and girl siblings is Warm Camel and Soft Oatmeal, or Forest Green paired with Dusty Rose. Both pairings offer balanced contrast without falling into overly gendered stereotypes, harmonizing effortlessly against home interiors."
    ]),

    h3("Should we embroider first names or 'Big' and 'Little' titles?"),
    p([
      "First names are strongly recommended for long-term versatility. While 'Big Bro' or 'Little Sis' sweaters are charming for a hospital announcement, they cannot be worn independently as everyday school or nursery clothes once the baby stage passes. First names remain a personalized wardrobe staple for years."
    ]),

    h3("How far in advance should we order matching sweaters for hospital photos?"),
    p([
      "Because each Knitty Petit sweater is hand-knitted and custom embroidered by skilled artisans, we recommend placing your order 3 to 4 weeks before your expected due date or scheduled portrait session."
    ]),

    h3("Are Knitty Petit sweaters safe for toddlers with sensitive skin or eczema?"),
    p([
      "Yes. All Knitty Petit sweaters are crafted from 100% hypoallergenic combed cotton yarn with zero synthetic acrylics, itchy wool scales, or stiff interior plastic stabilizers. As explained in our pediatric guide on ",
      { text: "Cotton vs. Wool for Baby Clothes", marks: ["link_cotton_wool"] },
      ", smooth cotton fibers protect vulnerable skin barriers against friction and contact flare-ups."
    ], [
      { _key: "link_cotton_wool", _type: "link", href: "/blog/cotton-vs-wool-baby-clothes-sensitive-skin-guide", blank: false }
    ]),

    h3("Can we order an infant romper for the baby and a sweater for the older child?"),
    p([
      "Absolutely. Many parents prefer an embroidered cotton bubble romper or footed knit for their 0–3 month newborn while dressing their 2–4 year old toddler in a chunky knit pullover. Using identical embroidery script unifies the garments across different silhouettes."
    ]),

    // Conclusion / CTA
    h2("Create Timeless Keepsakes for Your Growing Family"),

    p([
      "Watching an older child embrace their baby brother or sister is a fleeting, miraculous chapter of family life. Dressing them in coordinated, hand-embroidered knitwear honors that bond with warmth, beauty, and artisanal craft."
    ]),

    p([
      "Explore the ",
      { text: "Knitty Petit Custom Name Sweaters Collection", marks: ["link_shop_cta"] },
      " today to select your family's favorite palette, customize your children's names, and create heirlooms that your children will one day show to their own little ones."
    ], [
      { _key: "link_shop_cta", _type: "link", href: "/products/hand-embroidered-kids-name-sweaters", blank: false }
    ])
  ];

  // Step 5: Construct Post Document
  const slug = 'coordinating-sibling-matching-personalized-sweaters';
  const postDoc = {
    _id: slug,
    _type: 'post',
    title: 'Coordinating Sibling Outfits: How to Style Matching Personalized Sweaters for Newborns, Toddlers & Family Photos',
    slug: {
      _type: 'slug',
      current: slug
    },
    excerpt: 'Bringing a new baby home to an older sibling? Discover aesthetic earth-tone color palettes, pediatric sizing formulas, and posing secrets for matching personalized name sweaters.',
    publishedAt: new Date().toISOString(),
    categories: ['inspiration', 'tutorials', 'crochet-tips'],
    author: {
      _type: 'reference',
      _ref: 'author-tom-morgen'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: heroAssetId
      },
      alt: 'Coordinating matching sibling personalized hand-knitted name sweaters in oatmeal and camel'
    },
    body
  };

  // Step 6: Publish Document to Sanity Content Lake
  console.log(`Publishing post document '${slug}' to Sanity...`);
  const mutateRes = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mutations: [
        {
          createOrReplace: postDoc
        }
      ]
    })
  });

  const mutateData = await mutateRes.json();
  if (!mutateRes.ok) {
    throw new Error(`Sanity publish failed: ${JSON.stringify(mutateData)}`);
  }

  console.log('🎉 Document successfully published to Sanity Content Lake!');
  console.log(`Transaction ID: ${mutateData.transactionId}`);
  console.log(`Live Post Slug: /blog/${slug}`);
}

main().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
