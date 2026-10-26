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
      .th { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 15px; fill: #4A3E39; text-transform: uppercase; letter-spacing: 0.5px; }
      .td { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; fill: #332B27; }
      .td-size { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 16px; fill: #8B4A34; }
      .td-milestone { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 15px; fill: #524741; }
      .note { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; fill: #8B4A34; font-weight: 600; }
    </style>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FAF6F0" />
      <stop offset="100%" stop-color="#F3EBE1" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FDFBF8" />
    </linearGradient>
    <filter id="shadow" x="-4%" y="-4%" width="108%" height="108%">
      <feDropShadow dx="0" dy="12" stdDeviation="24" flood-color="#4A3728" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1600" height="1100" fill="url(#bgGrad)" />

  <!-- Outer Card -->
  <g filter="url(#shadow)">
    <rect x="60" y="50" width="1480" height="1000" rx="28" fill="url(#cardGrad)" stroke="#E8DDD3" stroke-width="2" />
  </g>

  <!-- Header Header Tag -->
  <rect x="110" y="95" width="220" height="34" rx="17" fill="#F6ECE4" />
  <text x="220" y="117" text-anchor="middle" class="tag">KNITTY PETIT JOURNAL</text>

  <!-- Title & Subtitle -->
  <text x="110" y="180" class="title" font-size="40">Baby Name Sweater Sizing &amp; Fit Guide</text>
  <text x="110" y="216" class="subtitle" font-size="19">The definitive measurements, weight milestones, and recommended fit for custom hand-embroidered knitwear.</text>

  <!-- Table Container -->
  <rect x="110" y="260" width="1380" height="605" rx="16" fill="#FFFFFF" stroke="#EDE3DA" stroke-width="1.5" />

  <!-- Table Header -->
  <rect x="110" y="260" width="1380" height="60" rx="16" fill="#F7F1E9" />
  <text x="150" y="297" class="th">Size Tag</text>
  <text x="310" y="297" class="th">Age Range</text>
  <text x="490" y="297" class="th">Baby Weight</text>
  <text x="690" y="297" class="th">Chest Width (Flat)</text>
  <text x="880" y="297" class="th">Length (Neck to Hem)</text>
  <text x="1080" y="297" class="th">Best Milestone / Occasion</text>

  <!-- Row 1: Newborn -->
  <line x1="110" y1="320" x2="1490" y2="320" stroke="#EFE6DE" stroke-width="1" />
  <text x="150" y="365" class="td-size">Newborn (NB)</text>
  <text x="310" y="365" class="td">0 to 4 Weeks</text>
  <text x="490" y="365" class="td">5 – 9 lbs (2.3–4 kg)</text>
  <text x="690" y="365" class="td">9.5 in (24 cm)</text>
  <text x="880" y="365" class="td">10.5 in (27 cm)</text>
  <text x="1080" y="365" class="td-milestone">Hospital going-home &amp; birth announcements</text>

  <!-- Row 2: 0-3M -->
  <line x1="110" y1="395" x2="1490" y2="395" stroke="#EFE6DE" stroke-width="1" />
  <rect x="110" y="396" width="1380" height="75" fill="#FCF9F5" />
  <text x="150" y="440" class="td-size">0–3 Months</text>
  <text x="310" y="440" class="td">0 to 3 Months</text>
  <text x="490" y="440" class="td">8 – 13 lbs (3.6–5.9 kg)</text>
  <text x="690" y="440" class="td">10.5 in (26.5 cm)</text>
  <text x="880" y="440" class="td">11.5 in (29 cm)</text>
  <text x="1080" y="440" class="td-milestone">Newborn photo shoots &amp; early family outings</text>

  <!-- Row 3: 3-6M -->
  <line x1="110" y1="470" x2="1490" y2="470" stroke="#EFE6DE" stroke-width="1" />
  <text x="150" y="515" class="td-size">3–6 Months</text>
  <text x="310" y="515" class="td">3 to 6 Months</text>
  <text x="490" y="515" class="td">12 – 17 lbs (5.4–7.7 kg)</text>
  <text x="690" y="515" class="td">11.5 in (29 cm)</text>
  <text x="880" y="515" class="td">12.5 in (32 cm)</text>
  <text x="1080" y="515" class="td-milestone">★ Most gifted baby shower size (guaranteed fit)</text>

  <!-- Row 4: 6-12M -->
  <line x1="110" y1="545" x2="1490" y2="545" stroke="#EFE6DE" stroke-width="1" />
  <rect x="110" y="546" width="1380" height="75" fill="#FCF9F5" />
  <text x="150" y="590" class="td-size">6–12 Months</text>
  <text x="310" y="590" class="td">6 to 12 Months</text>
  <text x="490" y="590" class="td">16 – 22 lbs (7.3–10 kg)</text>
  <text x="690" y="590" class="td">12.5 in (32 cm)</text>
  <text x="880" y="590" class="td">13.5 in (34 cm)</text>
  <text x="1080" y="590" class="td-milestone">Sitting milestones, crawling &amp; winter layering</text>

  <!-- Row 5: 12-18M -->
  <line x1="110" y1="620" x2="1490" y2="620" stroke="#EFE6DE" stroke-width="1" />
  <text x="150" y="665" class="td-size">12–18 Months</text>
  <text x="310" y="665" class="td">1 to 1.5 Years</text>
  <text x="490" y="665" class="td">22 – 26 lbs (10–11.8 kg)</text>
  <text x="690" y="665" class="td">13.5 in (34 cm)</text>
  <text x="880" y="665" class="td">14.5 in (37 cm)</text>
  <text x="1080" y="665" class="td-milestone">1st Birthday portraits &amp; cake smash celebrations</text>

  <!-- Row 6: 18-24M / 2T -->
  <line x1="110" y1="695" x2="1490" y2="695" stroke="#EFE6DE" stroke-width="1" />
  <rect x="110" y="696" width="1380" height="75" fill="#FCF9F5" />
  <text x="150" y="740" class="td-size">18–24M / 2T</text>
  <text x="310" y="740" class="td">1.5 to 2.5 Years</text>
  <text x="490" y="740" class="td">26 – 30 lbs (11.8–13.6 kg)</text>
  <text x="690" y="740" class="td">14.0 in (35.5 cm)</text>
  <text x="880" y="740" class="td">15.5 in (39 cm)</text>
  <text x="1080" y="740" class="td-milestone">Walking toddlers &amp; holiday family gatherings</text>

  <!-- Row 7: 3T - 4T -->
  <line x1="110" y1="770" x2="1490" y2="770" stroke="#EFE6DE" stroke-width="1" />
  <text x="150" y="815" class="td-size">3T – 4T</text>
  <text x="310" y="815" class="td">3 to 4.5 Years</text>
  <text x="490" y="815" class="td">30 – 40 lbs (13.6–18.1 kg)</text>
  <text x="690" y="815" class="td">15.0 in (38 cm)</text>
  <text x="880" y="815" class="td">17.0 in (43 cm)</text>
  <text x="1080" y="815" class="td-milestone">Preschool wear, playground adventures &amp; siblings</text>

  <!-- Bottom Callout Note Bar -->
  <rect x="110" y="885" width="1380" height="120" rx="16" fill="#FBF3EE" stroke="#EAD8CE" stroke-width="1.5" />
  <circle cx="155" cy="945" r="22" fill="#8B4A34" />
  <text x="155" y="952" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#FFFFFF">★</text>
  <text x="195" y="935" class="note" font-size="17">THE GOLDEN RULE OF PERSONALIZED KNITWEAR SIZING:</text>
  <text x="195" y="965" font-family="Plus Jakarta Sans, sans-serif" font-size="15" fill="#57463E">
    When deciding between two sizes or purchasing ahead as a gift, <tspan font-weight="bold" fill="#8B4A34">always choose one size up</tspan>. Chunky cotton knit sweaters look effortlessly chic with cuffs rolled twice, drape comfortably over onesies, and allow 6–9 months of continuous growth!
  </text>
</svg>
`;

async function main() {
  const outputPng = path.join(__dirname, '../public/baby-name-sweater-sizing-chart.png');
  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outputPng);
  console.log('Successfully generated sizing chart PNG at:', outputPng);
}

main().catch(console.error);
