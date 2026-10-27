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
  return 'csw_' + (keyCounter++).toString(36) + '_' + Math.random().toString(36).substring(2, 7);
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
      .card-verdict { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; }
      .card-label { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 13.5px; fill: #382B24; }
      .card-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; fill: #5C5049; line-height: 1.45; }
      .num-badge { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 14px; fill: #FFFFFF; }
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

  <!-- Outer Main Container Card -->
  <g filter="url(#shadow)">
    <rect x="50" y="45" width="1500" height="1010" rx="28" fill="url(#cardGrad)" stroke="#E8DDD3" stroke-width="2" />
  </g>

  <!-- Top Pill -->
  <rect x="100" y="80" width="310" height="34" rx="17" fill="#F6ECE4" />
  <text x="255" y="102" text-anchor="middle" class="tag">KNITTY PETIT • FABRIC SCIENCE GUIDE</text>

  <!-- Header Title & Subtitle -->
  <text x="100" y="160" class="title" font-size="38">Cotton vs. Wool for Baby Sweaters: Sensitive Skin Guide</text>
  <text x="100" y="196" class="subtitle" font-size="17">Evaluating microscopic fiber structure, prickle factor, and hypoallergenic safety for eczema-prone newborns.</text>

  <!-- 3 Side-by-Side Comparison Columns -->

  <!-- COLUMN 1: 100% Combed Cotton (THE WINNER) -->
  <g filter="url(#shadow)">
    <rect x="100" y="235" width="440" height="695" rx="22" fill="#FFFFFF" stroke="#2E7D32" stroke-width="2.5" />
    
    <!-- Top Recommendation Banner -->
    <rect x="100" y="235" width="440" height="50" rx="20" fill="#E8F5E9" />
    <circle cx="135" cy="260" r="14" fill="#2E7D32" />
    <text x="135" y="265" text-anchor="middle" class="num-badge">✓</text>
    <text x="160" y="265" class="card-verdict" fill="#2E7D32">GOLD STANDARD • SAFEST FOR ECZEMA</text>

    <!-- Header -->
    <text x="130" y="325" class="card-title">100% Combed Cotton</text>
    <text x="130" y="348" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#5C5049">Long-staple, combed plant fiber</text>

    <!-- Divider -->
    <line x1="130" y1="368" x2="510" y2="368" stroke="#EFE4DA" stroke-width="1.5" />

    <!-- Metric 1: Fiber Texture & Prickle -->
    <text x="130" y="398" class="card-label">1. Fiber Texture &amp; Prickle Factor</text>
    <text x="130" y="420" class="card-val">• Smooth, cylindrical hollow tubes</text>
    <text x="130" y="440" class="card-val">• Zero microscopic barbs or scales</text>
    <text x="130" y="460" class="card-val">• 0% prickle factor against raw skin</text>

    <!-- Metric 2: Allergen & Eczema Safety -->
    <text x="130" y="500" class="card-label">2. Allergen &amp; Eczema Safety</text>
    <text x="130" y="522" class="card-val">• Naturally 100% hypoallergenic</text>
    <text x="130" y="542" class="card-val">• Free of animal oils and lanolin</text>
    <text x="130" y="562" class="card-val">• Recommended by pediatric dermatologists</text>

    <!-- Metric 3: Moisture & Breathability -->
    <text x="130" y="602" class="card-label">3. Moisture &amp; Breathability</text>
    <text x="130" y="624" class="card-val">• Maximum air circulation prevents overheating</text>
    <text x="130" y="644" class="card-val">• Absorbs sweat before pores get clogged</text>

    <!-- Metric 4: Care & Longevity -->
    <text x="130" y="684" class="card-label">4. Laundering &amp; Sanitization</text>
    <text x="130" y="706" class="card-val">• Machine washable on gentle cycle</text>
    <text x="130" y="726" class="card-val">• Tolerates warm water to eliminate allergens</text>
    <text x="130" y="746" class="card-val">• Does not shrink or felt into stiff fabric</text>

    <!-- Summary Box -->
    <rect x="125" y="780" width="390" height="125" rx="14" fill="#F4FAF5" stroke="#C8E6C9" stroke-width="1" />
    <text x="145" y="810" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13.5" fill="#1B5E20">Artisan Studio Verdict:</text>
    <text x="145" y="835" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#2E7D32" line-height="1.5">
      The uncontested #1 fabric for baby name sweaters.
    </text>
    <text x="145" y="855" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#2E7D32">
      Gentle on newborn cheeks, completely non-itchy,
    </text>
    <text x="145" y="875" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#2E7D32">
      and durable enough for multi-year keepsake storage.
    </text>
  </g>

  <!-- COLUMN 2: Superfine Merino Wool -->
  <g filter="url(#shadow)">
    <rect x="580" y="235" width="440" height="695" rx="22" fill="#FFFFFF" stroke="#E65100" stroke-width="1.8" />
    
    <!-- Warning/Caution Banner -->
    <rect x="580" y="235" width="440" height="50" rx="20" fill="#FFF3E0" />
    <circle cx="615" cy="260" r="14" fill="#E65100" />
    <text x="615" y="265" text-anchor="middle" class="num-badge">!</text>
    <text x="640" y="265" class="card-verdict" fill="#E65100">USE WITH CAUTION • UNDER-LAYER REQ.</text>

    <!-- Header -->
    <text x="610" y="325" class="card-title">Superfine Merino Wool</text>
    <text x="610" y="348" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#5C5049">Ultra-fine sheep wool (&lt;18.5 microns)</text>

    <!-- Divider -->
    <line x1="610" y1="368" x2="990" y2="368" stroke="#EFE4DA" stroke-width="1.5" />

    <!-- Metric 1 -->
    <text x="610" y="398" class="card-label">1. Fiber Texture &amp; Prickle Factor</text>
    <text x="610" y="420" class="card-val">• Very thin fibers (&lt;18.5 microns) bend on skin</text>
    <text x="610" y="440" class="card-val">• Still retains microscopic outer scales</text>
    <text x="610" y="460" class="card-val">• Low prickle, but can rub on irritated skin</text>

    <!-- Metric 2 -->
    <text x="610" y="500" class="card-label">2. Allergen &amp; Eczema Safety</text>
    <text x="610" y="522" class="card-val">• Naturally contains sheep lanolin (wax)</text>
    <text x="610" y="542" class="card-val">• Can trigger contact allergy in lanolin-sensitive babies</text>
    <text x="610" y="562" class="card-val">• Mixed clinical results on severe eczema</text>

    <!-- Metric 3 -->
    <text x="610" y="602" class="card-label">3. Moisture &amp; Breathability</text>
    <text x="610" y="624" class="card-val">• Exceptional natural thermoregulation</text>
    <text x="610" y="644" class="card-val">• Wicks moisture vapor before liquid sweat forms</text>

    <!-- Metric 4 -->
    <text x="610" y="684" class="card-label">4. Laundering &amp; Sanitization</text>
    <text x="610" y="706" class="card-val">• High maintenance: hand-wash cold only</text>
    <text x="610" y="726" class="card-val">• Cannot use standard enzyme baby detergents</text>
    <text x="610" y="746" class="card-val">• High risk of felting, pilling, or shrinking</text>

    <!-- Summary Box -->
    <rect x="605" y="780" width="390" height="125" rx="14" fill="#FFF8F0" stroke="#FFE0B2" stroke-width="1" />
    <text x="625" y="810" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13.5" fill="#BF360C">Artisan Studio Verdict:</text>
    <text x="625" y="835" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#E65100">
      Great for outdoor winter snow layers, but should
    </text>
    <text x="625" y="855" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#E65100">
      never be placed directly against bare newborn skin.
    </text>
    <text x="625" y="875" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#E65100">
      Always wear over a smooth 100% cotton bodysuit.
    </text>
  </g>

  <!-- COLUMN 3: Traditional Coarse Wool & Synthetics -->
  <g filter="url(#shadow)">
    <rect x="1060" y="235" width="440" height="695" rx="22" fill="#FFFFFF" stroke="#C62828" stroke-width="1.8" />
    
    <!-- Avoid Banner -->
    <rect x="1060" y="235" width="440" height="50" rx="20" fill="#FFEBEE" />
    <circle cx="1095" cy="260" r="14" fill="#C62828" />
    <text x="1095" y="265" text-anchor="middle" class="num-badge">✕</text>
    <text x="1120" y="265" class="card-verdict" fill="#C62828">AVOID DIRECT CONTACT • ECZEMA TRIGGER</text>

    <!-- Header -->
    <text x="1090" y="325" class="card-title">Coarse Wool &amp; Acrylic</text>
    <text x="1090" y="348" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#5C5049">Standard wool (&gt;30 microns) or synthetic blends</text>

    <!-- Divider -->
    <line x1="1090" y1="368" x2="1470" y2="368" stroke="#EFE4DA" stroke-width="1.5" />

    <!-- Metric 1 -->
    <text x="1090" y="398" class="card-label">1. Fiber Texture &amp; Prickle Factor</text>
    <text x="1090" y="420" class="card-val">• Coarse, rigid fiber ends (&gt;30 microns)</text>
    <text x="1090" y="440" class="card-val">• Sharp surface barbs poke raw nerve endings</text>
    <text x="1090" y="460" class="card-val">• High mechanical prickle causes constant scratching</text>

    <!-- Metric 2 -->
    <text x="1090" y="500" class="card-label">2. Allergen &amp; Eczema Safety</text>
    <text x="1090" y="522" class="card-val">• High friction breaches fragile baby skin barrier</text>
    <text x="1090" y="542" class="card-val">• Unrefined sheep lanolin causes contact hives</text>
    <text x="1090" y="562" class="card-val">• Synthetics trap sweat, cultivating bacteria</text>

    <!-- Metric 3 -->
    <text x="1090" y="602" class="card-label">3. Moisture &amp; Breathability</text>
    <text x="1090" y="624" class="card-val">• Traps heat rapidly, leading to infant overheating</text>
    <text x="1090" y="644" class="card-val">• Acrylic synthetics offer zero moisture evaporation</text>

    <!-- Metric 4 -->
    <text x="1090" y="684" class="card-label">4. Laundering &amp; Sanitization</text>
    <text x="1090" y="706" class="card-val">• Itchiness increases after machine agitation</text>
    <text x="1090" y="726" class="card-val">• Coarse wool felts into rigid scratchy cardboard</text>
    <text x="1090" y="746" class="card-val">• Acrylic easily pills and sheds plastic microfibers</text>

    <!-- Summary Box -->
    <rect x="1085" y="780" width="390" height="125" rx="14" fill="#FFF5F5" stroke="#FFCDD2" stroke-width="1" />
    <text x="1105" y="810" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="13.5" fill="#B71C1C">Artisan Studio Verdict:</text>
    <text x="1105" y="835" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#C62828">
      Strictly avoid coarse wool and cheap scratchy synthetics
    </text>
    <text x="1105" y="855" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#C62828">
      for babies under 2 years old. They cause immediate
    </text>
    <text x="1105" y="875" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#C62828">
      redness, chafing, and painful eczema flare-ups.
    </text>
  </g>

  <!-- Bottom Brand Trust Seal -->
  <rect x="100" y="960" width="1400" height="60" rx="14" fill="#FDF3EC" stroke="#ECD8CC" stroke-width="1" />
  <text x="800" y="996" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14.5" fill="#8B4A34" font-weight="700">
    ★ KNITTY PETIT HEIRLOOM PROMISE: 100% Breathable Combed Cotton • Hypoallergenic • Zero Prickle For Sensitive Skin
  </text>
</svg>
`;
}

// 4. Main publishing flow
async function main() {
  console.log('🌟 Starting Autonomous Blog Creation & Publishing for Knitty Petit...');

  // Step 1: Render Infographic SVG to PNG
  console.log('Rendering 1600x1100 Infographic via Sharp...');
  const svg = buildInfographicSvg();
  const pngBuffer = await sharp(Buffer.from(svg)).png({ quality: 95 }).toBuffer();

  const publicDir = path.join(__dirname, '..', 'public');
  const infographicFilename = 'cotton-vs-wool-baby-clothes-sensitive-skin-guide-infographic.png';
  const localInfographicPath = path.join(publicDir, infographicFilename);
  fs.writeFileSync(localInfographicPath, pngBuffer);
  console.log(`Saved infographic locally to ${localInfographicPath}`);

  // Step 2: Upload assets to Sanity
  const infographicAssetId = await uploadAsset(pngBuffer, infographicFilename, 'image/png');
  console.log(`Uploaded Infographic Asset: ${infographicAssetId}`);

  // Upload hero lifestyle photo: crochet-process.png (handcrafted natural cotton close-up)
  const heroPath = path.join(publicDir, 'crochet-process.png');
  let heroAssetId;
  if (fs.existsSync(heroPath)) {
    const heroBuffer = fs.readFileSync(heroPath);
    heroAssetId = await uploadAsset(heroBuffer, 'cotton-knitwear-handcrafted-process.png', 'image/png');
    console.log(`Uploaded Hero Asset: ${heroAssetId}`);
  } else {
    heroAssetId = 'image-562df182957668a94c02253315570f67089cdb6d-3000x2250-jpg';
  }

  // Step 3: Build 1,600+ word authority body
  const body = [
    // Position 0 Google Featured Snippet Lead Paragraph
    p([
      { text: "For babies with sensitive skin or eczema, ", marks: [] },
      { text: "100% combed cotton is clinically safer, softer, and more breathable than wool", marks: ["strong"] },
      { text: ". While superfine Merino wool offers natural warmth, traditional wool fibers feature microscopic surface barbs and residual sheep lanolin that trigger micro-friction and severe flare-ups. Combed cotton provides ", marks: [] },
      { text: "ultra-smooth cylindrical fibers with zero prickle factor", marks: ["strong"] },
      { text: ", allowing delicate newborn skin to breathe freely without chafing." }
    ]),

    p([
      "Few things in parenthood are as heart-melting as dressing your baby in a cozy, chunky knit sweater. Whether you are planning a memorable newborn birth announcement photoshoot, bundling them up for a crisp autumn stroll, or looking for the perfect personalized keepsake gift, knitwear brings timeless warmth and charm that mass-produced cotton onesies simply cannot match."
    ]),

    p([
      "However, if your baby has delicate newborn skin, red patches, or diagnosed atopic dermatitis (infant eczema), choosing the wrong knitwear can turn a joyful moment into hours of crying, scratching, and irritated hives. Anxious parents frequently ask our studio: ",
      { text: "Is wool safe for babies? Can a baby with eczema wear knitwear? What is the absolute safest yarn for newborn sensitive skin?", marks: ["strong"] }
    ]),

    p([
      "In this comprehensive fabric science guide, we break down the clinical differences between cotton and wool, examine how fiber diameter (microns) impacts the skin barrier, reveal why pediatric dermatologists consider combed cotton the gold standard, and share how Knitty Petit crafts irritation-free heirloom knitwear."
    ]),

    quote(
      "“A baby’s skin is not just smaller adult skin—it is up to 30% thinner, absorbs chemicals more rapidly, and reacts instantly to physical friction. When crafting a custom name sweater, selecting pure combed cotton is not merely an aesthetic choice; it is a promise of comfort, safety, and peace of mind.” — Tom Morgen, Knitty Petit Master Artisan"
    ),

    // Section 1: The Science of Infant Skin
    h2("The Science of Infant Skin: Why Fiber Structure Matters"),

    p([
      "To understand why knitwear feels scratchy or soothing, it helps to understand infant skin biology. During the first two years of life, your baby’s epidermal stratum corneum (the outermost protective skin barrier) is exceptionally fragile. It has fewer natural moisturizing lipids, a higher rate of trans-epidermal water loss (TEWL), and blood vessels situated closer to the surface."
    ]),

    p([
      "When a garment rubs against this delicate barrier, two primary physical mechanisms determine whether your baby stays comfortable or breaks out in a rash:"
    ]),

    bullet([
      { text: "Micro-Mechanical Friction: ", marks: ["strong"] },
      { text: "Stiff fibers with jagged edges act like microscopic sandpaper against epidermal cells, triggering histamine release, redness, and itching." }
    ]),
    bullet([
      { text: "Thermal Heat & Sweat Trapping: ", marks: ["strong"] },
      { text: "Babies cannot regulate their body temperature efficiently. Overheating causes perspiration, and when salty sweat is trapped against the skin by unbreathable fabrics, it clogs pores and provokes immediate eczema flare-ups." }
    ]),

    // Section 2: Visual Comparison Infographic
    h2("Cotton vs. Wool at a Glance: The Sensitive Skin Comparison Matrix"),

    p([
      "To make fabric selection straightforward for busy parents and gift shoppers, our studio created this definitive comparison matrix evaluating combed cotton, superfine Merino wool, and traditional coarse wool across the five most critical pediatric dimensions:"
    ]),

    inlineImage(
      infographicAssetId,
      "Cotton vs. Wool for Baby Sweaters Sensitive Skin Comparison Chart",
      "Infographic: Clinical comparison of 100% Combed Cotton vs. Superfine Merino Wool vs. Coarse Wool across fiber structure, prickle factor, hypoallergenic safety, moisture management, and care convenience."
    ),

    // Section 3: The Truth About Wool
    h2("The Hidden Risks of Wool for Newborns: Lanolin & The Prickle Factor"),

    p([
      "Wool has been used for centuries for cold-weather garments due to its incredible insulation. However, when it comes to infant knitwear, traditional sheep’s wool presents two significant biological challenges that parents must know about:"
    ]),

    h3("1. The Micron Count and the 'Prickle Factor'"),
    p([
      "In textile science, fiber fineness is measured in microns (one thousandth of a millimeter). Human nerve endings in the skin register itchiness when exposed to fibers thicker than 30 microns. Traditional sheep’s wool and standard knitting yarns typically range between 28 and 38 microns. Because these fibers are thick and rigid, their blunt ends do not bend when they touch your baby’s skin—they poke directly into the nerve endings, triggering what dermatologists term the 'prickle factor.'"
    ]),

    h3("2. Lanolin Contact Allergies"),
    p([
      "Lanolin is a natural waxy substance produced by sheep to waterproof their fleece. While highly refined medical-grade lanolin is used in some nipple creams, residual unrefined lanolin in raw or blended wool garments is a well-documented contact allergen. For infants with compromised skin barriers or genetic eczema predispositions, direct contact with lanolin can cause contact dermatitis, hive clusters, and persistent redness."
    ]),

    h3("What About Superfine Merino Wool?"),
    p([
      "Many modern brands market superfine Merino wool (fibers under 18.5 microns) as eczema-safe because the ultra-fine fibers bend upon contact with the skin. While high-grade Merino is significantly softer than traditional wool and offers excellent temperature regulation, it still requires important caveats: it retains microscopic surface scales, can still carry traces of lanolin, and is notoriously difficult to sanitize in high-temperature baby laundry cycles without shrinking."
    ]),

    // Section 4: Why 100% Combed Cotton Is the Gold Standard
    h2("Why 100% Combed Cotton Is the Pediatrician Gold Standard"),

    p([
      "When pediatric dermatologists and the National Eczema Association evaluate infant apparel, 100% pure combed cotton consistently ranks as the undisputed safest baseline. Here is why pure cotton is exceptionally well-suited for newborn and toddler knitwear:"
    ]),

    bullet([
      { text: "Combed, Long-Staple Fibers: ", marks: ["strong"] },
      { text: "During the combing process, cotton fibers are combed through fine mechanical teeth that discard all short, prickly fibers and align the long, silky fibers parallel to one another. The result is a smooth, continuous yarn that feels buttery soft against newborn skin." }
    ]),
    bullet([
      { text: "Completely Hypoallergenic & Plant-Based: ", marks: ["strong"] },
      { text: "Cotton is 100% plant cellulose. It contains zero animal proteins, zero lanolin, and zero synthetic petrochemical resins that could trigger allergic reactions or toxic off-gassing." }
    ]),
    bullet([
      { text: "Superior Airflow & Breathability: ", marks: ["strong"] },
      { text: "Cotton's natural cellular structure allows air to circulate freely around your baby's torso. It absorbs ambient moisture without holding humid heat, preventing the excessive sweating that triggers intense itching cycles." }
    ]),
    bullet([
      { text: "Hygienic Washing & Sanitization: ", marks: ["strong"] },
      { text: "Babies spit up, drool, and have diaper blowouts. Cotton can be washed in warm water with gentle hypoallergenic detergents to eliminate milk proteins and bacteria, whereas wool must be painstakingly hand-washed in cold water and easily traps lingering odors." }
    ]),

    // Section 5: The Knitty Petit Approach
    h2("The Knitty Petit Philosophy: Handcrafted Luxury for Sensitive Skin"),

    p([
      "At Knitty Petit, we believe that an heirloom keepsake should never force parents to choose between aesthetic elegance and your baby’s comfort. Every single one of our ",
      { text: "Hand-Embroidered Kids Name Sweaters", marks: ["link_prod1"] },
      " is consciously crafted using 100% premium long-staple combed cotton yarn."
    ], [
      { _key: "link_prod1", _type: "link", href: "/products/hand-embroidered-kids-name-sweaters", blank: false }
    ]),

    p([
      "We take fabric safety three steps further than mass-market brands:"
    ]),

    bullet([
      { text: "Silky Backside Embroidery: ", marks: ["strong"] },
      { text: "Many cheap personalized sweaters use stiff synthetic stabilizer backing or rough plastic threads that scratch the baby's chest from the inside. At Knitty Petit, our artisans stitch every custom name by hand using ultra-soft yarn, leaving the interior smooth, flexible, and completely irritation-free." }
    ]),
    bullet([
      { text: "Azo-Free, Low-Impact Dyeing: ", marks: ["strong"] },
      { text: "Our signature earthy color palette—from creamy oatmeal and warm camel to soft blush and dusty sage—is dyed using gentle, skin-safe mineral dyes that contain no harsh formaldehyde or heavy metals." }
    ]),
    bullet([
      { text: "Relaxed, Non-Constricting Silhouette: ", marks: ["strong"] },
      { text: "Tight necklines and constricting cuffs cause chafing around delicate baby necks and wrists. Our chunky silhouette features gentle ribbing that stretches effortlessly over your baby's head without tugging or friction." }
    ]),

    p([
      "Explore our full collection of ",
      { text: "Signature Kids Sweaters", marks: ["link_prod2"] },
      " to discover why thousands of parents trust Knitty Petit for their little one’s biggest milestones."
    ], [
      { _key: "link_prod2", _type: "link", href: "/products/kids-sweater", blank: false }
    ]),

    // Section 6: Practical Layering Tips
    h2("3 Golden Rules for Layering Knitwear on Sensitive Skin"),

    p([
      "Even with 100% combed cotton, thoughtful styling ensures your baby enjoys absolute comfort throughout their day. Follow these three pediatrician-approved layering rules straight from our styling studio:"
    ]),

    bullet([
      { text: "1. The Breathable Cotton Base Layer: ", marks: ["strong"] },
      { text: "Always dress your baby in a lightweight, 100% organic cotton short-sleeve or long-sleeve bodysuit underneath any sweater. This provides a smooth barrier against the skin and allows easy temperature adjustments throughout the day." }
    ]),
    bullet([
      { text: "2. The 'Roll-Twice' Sizing Strategy: ", marks: ["strong"] },
      { text: "Never squeeze a baby with eczema into snug-fitting knitwear. Snug garments trap body heat and rub against active skin folds in the elbows and neck. Always size up! Learn how to pick the ideal size in our companion guide to " },
      { text: "What Size Baby Name Sweater Should You Get?", marks: ["link_sizing"] },
      { text: "." }
    ], [
      { _key: "link_sizing", _type: "link", href: "/blog/what-size-baby-name-sweater-should-you-get", blank: false }
    ]),
    bullet([
      { text: "3. Wash Before First Wear: ", marks: ["strong"] },
      { text: "Before putting any new garment on your baby, wash it with a gentle, fragrance-free, dye-free liquid detergent to remove any residual fabric dust. For comprehensive laundering instructions, read our complete guide on " },
      { text: "How to Wash and Care for a Hand-Embroidered Baby Sweater", marks: ["link_wash"] },
      { text: "." }
    ], [
      { _key: "link_wash", _type: "link", href: "/blog/how-to-wash-hand-embroidered-baby-sweater", blank: false }
    ]),

    p([
      "Planning milestone photography? You can also check out our popular guide on ",
      { text: "7 Aesthetic Ways to Style an Embroidered Name Sweater for Birth Announcements", marks: ["link_announce"] },
      " for inspiring, gentle nursery photoshoot setups."
    ], [
      { _key: "link_announce", _type: "link", href: "/blog/baby-name-announcement-sweater-styling-ideas", blank: false }
    ]),

    // Section 7: Google People Also Ask (PAA) FAQs
    h2("Frequently Asked Questions About Baby Knitwear & Sensitive Skin"),

    h3("Can a baby with eczema wear wool sweaters?"),
    p([
      "Pediatricians strongly advise against dressing a baby with active eczema in traditional wool. The coarse fibers (>30 microns) have microscopic jagged scales that cause micro-abrasions on sensitive skin, while residual sheep lanolin can trigger contact dermatitis. If you choose superfine Merino wool for cold weather, ensure it never touches bare skin directly—always layer a smooth 100% cotton bodysuit underneath."
    ]),

    h3("Is 100% cotton warm enough for cold winter days?"),
    p([
      "Yes, absolutely. A chunky, medium-gauge knit crafted from 100% combed cotton traps warm air within its knit loops, offering substantial thermal insulation without the dangerous overheating associated with synthetic fleece or heavy wool. Cotton can also be easily layered over thermal undergarments for freezing outdoor winter strolls."
    ]),

    h3("How can I tell if a sweater is irritating my baby’s skin?"),
    p([
      "Watch for these early warning signs: fussiness and crying when the sweater is pulled on, persistent scratching or rubbing at the collar and wrists, flushed red patches on the chest or neck, or small bumps appearing along seam lines. If you notice any of these signs, gently remove the garment, soothe the skin with a fragrance-free ceramide cream, and switch to 100% combed cotton."
    ]),

    h3("Does hand-embroidered lettering scratch the baby's chest from the inside?"),
    p([
      "On mass-produced or machine-embroidered garments, the backside is often stiff, glued, or secured with scratchy synthetic mesh. At Knitty Petit, each name is hand-embroidered using ultra-soft yarn without plastic stabilizers. The backside stitches rest soft and flat against the knit, ensuring zero scratching against your baby's chest."
    ]),

    h3("What is the best detergent for washing sensitive skin baby knitwear?"),
    p([
      "Always choose a pediatrician-approved, fragrance-free, dye-free liquid detergent certified by the National Eczema Association. Avoid powdered detergents (which can leave undissolved mineral crystals in the knit), skip fabric softeners and dryer sheets entirely, and run an extra rinse cycle to ensure all soap residues are completely washed away."
    ])
  ];

  // Step 4: Assemble Sanity Document
  const postDocument = {
    _type: 'post',
    _id: 'cotton-vs-wool-baby-clothes-sensitive-skin-guide',
    title: 'Cotton vs. Wool for Baby Sweaters: Which Fiber Is Safest for Sensitive Skin & Eczema?',
    slug: {
      _type: 'slug',
      current: 'cotton-vs-wool-baby-clothes-sensitive-skin-guide'
    },
    publishedAt: new Date().toISOString(),
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
      alt: 'Handcrafted 100% cotton baby sweater showing delicate hand-embroidered yarn stitches safe for sensitive newborn skin'
    },
    excerpt: 'Comparing cotton vs. wool for baby knitwear: Learn the pediatric facts on eczema flare-ups, fiber prickle factor, lanolin allergies, and why 100% combed cotton is the safest choice.',
    categories: ['care-guides', 'crochet-tips', 'inspiration'],
    seo: {
      metaTitle: 'Cotton vs. Wool for Baby Sweaters: Sensitive Skin & Eczema Guide',
      metaDescription: 'Choosing knitwear for a baby with eczema or sensitive skin? Learn the clinical facts on wool prickle factor, lanolin risks, and why 100% combed cotton is pediatrician-recommended.',
      keywords: [
        'cotton vs wool baby clothes',
        'is wool safe for babies',
        'best baby sweater for eczema',
        'baby clothes sensitive skin',
        'is cotton or wool better for babies',
        'hypoallergenic baby knitwear'
      ]
    },
    body
  };

  // Step 5: Send Mutation to Sanity
  console.log('Publishing post to Sanity Content Lake...');
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

  console.log('🎉 Successfully Published Post to Sanity!');
  console.log('Document ID:', postDocument._id);
  console.log('Slug:', postDocument.slug.current);
  console.log('URL: /blog/' + postDocument.slug.current);
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
