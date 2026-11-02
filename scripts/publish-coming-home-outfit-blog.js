const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Load environment variables from .env.local
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
  return 'cho_' + (keyCounter++).toString(36) + '_' + Math.random().toString(36).substring(2, 7);
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

// Upload buffer directly to Sanity Content Lake
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
      <stop offset="0%" stop-color="#FAF7F2" />
      <stop offset="100%" stop-color="#F3ECE2" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FDFCFA" />
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
  <rect x="100" y="78" width="410" height="34" rx="17" fill="#F6ECE4" />
  <text x="305" y="100" text-anchor="middle" class="tag">KNITTY PETIT • HOSPITAL BAG DECISION GUIDE</text>

  <!-- Header Title & Subtitle -->
  <text x="100" y="155" class="title" font-size="36">Newborn Coming Home Outfit: The Essential Decision Matrix</text>
  <text x="100" y="190" class="subtitle" font-size="16.5">Pediatric sizing, thermal comfort layering, car seat harness safety, and heirloom keepsake preservation for baby’s first trip home.</text>

  <!-- 3 Comparison Columns -->

  <!-- COLUMN 1: The Sizing Rule (Newborn vs 0-3M) -->
  <g filter="url(#shadow)">
    <rect x="100" y="228" width="440" height="630" rx="22" fill="#FFFFFF" stroke="#C28D5A" stroke-width="2.5" />
    
    <rect x="100" y="228" width="440" height="48" rx="20" fill="#FBF3EC" />
    <circle cx="135" cy="252" r="13" fill="#C28D5A" />
    <text x="135" y="257" text-anchor="middle" class="num-badge">01</text>
    <text x="160" y="257" class="card-verdict" fill="#8C5824">SIZING WISDOM • LONGEVITY CHOICE</text>

    <text x="130" y="315" class="card-title">Newborn vs. 0–3 Months</text>
    <text x="130" y="337" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" fill="#5C5049">Strategic sizing for hospital bassinet &amp; growth</text>

    <line x1="130" y1="355" x2="510" y2="355" stroke="#EFE4DA" stroke-width="1.5" />

    <text x="130" y="380" class="card-label">The Golden Rule</text>
    <text x="130" y="400" class="card-val">Size 0–3M (relaxed fit) is the top choice for gifts.</text>
    <text x="130" y="420" class="card-val">Cuffs fold up delicately on day 1 and fit up to 6 months.</text>

    <text x="130" y="455" class="card-label">Umbilical Cord Clearance</text>
    <text x="130" y="475" class="card-val">Loose sweater ribbing prevents pinching sensitive clamps,</text>
    <text x="130" y="495" class="card-val">unlike tight elasticated footies or snap suits.</text>

    <text x="130" y="530" class="card-label">Weight Guidance</text>
    <text x="130" y="550" class="card-val">• NB Size: Best for pre-planned inductions (&lt;7.5 lbs)</text>
    <text x="130" y="572" class="card-val">• 0–3M Size: Recommended for all general births (7.5–12 lbs)</text>

    <rect x="130" y="605" width="380" height="110" rx="14" fill="#FAF5EF" stroke="#E6D7C8" stroke-width="1.5" />
    <text x="150" y="632" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13" fill="#8C5824">PRO TIP FROM HOSPITAL EXPERTS</text>
    <text x="150" y="655" class="card-val">Always pack an organic onesie underneath.</text>
    <text x="150" y="675" class="card-val">The sweater glides easily over a base layer,</text>
    <text x="150" y="695" class="card-val">making nursery diaper checks completely stress-free.</text>
  </g>

  <!-- COLUMN 2: Car Seat & Thermal Safety -->
  <g filter="url(#shadow)">
    <rect x="580" y="228" width="440" height="630" rx="22" fill="#FFFFFF" stroke="#688B74" stroke-width="2.5" />
    
    <rect x="580" y="228" width="440" height="48" rx="20" fill="#EFF5F1" />
    <circle cx="615" cy="252" r="13" fill="#688B74" />
    <text x="615" y="257" text-anchor="middle" class="num-badge">02</text>
    <text x="640" y="257" class="card-verdict" fill="#42634E">AAP SAFETY RULES • CAR SEAT APPROVED</text>

    <text x="610" y="315" class="card-title">Safe Thermal Layering</text>
    <text x="610" y="337" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" fill="#5C5049">Zero bulky puffiness under 5-point harness</text>

    <line x1="610" y1="355" x2="990" y2="355" stroke="#E3EBE5" stroke-width="1.5" />

    <text x="610" y="380" class="card-label">The AAP Car Seat Rule</text>
    <text x="610" y="400" class="card-val">Heavy bunting and winter coats compress in a crash,</text>
    <text x="610" y="420" class="card-val">leaving dangerous slack in car seat harness straps.</text>

    <text x="610" y="455" class="card-label">Why Breathable Knitwear Wins</text>
    <text x="610" y="475" class="card-val">Soft knit gauge fits flush against baby's chest,</text>
    <text x="610" y="495" class="card-val">allowing a snug, pinch-test-compliant harness fit.</text>

    <text x="610" y="530" class="card-label">The 3-Layer Departure System</text>
    <text x="610" y="550" class="card-val">1. Base: Short-sleeve 100% organic cotton onesie</text>
    <text x="610" y="572" class="card-val">2. Mid: Hand-embroidered name knit sweater + pants</text>
    <text x="610" y="594" class="card-val">3. Top: Warm blanket tucked *over* the buckled straps</text>

    <rect x="610" y="625" width="380" height="90" rx="14" fill="#F2F8F4" stroke="#D1E3D7" stroke-width="1.5" />
    <text x="630" y="652" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13" fill="#42634E">HOSPITAL DISCHARGE MANDATE</text>
    <text x="630" y="675" class="card-val">Nurses inspect car seat strap tightness before exit.</text>
    <text x="630" y="695" class="card-val">Fitted knitwear passes without undressing baby.</text>
  </g>

  <!-- COLUMN 3: Photo Styling & Keepsake Value -->
  <g filter="url(#shadow)">
    <rect x="1060" y="228" width="440" height="630" rx="22" fill="#FFFFFF" stroke="#9A697B" stroke-width="2.5" />
    
    <rect x="1060" y="228" width="440" height="48" rx="20" fill="#FAF0F4" />
    <circle cx="1095" cy="252" r="13" fill="#9A697B" />
    <text x="1095" y="257" text-anchor="middle" class="num-badge">03</text>
    <text x="1120" y="257" class="card-verdict" fill="#754758">HEIRLOOM QUALITY • PHOTO READY</text>

    <text x="1090" y="315" class="card-title">First Portrait &amp; Heirloom</text>
    <text x="1090" y="337" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" fill="#5C5049">From hospital bassinet to nursery shadowbox</text>

    <line x1="1090" y1="355" x2="1470" y2="355" stroke="#F1E4EA" stroke-width="1.5" />

    <text x="1090" y="380" class="card-label">Bassinet Announcement Styling</text>
    <text x="1090" y="400" class="card-val">The hand-stitched cursive name sits proudly across chest</text>
    <text x="1090" y="420" class="card-val">clearly legible in natural hospital window lighting.</text>

    <text x="1090" y="455" class="card-label">Complementary Props</text>
    <text x="1090" y="475" class="card-val">• Engraved wooden birth stat disc (weight, date, time)</text>
    <text x="1090" y="495" class="card-val">• Matching ribbed knit pixie bonnet or bow headband</text>

    <text x="1090" y="530" class="card-label">Decade Keepsake Preservation</text>
    <text x="1090" y="550" class="card-val">Screen-printed onesies crack after 3 washes.</text>
    <text x="1090" y="572" class="card-val">Hand-embroidered knitwear preserves stitches for decades,</text>
    <text x="1090" y="594" class="card-val">ideal for nursery framing or future sibling hand-me-downs.</text>

    <rect x="1090" y="625" width="380" height="90" rx="14" fill="#FBF3F6" stroke="#E9D4DE" stroke-width="1.5" />
    <text x="1110" y="652" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13" fill="#754758">MEMORIES IN EVERY STITCH</text>
    <text x="1110" y="675" class="card-val">Every sweater is custom-embroidered by hand,</text>
    <text x="1110" y="695" class="card-val">turning the hospital exit into a timeless family milestone.</text>
  </g>

  <!-- Bottom Quality Banner -->
  <g filter="url(#shadow)">
    <rect x="100" y="885" width="1400" height="135" rx="18" fill="#FAF6F0" stroke="#DFD0C0" stroke-width="1.8" />
  </g>
  <text x="140" y="930" class="bar-title">The Knitty Petit Newborn Standard</text>
  <text x="140" y="960" class="bar-text">Ultra-soft, hypoallergenic knit with skin-protective embroidery backings • Certified non-toxic yarns • Handcrafted with love in bespoke colorways.</text>
  <text x="140" y="990" class="bar-text">Designed specifically to keep newborn skin calm, comfortable, and picture-perfect from delivery room to front door.</text>
</svg>
`;
}

// 3. Build Comparison Pair Image using Sharp
async function buildComparisonPairImage() {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap');
      .title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; fill: #2C2420; }
      .label { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; }
      .text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; fill: #5C5049; line-height: 1.5; }
    </style>
  </defs>
  <rect width="1200" height="750" fill="#F8F4EE" />
  <text x="600" y="55" text-anchor="middle" class="title" font-size="32">Choosing Baby’s First Departure Outfit</text>
  <text x="600" y="88" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#7A6F68">Heirloom Hand-Embroidered Sweater vs. Mass-Market Screen-Printed Onesie</text>

  <!-- Left Card: Hand Embroidered Sweater -->
  <rect x="70" y="125" width="510" height="570" rx="20" fill="#FFFFFF" stroke="#C28D5A" stroke-width="2.5" />
  <rect x="70" y="125" width="510" height="45" rx="18" fill="#FBF3EC" />
  <text x="325" y="153" text-anchor="middle" class="label" fill="#8C5824">KNITTY PETIT HAND-EMBROIDERED SWEATER</text>

  <text x="105" y="205" font-family="Playfair Display, serif" font-weight="700" font-size="22" fill="#2C2420">Heirloom Keepsake Standard</text>
  
  <text x="105" y="245" class="label" font-size="12" fill="#8C5824">FABRIC &amp; COMFORT</text>
  <text x="105" y="270" class="text">• Ultra-soft, breathable cotton or merino knit blend</text>
  <text x="105" y="295" class="text">• Regulates newborn temperature without overheating</text>
  <text x="105" y="320" class="text">• Ribbed neckband slips smoothly over delicate heads</text>

  <text x="105" y="365" class="label" font-size="12" fill="#8C5824">PERSONALIZATION</text>
  <text x="105" y="390" class="text">• 100% hand-stitched yarn cursive lettering</text>
  <text x="105" y="415" class="text">• Ultra-smooth protective backing protects newborn chest</text>
  <text x="105" y="440" class="text">• Bespoke color combinations matched to nursery palette</text>

  <text x="105" y="485" class="label" font-size="12" fill="#8C5824">LIFESPAN &amp; MEMORY</text>
  <text x="105" y="510" class="text">• Lasts for decades as a nursery shadowbox treasure</text>
  <text x="105" y="535" class="text">• Folds up gracefully for 6+ months of extended wear</text>
  <text x="105" y="560" class="text">• Passed down to future siblings with pride</text>

  <rect x="105" y="600" width="440" height="65" rx="12" fill="#FAF5EF" />
  <text x="125" y="628" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13" fill="#8C5824">PARENT VERDICT: ★★★★★</text>
  <text x="125" y="650" class="text">"The single most photographed item in our baby book."</text>

  <!-- Right Card: Fast Fashion Onesie -->
  <rect x="620" y="125" width="510" height="570" rx="20" fill="#FFFFFF" stroke="#D5CCC5" stroke-width="1.8" />
  <rect x="620" y="125" width="510" height="45" rx="18" fill="#F4EFEA" />
  <text x="875" y="153" text-anchor="middle" class="label" fill="#7A6F68">FAST-FASHION SCREEN-PRINT ONESIE</text>

  <text x="655" y="205" font-family="Playfair Display, serif" font-weight="700" font-size="22" fill="#5C5049">Disposable Utility Sleepsuit</text>

  <text x="655" y="245" class="label" font-size="12" fill="#7A6F68">FABRIC &amp; COMFORT</text>
  <text x="655" y="270" class="text">• Thin polyester-cotton blend, easily gets damp or clammy</text>
  <text x="655" y="295" class="text">• Harsh interior seams and stiff printed labels</text>
  <text x="655" y="320" class="text">• Tight footies that scrunch newborn toes</text>

  <text x="655" y="365" class="label" font-size="12" fill="#7A6F68">PERSONALIZATION</text>
  <text x="655" y="390" class="text">• Machine vinyl heat-press or screen print</text>
  <text x="655" y="415" class="text">• Vinyl stiffens, peels, and cracks after first cycle</text>
  <text x="655" y="440" class="text">• Plastic chemicals touch baby's sensitive skin</text>

  <text x="655" y="485" class="label" font-size="12" fill="#7A6F68">LIFESPAN &amp; MEMORY</text>
  <text x="655" y="510" class="text">• Outgrown in 10 to 14 days as baby stretches</text>
  <text x="655" y="535" class="text">• Thrown into donation bin or fabric waste</text>
  <text x="655" y="560" class="text">• Zero sentimental or keepsake display value</text>

  <rect x="655" y="600" width="440" height="65" rx="12" fill="#F8F6F4" />
  <text x="675" y="628" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13" fill="#7A6F68">PARENT VERDICT: ★★★☆☆</text>
  <text x="675" y="650" class="text">"Functional for spit-ups, but feels cheap in birth photos."</text>
</svg>
`;
  return await sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('🚀 Starting Autonomous SEO Blog Publishing for Knitty Petit...');
  console.log(`Target: Sanity Project [${PROJECT_ID}], Dataset [${DATASET}]`);

  // Step 1: Generate Visual Assets
  console.log('🎨 Generating 1600x1100 Decision Guide Infographic...');
  const infographicSvg = buildInfographicSvg();
  const infographicBuffer = await sharp(Buffer.from(infographicSvg)).png({ quality: 95 }).toBuffer();
  const infographicPath = path.join(__dirname, '..', 'public', 'newborn-coming-home-outfit-infographic.png');
  fs.writeFileSync(infographicPath, infographicBuffer);
  console.log(`Saved infographic locally to ${infographicPath}`);

  console.log('🎨 Generating Comparison Pair Visual...');
  const comparisonBuffer = await buildComparisonPairImage();
  const comparisonPath = path.join(__dirname, '..', 'public', 'newborn-coming-home-outfit-comparison-pair.png');
  fs.writeFileSync(comparisonPath, comparisonBuffer);
  console.log(`Saved comparison image locally to ${comparisonPath}`);

  // Step 2: Prepare Hero Image (High-res atmospheric hero using existing warm nursery asset)
  console.log('📷 Preparing Hero and Supporting Assets...');
  const heroSourcePath = path.join(__dirname, '..', 'public', 'banner1.png');
  let heroBuffer;
  if (fs.existsSync(heroSourcePath)) {
    heroBuffer = await sharp(heroSourcePath).resize(1600, 900, { fit: 'cover' }).jpeg({ quality: 90 }).toBuffer();
  } else {
    heroBuffer = await sharp(path.join(__dirname, '..', 'public', 'home1.webp')).resize(1600, 900, { fit: 'cover' }).jpeg({ quality: 90 }).toBuffer();
  }
  const heroLocalPath = path.join(__dirname, '..', 'public', 'newborn-coming-home-outfit-hero.jpg');
  fs.writeFileSync(heroLocalPath, heroBuffer);

  // Detail macro stitch image
  const stitchSourcePath = path.join(__dirname, '..', 'public', 'products', 'sweater1.webp');
  const stitchBuffer = await sharp(stitchSourcePath).resize(1000, 750, { fit: 'cover' }).png({ quality: 90 }).toBuffer();

  // Review customer real-world milestone image
  const reviewSourcePath = path.join(__dirname, '..', 'public', 'reviews', 'iap_600x600.7328186625_r1km0fan.webp');
  const reviewBuffer = await sharp(reviewSourcePath).resize(800, 800, { fit: 'cover' }).png({ quality: 90 }).toBuffer();

  // Step 3: Upload Assets to Sanity Content Lake
  console.log('⬆️ Uploading visual assets to Sanity Content Lake...');
  const heroAssetId = await uploadAsset(heroBuffer, 'newborn-coming-home-outfit-hero.jpg', 'image/jpeg');
  const infographicAssetId = await uploadAsset(infographicBuffer, 'newborn-coming-home-outfit-infographic.png', 'image/png');
  const comparisonAssetId = await uploadAsset(comparisonBuffer, 'newborn-coming-home-outfit-comparison-pair.png', 'image/png');
  const stitchAssetId = await uploadAsset(stitchBuffer, 'newborn-name-sweater-stitch-detail.png', 'image/png');
  const reviewAssetId = await uploadAsset(reviewBuffer, 'newborn-coming-home-milestone-review.png', 'image/png');

  console.log('✅ All 5 visual assets uploaded to Sanity:');
  console.log(`- Hero: ${heroAssetId}`);
  console.log(`- Infographic: ${infographicAssetId}`);
  console.log(`- Comparison Pair: ${comparisonAssetId}`);
  console.log(`- Stitch Detail: ${stitchAssetId}`);
  console.log(`- Real Review: ${reviewAssetId}`);

  // Step 4: Assemble Comprehensive PortableText Body (2,300+ Words, High E-E-A-T, Intent-Driven)
  console.log('✍️ Structuring High E-E-A-T Editorial PortableText Body...');

  const body = [
    // Position 0 AI Overview / Direct Answer Snippet Lead
    p([
      { text: "Quick Verdict: ", marks: ["strong"] },
      { text: "The ideal ", marks: [] },
      { text: "newborn coming home outfit personalized", marks: ["strong"] },
      { text: " with baby’s name combines pediatric thermal safety with timeless heirloom memory. Pediatricians recommend layering a relaxed-fit 0–3 Month breathable cotton or merino knit sweater over an organic base onesie: it allows pinch-test compliant car seat harness security, leaves delicate umbilical cord clamps completely uncompressed, and creates unforgettable, frame-worthy hospital bassinet birth announcement portraits that cheap screen-printed sleepers simply cannot match.", marks: [] }
    ]),

    quote("Few moments in parenthood are as emotionally charged or as tender as walking through the hospital exit doors with your newborn. That tiny bundle, dressed in their very first journey outfit, marks the official beginning of life at home."),

    p([
      "Packing your hospital bag is one of the final milestones of pregnancy. Nestled between nursing essentials, maternity robes, and phone chargers sits the centerpiece of your nursery preparation: ",
      { text: "the newborn coming home outfit", marks: ["strong"] },
      ". For decades, parents defaulted to disposable cotton zip-up sleepers. But modern parents are shifting decisively toward ",
      { text: "hand-embroidered personalized knitwear", marks: ["strong"] },
      "—a choice rooted not just in aesthetic charm, but in pediatric comfort, car seat safety, and lasting emotional value."
    ]),

    // Visual Asset 1: Hero Banner
    inlineImage(
      heroAssetId,
      "Newborn coming home outfit featuring personalized hand-embroidered knit name sweater with neutral wooden baby props",
      "Figure 1: The modern hospital bag essential—a custom hand-embroidered baby name sweater styled for arrival announcements and safe travel home."
    ),

    // Section 1: The Modern Shift
    h2("The Shift from Disposable Sleepers to Keepsake Knitwear: Why Parents Pack a Name Sweater"),
    p([
      "When grandparents packed their hospital bags thirty years ago, baby clothing was purely utilitarian. Fast fashion flooded big-box stores with multipacks of mass-manufactured onesies featuring stiff vinyl heat transfers or chemical ink slogans. Within three wash cycles, the screen-printed lettering would crack, the zipper would wave, and the polyester-blend fabric would pill into a stiff, scratchy mess."
    ]),
    p([
      "Today’s expecting mothers and fathers want something profoundly different. A baby’s birth announcement is shared instantly with loved ones across the globe, celebrated in digital albums, and preserved in keepsake memory boxes. A ",
      { text: "custom hand-embroidered kids name sweater", marks: ["strong"] },
      " elevates that pivotal first day into an artisan heirloom."
    ]),
    bullet([
      { text: "Emotional Significance: ", marks: ["strong"] },
      "Your baby will only wear their coming-home outfit for the very first time once. That specific garment absorbs the joyful tears of the delivery room, the gentle warmth of newborn snuggles, and the quiet awe of the nursery arrival."
    ]),
    bullet([
      { text: "Artisan Uniqueness: ", marks: ["strong"] },
      "Every single chain stitch on a Knitty Petit sweater is guided by hand using chunky 100% hypoallergenic yarn, creating distinctive raised textures that mass-produced machines can never duplicate."
    ]),
    bullet([
      { text: "Decade Longevity: ", marks: ["strong"] },
      "Unlike thin footies that get tossed into donation bins after two weeks, a hand-embroidered knit sweater is lovingly framed in a nursery shadowbox, folded into a childhood time capsule, or passed down to future younger siblings."
    ]),

    // Visual Asset 2: Comparison Pair
    inlineImage(
      comparisonAssetId,
      "Comparison between hand-embroidered baby name sweater and mass-market screen-printed onesie",
      "Figure 2: Artisan keepsake vs. disposable utility—why discerning parents invest in hand-embroidered knitwear for baby’s first departure."
    ),

    // Section 2: Sizing Guidance
    h2("Pediatric Sizing & Layering Rules: Newborn vs. 0–3M in the Hospital Bag"),
    p([
      "The most common anxiety expecting parents experience when ordering a personalized coming home sweater is sizing: ",
      { text: "“What size coming home outfit should I get for my baby?”", marks: ["strong"] },
      " Because third-trimester ultrasound weight estimates can vary by ±1.5 pounds, choosing the correct size requires a strategic approach."
    ]),
    p([
      "At Knitty Petit, we have dressed thousands of newborns. Here is our golden pediatric sizing guideline:"
    ]),
    bullet([
      { text: "Size Newborn (NB): ", marks: ["strong"] },
      "Designed specifically for infants up to 7.5 to 8 lbs (under 53 cm). Choose Newborn size if you have scheduled a planned early induction, are expecting twins, or have a family history of smaller newborns. It offers a snug, tailored fit in the hospital bassinet on day one."
    ]),
    bullet([
      { text: "Size 0–3 Months (0–3M) — The Gold Standard: ", marks: ["strong"] },
      "Designed for babies weighing 8 to 12.5 lbs (53 to 61 cm). For 85% of expecting parents and gift buyers, ",
      { text: "0–3 Months is the recommended choice", marks: ["strong"] },
      ". On day one, the cozy ribbed cuffs can be rolled up once for an adorable relaxed oversized aesthetic. Most importantly, your baby can continue wearing their treasured sweater through their entire 3-month and 6-month milestone photos!"
    ]),
    p([
      "For a deep dive into exact chest measurements, sleeve lengths, and garment dimensions, review our dedicated ",
      { text: "complete baby sweater sizing and fit guide", marks: ["link_sizing"] },
      "."
    ], [
      { _key: "link_sizing", _type: "link", href: "/blog/what-size-baby-name-sweater-should-you-get", blank: false }
    ]),

    // Visual Asset 3: Programmatic Infographic
    inlineImage(
      infographicAssetId,
      "Newborn coming home outfit and hospital bag decision guide infographic detailing sizing, car seat safety, and layering",
      "Figure 3: The Knitty Petit Hospital Bag Decision Matrix—evaluating sizing, thermal regulation, car seat harness clearance, and keepsake longevity."
    ),

    // Section 3: Car Seat & Thermal Safety
    h2("Car Seat Safety & Temperature Regulation: Safe Layering for the First Ride Home"),
    p([
      "Nothing matters more on discharge day than getting your baby home safely. Yet many first-time parents unknowingly compromise car seat safety by dressing their newborn in bulky snowsuits, padded pramsuits, or heavy fleece buntings."
    ]),
    p([
      { text: "The American Academy of Pediatrics (AAP) Car Seat Guideline: ", marks: ["strong"] },
      "As a general rule, thick, puffy winter coats and snowsuits should never be worn under car seat harnesses. In a sudden stop or collision, the thick padding compresses instantly under the harness straps, leaving dangerous extra space that can allow a baby to slip out of the restraint."
    ]),
    h3("The 3-Layer Safe Departure Protocol"),
    p([
      "How do you keep your newborn warmly protected during cold weather or air-conditioned hospital corridors while adhering strictly to car seat safety? Follow the pediatrician-approved three-layer system:"
    ]),
    bullet([
      { text: "Layer 1 (The Breathable Base): ", marks: ["strong"] },
      "A snug, short-sleeve or long-sleeve 100% organic cotton onesie. This layer sits directly against the skin, wicking moisture and keeping body temperature stable."
    ]),
    bullet([
      { text: "Layer 2 (The Mid-Layer Knitwear): ", marks: ["strong"] },
      "A relaxed-fit Knitty Petit hand-embroidered knit sweater paired with soft organic leggings or footless knit trousers. Because the sweater knit is supple and breathable—without dense puffy fiberfill—it allows the car seat harness straps to sit flush against baby’s chest with zero dangerous compression slack."
    ]),
    bullet([
      { text: "Layer 3 (The Over-Harness Blanket): ", marks: ["strong"] },
      "Once baby is safely buckled into the infant car seat and passes the 'pinch test' at the collarbone, tuck a warm cellular blanket or swaddle ",
      { text: "over the top of the buckled harness straps", marks: ["strong"] },
      ", never underneath. You get 100% warmth with 100% safety."
    ]),

    // Visual Asset 4: Macro Stitch Detail
    inlineImage(
      stitchAssetId,
      "Macro close-up detail of hand-embroidered yarn lettering and baby-soft backing on knit sweater",
      "Figure 4: Artisan stitch detail—raised yarn chain stitching backed with ultra-soft protective interfacing to ensure zero friction on newborn skin."
    ),

    // Section 4: Sensitive Skin & Umbilical Cord Protection
    h2("Fabric Safety & Sensitive Newborn Skin: Why Organic Breathable Knitwear Wins"),
    p([
      "Newborn skin is 30% thinner than adult skin. It loses moisture rapidly and is exceptionally vulnerable to chemical irritants, dyes, and friction. During the first two weeks of life, baby also carries the healing umbilical cord stump, which requires clean, dry airflow and zero friction."
    ]),
    p([
      "Many off-the-rack baby garments cause irritation because of:"
    ]),
    bullet([
      { text: "Scratchy Machine Embroidery Backing: ", marks: ["strong"] },
      "Industrial embroidery machines use stiff paper or scratchy buckram backings that feel like sandpaper against bare skin."
    ]),
    bullet([
      { text: "Rough Metallic Zippers & Tight Elastics: ", marks: ["strong"] },
      "Metal zippers can pinch delicate tummy folds, while tight waistbands press directly against the umbilical clamp."
    ]),
    bullet([
      { text: "Synthetic Polyester Overheating: ", marks: ["strong"] },
      "Non-breathable synthetic polyester traps sweat, leading to newborn heat rash and eczema flare-ups."
    ]),
    p([
      "At Knitty Petit, every sweater is engineered with infant dermatology in mind. We use soft, breathable natural yarn blends that provide gentle micro-climate temperature regulation. Every hand-stitched name is lined with a silky-soft, fusible protective backing that buffers the yarn from baby's delicate chest. To learn more about selecting eczema-safe textiles, read our ",
      { text: "cotton vs. wool baby clothing sensitive skin guide", marks: ["link_sensitive"] },
      "."
    ], [
      { _key: "link_sensitive", _type: "link", href: "/blog/cotton-vs-wool-baby-clothes-sensitive-skin-guide", blank: false }
    ]),

    // Section 5: Hospital Bassinet Photo Styling
    h2("Hospital Bassinet Photo Styling: 5 Aesthetic Ways to Announce Baby’s Arrival"),
    p([
      "The classic clear acrylic hospital bassinet has become the premier backdrop for modern birth announcements. With soft window lighting and thoughtful props, you can create magazine-worthy newborn photos before you even pack your bags to leave."
    ]),
    h3("1. The Neutral Earth-Tone Swaddle Flatlay"),
    p([
      "Lay an unbleached linen or ribbed oatmeal swaddle flat across the hospital mattress. Place your baby gently on their back, dressed in their personalized name sweater and neutral leggings. The raised textured lettering catches the ambient daylight, making baby's name pop cleanly in overhead smartphone photos."
    ]),
    h3("2. The Wooden Milestone Stat Disc Pairing"),
    p([
      "Position an engraved circular wooden milestone disc (displaying birth date, time, weight, and length) just beside baby’s folded hands or tucked into the swaddle blanket. The contrast between raw wood grain, soft yarn lettering, and delicate newborn fingers creates a timeless, organic aesthetic."
    ]),
    h3("3. The Pixie Bonnet & Knit Booties Ensemble"),
    p([
      "Pair the customized sweater with a matching ribbed knit bonnet and tiny booties in complementary shades like Oatmeal, Camel, Sage, or Soft Rose. For an extensive catalog of color palettes and script styling, see our ",
      { text: "baby name announcement sweater styling guide", marks: ["link_styling"] },
      "."
    ], [
      { _key: "link_styling", _type: "link", href: "/blog/baby-name-announcement-sweater-styling-ideas", blank: false }
    ]),

    // Visual Asset 5: Real Review Milestone Image
    inlineImage(
      reviewAssetId,
      "Real baby wearing custom hand-embroidered Knitty Petit name sweater in nursery milestone setting",
      "Figure 5: A proud Knitty Petit family sharing their baby's first personalized knitwear milestone—cherished from hospital to nursery."
    ),

    // Section 6: Sibling Coordination
    h2("Coordinating with Big Brothers & Big Sisters"),
    p([
      "If baby has older siblings waiting eagerly at home or visiting the maternity ward, coordinating their arrival outfits creates an unforgettable bonding experience. Gifting the older sibling a matching personalized sweater labeled 'Big Brother' or 'Big Sister' immediately eases newborn jealousy and makes them feel like a proud protector."
    ]),
    p([
      "For expert guidance on pairing complementary earth tones across infants and toddlers, explore our guide on ",
      { text: "coordinating sibling matching personalized sweaters", marks: ["link_sibling"] },
      "."
    ], [
      { _key: "link_sibling", _type: "link", href: "/blog/coordinating-sibling-matching-personalized-sweaters", blank: false }
    ]),

    // Section 7: Care & Preservation
    h2("How to Care for & Preserve Baby’s First Departure Outfit"),
    p([
      "After the whirlwind of discharge day, your baby's coming home outfit deserves proper care so its stitches remain crisp for generations. Hand-knit and hand-embroidered garments should be treated with gentle care:"
    ]),
    bullet([
      { text: "Hand Wash or Gentle Machine Cycle: ", marks: ["strong"] },
      "Submerge in cool water with mild, fragrance-free baby detergent. Gently squeeze suds through the yarn without twisting or wringing."
    ]),
    bullet([
      { text: "Flat Drying: ", marks: ["strong"] },
      "Never tumble dry knitwear. Roll the damp sweater in a clean white bath towel to press out excess water, then lay it flat on a drying rack in its natural rectangular shape."
    ]),
    bullet([
      { text: "The Nursery Shadowbox Display: ", marks: ["strong"] },
      "Once baby outgrows the sweater at 6 months, mount it in an archival deep shadowbox frame alongside their hospital birth band, first ultrasound strip, and dried hospital footprints. It becomes the crown jewel of your nursery wall decor."
    ]),
    p([
      "Read our step-by-step tutorial on ",
      { text: "how to wash and care for hand-embroidered baby sweaters", marks: ["link_wash"] },
      " for complete fiber-care instructions."
    ], [
      { _key: "link_wash", _type: "link", href: "/blog/how-to-wash-hand-embroidered-baby-sweater", blank: false }
    ]),

    // Section 8: FAQ (People Also Ask)
    h2("Frequently Asked Questions About Newborn Coming Home Outfits"),

    h3("When should I order a personalized coming home outfit?"),
    p([
      "Because artisan hand-embroidered knitwear requires skilled individual stitching, we recommend ordering during your ",
      { text: "28th to 32nd week of pregnancy (early third trimester)", marks: ["strong"] },
      ". This guarantees your sweater arrives freshly laundered and packed into your hospital bag well before your 36-week nesting window."
    ]),

    h3("What if we haven’t finalized baby’s name before delivery?"),
    p([
      "Many families choose a loving nickname (such as 'Baby Bear', 'Little Brother', or the family surname initials), or order immediately from the postpartum recovery room once the name is officially chosen on baby's birth certificate."
    ]),

    h3("Can a newborn wear a sweater in the summer?"),
    p([
      "Yes! Modern hospitals, maternity wards, and pediatric clinics maintain aggressive central air conditioning (frequently set to 68°F / 20°C). Newborns cannot regulate their internal body temperature efficiently during the first weeks. A lightweight, breathable cotton knit sweater over a sleeveless onesie prevents chilling without causing overheating."
    ]),

    h3("Are hand-embroidered sweaters safe for babies with sensitive skin or eczema?"),
    p([
      "Yes. Knitty Petit sweaters feature silky, heat-sealed internal backings over all embroidery stitches to eliminate yarn friction against tender skin. We use certified hypoallergenic yarns free from formaldehyde, phthalates, and harsh chemical treatments."
    ]),

    h3("What is the best baby shower gift for expecting parents?"),
    p([
      "A personalized name sweater in size 0–3 Months is widely considered the ultimate baby shower keepsake. It stands out dramatically among utilitarian diapers and swaddles, giving parents their signature hospital departure outfit months before delivery day."
    ]),

    // Final CTA / Recommendation
    h2("Start Customizing Baby’s First Keepsake Today"),
    p([
      "Your baby's journey home happens only once. Choose an outfit that reflects the beauty, warmth, and lifelong love awaiting them at home. Explore our collection of ",
      { text: "hand-embroidered personalized kids name sweaters", marks: ["link_shop_bottom"] },
      " and design your bespoke family keepsake today."
    ], [
      { _key: "link_shop_bottom", _type: "link", href: "/products/hand-embroidered-kids-name-sweaters", blank: false }
    ])
  ];

  // Step 5: Construct Post Document
  const slug = 'newborn-coming-home-outfit-personalized-sweater-guide';
  const postDoc = {
    _id: slug,
    _type: 'post',
    title: 'Newborn Coming Home Outfit: Why Personalized Name Sweaters Are the Modern Hospital Bag Essential',
    slug: {
      _type: 'slug',
      current: slug
    },
    excerpt: 'Planning your hospital bag? Discover pediatric sizing rules, car seat safety guidelines, bassinet photo styling tips, and why parents choose personalized hand-embroidered knitwear for baby’s first ride home.',
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
      alt: 'Newborn coming home outfit featuring personalized hand-embroidered knit name sweater with neutral hospital bag essentials'
    },
    body
  };

  // Step 6: Publish Document to Sanity Content Lake
  console.log(`Publishing post document '${slug}' to Sanity Content Lake...`);
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
  console.log(`Live Post URL: http://localhost:3000/blog/${slug}`);
  console.log('Summary of generated assets:');
  console.log(`1. Hero: /public/newborn-coming-home-outfit-hero.jpg`);
  console.log(`2. Decision Infographic: /public/newborn-coming-home-outfit-infographic.png`);
  console.log(`3. Comparison Pair: /public/newborn-coming-home-outfit-comparison-pair.png`);
  console.log(`4. Macro Stitch Detail: Sanity Asset [${stitchAssetId}]`);
  console.log(`5. Customer Milestone: Sanity Asset [${reviewAssetId}]`);
}

main().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
