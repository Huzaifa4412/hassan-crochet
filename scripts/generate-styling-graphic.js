const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" width="1600" height="1100">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap');
      .title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; fill: #2C2420; }
      .subtitle { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; fill: #7A6F68; }
      .tag { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 2px; fill: #9E5A44; text-transform: uppercase; }
      .card-title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 20px; fill: #382B24; }
      .card-desc { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14.5px; fill: #5C5049; line-height: 1.55; }
      .step-num { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 14px; fill: #FFFFFF; }
      .pill-tag { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 1px; fill: #8B4A34; text-transform: uppercase; }
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

  <!-- Background -->
  <rect width="1600" height="1100" fill="url(#bgGrad)" />

  <!-- Outer Main Card -->
  <g filter="url(#shadow)">
    <rect x="60" y="50" width="1480" height="1000" rx="30" fill="url(#cardGrad)" stroke="#E8DDD3" stroke-width="2" />
  </g>

  <!-- Top Header Pill -->
  <rect x="110" y="90" width="230" height="34" rx="17" fill="#F6ECE4" />
  <text x="225" y="112" text-anchor="middle" class="tag">KNITTY PETIT JOURNAL</text>

  <!-- Title & Subtitle -->
  <text x="110" y="172" class="title" font-size="38">The Anatomy of a Viral Baby Name Announcement Photo</text>
  <text x="110" y="206" class="subtitle" font-size="18">The exact 6-element styling formula used by boutique photographers &amp; modern parents for unforgettable birth reveals.</text>

  <!-- Grid of 6 Strategy Cards -->

  <!-- Card 1: Centerpiece -->
  <g filter="url(#shadow)">
    <rect x="110" y="245" width="435" height="330" rx="20" fill="#FFFFFF" stroke="#EFE4DA" stroke-width="1.5" />
    <circle cx="150" cy="285" r="18" fill="#8B4A34" />
    <text x="150" y="291" text-anchor="middle" class="step-num">01</text>
    <text x="180" y="292" class="card-title">The Hero Knit Centerpiece</text>
    <rect x="135" y="320" width="140" height="24" rx="12" fill="#FBF0E8" />
    <text x="205" y="336" text-anchor="middle" class="pill-tag">Tactile Focus</text>
    <text x="135" y="375" class="card-desc">
      Choose a chunky knit sweater in earthy neutrals
      (oatmeal, warm camel, or dusty rose). Raised cursive
      yarn embroidery catches light and provides tactile
      depth that flat-printed onesies simply cannot replicate.
    </text>
  </g>

  <!-- Card 2: The Texture Base -->
  <g filter="url(#shadow)">
    <rect x="580" y="245" width="435" height="330" rx="20" fill="#FFFFFF" stroke="#EFE4DA" stroke-width="1.5" />
    <circle cx="620" cy="285" r="18" fill="#8B4A34" />
    <text x="620" y="291" text-anchor="middle" class="step-num">02</text>
    <text x="650" y="292" class="card-title">Textured Organic Base</text>
    <rect x="605" y="320" width="145" height="24" rx="12" fill="#FBF0E8" />
    <text x="677" y="336" text-anchor="middle" class="pill-tag">Backdrop Layer</text>
    <text x="605" y="375" class="card-desc">
      Lay the sweater on raw unbleached linen, a waffle
      organic cotton blanket, or inside a woven Moses basket.
      The subtle contrast between the knit stitches and the
      woven background creates a luxury magazine aesthetic.
    </text>
  </g>

  <!-- Card 3: Storytelling Props -->
  <g filter="url(#shadow)">
    <rect x="1050" y="245" width="435" height="330" rx="20" fill="#FFFFFF" stroke="#EFE4DA" stroke-width="1.5" />
    <circle cx="1090" cy="285" r="18" fill="#8B4A34" />
    <text x="1090" y="291" text-anchor="middle" class="step-num">03</text>
    <text x="1120" y="292" class="card-title">Storytelling Prop Equation</text>
    <rect x="1075" y="320" width="135" height="24" rx="12" fill="#FBF0E8" />
    <text x="1142" y="336" text-anchor="middle" class="pill-tag">The Narrative</text>
    <text x="1075" y="375" class="card-desc">
      Apply the "Rule of 3" for props: a round wooden
      birth stat disc (date/weight), an ultrasound sonogram
      print, and tiny newborn knit booties or dried olive
      sprigs. Never clutter the frame around the baby’s name.
    </text>
  </g>

  <!-- Card 4: Lighting -->
  <g filter="url(#shadow)">
    <rect x="110" y="605" width="435" height="330" rx="20" fill="#FFFFFF" stroke="#EFE4DA" stroke-width="1.5" />
    <circle cx="150" cy="645" r="18" fill="#8B4A34" />
    <text x="150" y="651" text-anchor="middle" class="step-num">04</text>
    <text x="180" y="652" class="card-title">45° Soft Morning Window Light</text>
    <rect x="135" y="680" width="145" height="24" rx="12" fill="#FBF0E8" />
    <text x="207" y="696" text-anchor="middle" class="pill-tag">Natural Glow</text>
    <text x="135" y="735" class="card-desc">
      Position your flat lay or bassinet adjacent to a large
      window between 9 AM and 11 AM. Side-lighting casts
      soft micro-shadows beneath each embroidery stitch,
      making the custom lettering visibly pop on mobile screens.
    </text>
  </g>

  <!-- Card 5: Angles -->
  <g filter="url(#shadow)">
    <rect x="580" y="605" width="435" height="330" rx="20" fill="#FFFFFF" stroke="#EFE4DA" stroke-width="1.5" />
    <circle cx="620" cy="645" r="18" fill="#8B4A34" />
    <text x="620" y="651" text-anchor="middle" class="step-num">05</text>
    <text x="650" y="652" class="card-title">Dual Capture Angles</text>
    <rect x="605" y="680" width="140" height="24" rx="12" fill="#FBF0E8" />
    <text x="675" y="696" text-anchor="middle" class="pill-tag">Shot Checklist</text>
    <text x="605" y="735" class="card-desc">
      Shoot two essential angles:
      1. Overhead 90° Flat-Lay: Captures the full ensemble
         for announcement cards and nursery memory albums.
      2. 45° Macro Angle: Close-up of baby’s tiny hand gently
         resting near the hand-stitched letters.
    </text>
  </g>

  <!-- Card 6: Cuff Rolling & Sizing Secret -->
  <g filter="url(#shadow)">
    <rect x="1050" y="605" width="435" height="330" rx="20" fill="#FFFFFF" stroke="#EFE4DA" stroke-width="1.5" />
    <circle cx="1090" cy="645" r="18" fill="#8B4A34" />
    <text x="1090" y="651" text-anchor="middle" class="step-num">06</text>
    <text x="1120" y="652" class="card-title">The "Rolled Cuff" Secret</text>
    <rect x="1075" y="680" width="145" height="24" rx="12" fill="#FBF0E8" />
    <text x="1147" y="696" text-anchor="middle" class="pill-tag">Pro Styling Tip</text>
    <text x="1075" y="735" class="card-desc">
      Order size 0–3 Months (not newborn) and roll the
      wrist cuffs twice. An oversized silhouette looks effortlessly
      editorial, avoids tightness around baby’s tummy, and
      ensures the sweater gets worn for 6+ months after birth!
    </text>
  </g>

  <!-- Bottom Banner Note -->
  <rect x="110" y="960" width="1380" height="60" rx="14" fill="#FDF3EC" stroke="#ECD8CC" stroke-width="1" />
  <text x="800" y="996" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14.5" fill="#8B4A34" font-weight="600">
    ★ KNITTY PETIT JOURNAL TIP: Keep colors muted and organic. When the backdrop is calm, baby’s custom embroidered name shines brightest.
  </text>
</svg>
`;

async function main() {
  const outputPng = path.join(__dirname, '../public/baby-name-announcement-styling-guide.png');
  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outputPng);
  console.log('Successfully generated announcement styling guide PNG at:', outputPng);
}

main().catch(console.error);
