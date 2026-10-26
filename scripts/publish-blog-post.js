const fs = require('fs');

const TOKEN = process.env.SANITY_API_TOKEN;
const PROJECT_ID = '6m1z3oqp';
const DATASET = 'production';
const API_VERSION = '2026-02-23';

let keyCounter = 1;
function genKey() {
  return 'bk_' + (keyCounter++).toString(36) + '_' + Math.random().toString(36).substring(2, 7);
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

// Build the complete body content
const body = [
  // Quick Answer Lead for Google Featured Snippet
  p([
    { text: "The short answer: ", marks: ["strong"] },
    { text: "If you are purchasing a personalized baby name sweater as a baby shower gift, ", marks: [] },
    { text: "size 6–12 Months is the safest and most practical choice", marks: ["strong"] },
    { text: ". If you are ordering for your own newborn's birth announcement or hospital going-home photos, pick ", marks: [] },
    { text: "size 0–3 Months rather than Newborn", marks: ["strong"] },
    { text: ". Because custom hand-embroidered knitwear cannot be returned or exchanged, ", marks: [] },
    { text: "the golden rule is to always size up", marks: ["strong"] },
    { text: "—a relaxed, chunky knit looks effortlessly charming with cuffs rolled twice and extends the wearable life of your keepsake from a few weeks to nearly a full year." }
  ]),

  p([
    "Choosing clothing for an infant is notorious for guesswork, but when it comes to custom hand-embroidered baby knitwear, the stakes feel significantly higher. Unlike standard off-the-rack onesies that you can easily swap at a local department store, a custom name sweater is handcrafted stitch by stitch with your child’s name, choice of yarn color, and unique botanical or playful motifs. It is a one-of-a-kind keepsake intended for milestone photos, family holidays, and memory boxes."
  ]),

  p([
    "To help new parents, proud grandparents, and baby shower shoppers navigate the sizing puzzle with confidence, we created this definitive sizing and fit guide. Below, you will find our comprehensive measurement chart, growth timeline, seasonal calculation formula, and expert styling advice straight from the Knitty Petit artisan studio."
  ]),

  quote(
    "“Personalized baby knitwear should never feel tight or restrictive. A slightly oversized cotton knit sweater allows comfortable layering over onesies, looks timeless in milestone portraits with rolled cuffs, and gives growing babies the freedom to wiggle, crawl, and play.”"
  ),

  // Section: Sizing Chart
  h2("Knitty Petit Sizing Chart: Newborn to 4T"),

  p([
    "Baby sizing tags (like 3M or 6M) represent age averages, but infant growth rates vary widely. To ensure the best fit, always compare the baby’s current weight and chest width against our standardized garment dimensions before ordering:"
  ]),

  // The custom infographic visual chart
  inlineImage(
    "image-3189025797e47e31abee7ccf83cea9fed9d2994f-1600x1100-png",
    "Knitty Petit Baby Name Sweater Sizing Chart and Weight Milestones Guide",
    "Knitty Petit Official Sizing & Growth Chart: Dimensions, weight milestones, and recommended fit for custom hand-embroidered knitwear."
  ),

  bullet([
    { text: "Newborn (0–1 Month): ", marks: ["strong"] },
    { text: "Fits 5–9 lbs (2.3–4.1 kg) | Chest Width: 9.5\" (24 cm) | Body Length: 10.5\" (27 cm). Designed specifically for hospital going-home moments, Fresh 48 photography, and birth announcements. Note: Babies outgrow this size within 3 to 4 weeks." }
  ]),
  bullet([
    { text: "0–3 Months: ", marks: ["strong"] },
    { text: "Fits 8–13 lbs (3.6–5.9 kg) | Chest Width: 10.5\" (26.5 cm) | Body Length: 11.5\" (29 cm). The ideal size for early newborn portraits and 1-month to 2-month family photos. Provides plenty of room for an average 7–8 lb newborn to grow into." }
  ]),
  bullet([
    { text: "3–6 Months: ", marks: ["strong"] },
    { text: "Fits 12–17 lbs (5.4–7.7 kg) | Chest Width: 11.5\" (29 cm) | Body Length: 12.5\" (32 cm). A versatile milestone size for 100-day celebrations, baby’s first social outings, and early tummy time." }
  ]),
  bullet([
    { text: "6–12 Months: ", marks: ["strong"] },
    { text: "Fits 16–22 lbs (7.3–10 kg) | Chest Width: 12.5\" (32 cm) | Body Length: 13.5\" (34 cm). The #1 best-value gift size. Perfect for sitting milestones, crawling adventures, and autumn/winter holiday gatherings." }
  ]),
  bullet([
    { text: "12–18 Months: ", marks: ["strong"] },
    { text: "Fits 22–26 lbs (10–11.8 kg) | Chest Width: 13.5\" (34 cm) | Body Length: 14.5\" (37 cm). Tailored for the momentous 1st Birthday milestone, cake smash photography, and early steps." }
  ]),
  bullet([
    { text: "18–24 Months / 2T: ", marks: ["strong"] },
    { text: "Fits 26–30 lbs (11.8–13.6 kg) | Chest Width: 14.0\" (35.5 cm) | Body Length: 15.5\" (39 cm). Ideal for active toddlers, park playdates, and second-year birthday portraits." }
  ]),
  bullet([
    { text: "3T – 4T: ", marks: ["strong"] },
    { text: "Fits 30–40 lbs (13.6–18.1 kg) | Chest Width: 15.0\" (38 cm) | Body Length: 17.0\" (43 cm). Crafted for preschoolers and older siblings in matching family sets." }
  ]),

  // Section: The Golden Rule
  h2("The Golden Rule: Why You Should Almost Always Size Up"),

  p([
    "If you find yourself hesitating between two sizes—say 0–3M versus 3–6M—our recommendation is unequivocal: ",
    { text: "always choose the larger size", marks: ["strong"] },
    ". Here are three compelling reasons why sizing up makes practical and aesthetic sense:"
  ]),

  h3("1. Knit Sweaters Are Made for Layering"),
  p([
    "Unlike summer rompers that sit directly against bare skin, knit sweaters are virtually always styled over an underlayer. Whether it is a snug organic cotton bodysuit, a footie sleeper, or a collared button-down shirt for formal photos, an extra half-inch of chest allowance prevents the sweater from feeling tight across baby’s torso."
  ]),

  h3("2. The 'Rolled Cuff' Aesthetic Is Timeless"),
  p([
    "Chunky knitwear looks intentionally cozy when slightly oversized. Rolling the ribbed sleeve cuffs twice creates a chic, European boutique silhouette that parents adore. As baby grows over the next six months, you simply unroll the cuffs, extending the garment's wearable lifespan without needing a replacement."
  ]),

  h3("3. Handcrafted Pieces Have a 1–2 Week Lead Time"),
  p([
    "Because each Knitty Petit sweater is personalized by hand, your order takes time to stitch and ship. If you order an exact-fit newborn size late in your third trimester, your baby may have already gained two pounds by the time the parcel arrives at your doorstep. Choosing one size ahead cushions against unexpected growth spurts."
  ]),

  // Section: The Seasonality Formula
  h2("Buying as a Gift? The Seasonality Formula Every Gift-Giver Needs"),

  p([
    "The single most common mistake baby shower shoppers make is purchasing a cozy winter knit sweater in size Newborn for a baby due in July or August. By the time chilly weather arrives in November, the baby will be four months old and unable to squeeze into newborn knitwear!"
  ]),

  p([
    "To avoid this common pitfall, use the simple ",
    { text: "Knitty Petit Seasonality Formula", marks: ["strong"] },
    ":"
  ]),

  quote(
    "Baby’s Due Month + Approximate Age When Cold Weather Starts = Ideal Gift Size"
  ),

  p([
    "Here is how to apply the formula based on when the little one is expected to arrive:"
  ]),

  bullet([
    { text: "Spring Due Date (March – May): ", marks: ["strong"] },
    { text: "Skip Newborn and 0–3M sizes entirely. Buy " },
    { text: "Size 6–12 Months", marks: ["strong"] },
    { text: ". When autumn and winter arrive, the baby will be 6 to 9 months old—the prime window for cozy knitwear." }
  ]),
  bullet([
    { text: "Summer Due Date (June – August): ", marks: ["strong"] },
    { text: "Choose " },
    { text: "Size 3–6 Months or 6–12 Months", marks: ["strong"] },
    { text: ". Size 3–6M will fit perfectly from October through January, while 6–12M will last through early spring." }
  ]),
  bullet([
    { text: "Autumn/Winter Due Date (September – February): ", marks: ["strong"] },
    { text: "You can safely choose " },
    { text: "Size 0–3 Months or 3–6 Months", marks: ["strong"] },
    { text: ", as the baby can wear it immediately throughout the coldest months of the year." }
  ]),

  p([
    "Looking for more curated gift inspiration? Explore our companion guide to ",
    { text: "Baby Shower Gift Ideas: What to Buy and When to Personalize", marks: ["link_gift"] },
    "."
  ], [
    { _key: "link_gift", _type: "link", href: "/blog/baby-shower-gift-ideas", blank: false }
  ]),

  // Section: Occasion-Based Sizing
  h2("Occasion-Based Sizing: Matching the Sweater to the Milestone"),

  p([
    "Many parents invest in a hand-embroidered name sweater specifically for a planned photo shoot or family milestone. Here is the recommended sizing approach for each major event:"
  ]),

  inlineImage(
    "image-463bdfd8b1a0501845713ecb8a912668ca7d251d-1024x1024-jpg",
    "Artisan hand-embroidering a custom name onto a soft cotton knit baby sweater",
    "Every Knitty Petit sweater is custom hand-stitched with premium yarn, ensuring rich texture and heirloom durability."
  ),

  h3("Hospital Going-Home & Birth Announcements (Birth – 4 Weeks)"),
  p([
    "If your primary objective is capturing that iconic nursery bassinet photo with baby’s new name proudly displayed, ",
    { text: "Size 0–3 Months", marks: ["strong"] },
    " is our recommended standard. It provides a sweet, swaddled oversized look that photographs beautifully without swallowing the baby, and it guarantees wear for the entire fourth trimester."
  ]),

  h3("Half-Birthday & Sitting Milestones (6 Months)"),
  p([
    "Around 6 months, babies learn to sit upright unsupported, creating wonderful opportunities for milestone portraits. For this stage, ",
    { text: "Size 6–12 Months", marks: ["strong"] },
    " offers the ideal balance of torso length and arm mobility, pairing charmingly with knit bloomers, leggings, or corduroy overalls."
  ]),

  h3("The 1st Birthday Cake Smash (12 Months)"),
  p([
    "First birthday photo sessions are full of active movement. If your toddler is on the leaner side (under 22 lbs), ",
    { text: "Size 12–18 Months", marks: ["strong"] },
    " offers a tailored look. If your child is in the 75th percentile or higher for height and weight, jump straight to ",
    { text: "Size 2T", marks: ["strong"] },
    " so the sweater remains in regular wardrobe rotation throughout their second year."
  ]),

  // Section: How to Measure
  h2("How to Measure an Existing Baby Sweater (Step-by-Step)"),

  p([
    "If you already have a baby sweater at home that fits your child comfortably, measuring it flat takes less than two minutes and guarantees complete peace of mind before placing a custom order:"
  ]),

  bullet([
    { text: "1. Lay Garment Flat: ", marks: ["strong"] },
    { text: "Smooth out wrinkles on a clean table or floor without stretching the knit fabric." }
  ]),
  bullet([
    { text: "2. Measure Chest Width (Pit-to-Pit): ", marks: ["strong"] },
    { text: "Place a soft tape measure directly across the chest from one underarm seam to the opposite underarm seam. Multiply by two for total circumference." }
  ]),
  bullet([
    { text: "3. Measure Body Length: ", marks: ["strong"] },
    { text: "Measure vertically from the highest point of the shoulder collar down to the bottom rib hem." }
  ]),
  bullet([
    { text: "4. Measure Sleeve Length: ", marks: ["strong"] },
    { text: "Measure from the collar seam down along the outer edge of the sleeve to the end of the wrist cuff." }
  ]),

  p([
    "Match your recorded numbers against our sizing chart above. If your existing garment falls right on the edge between two sizes, opt for the larger size."
  ]),

  // Section: Fiber & Comfort
  h2("Fiber, Stretch, and Fit: Why 100% Cotton Matters"),

  p([
    "Sizing comfort is directly tied to fabric quality. Knitty Petit sweaters are knitted from ",
    { text: "100% premium combed cotton", marks: ["strong"] },
    ", which offers distinct advantages over acrylic and rough wool blends:"
  ]),

  bullet([
    { text: "Breathable & Hypoallergenic: ", marks: ["strong"] },
    { text: "Natural cotton allows optimal air circulation, keeping sensitive baby skin comfortable without overheating or prickling." }
  ]),
  bullet([
    { text: "Gentle Neckline Stretch: ", marks: ["strong"] },
    { text: "Infants have proportionally larger heads. Our ribbed necklines are crafted with subtle natural give, sliding smoothly over baby’s head without pinching ears or snagging delicate hair." }
  ]),
  bullet([
    { text: "Shape Retention: ", marks: ["strong"] },
    { text: "High-grade cotton yarn maintains its structural memory wear after wear, resisting the sagging or misshapen stretching common in synthetic fibers." }
  ]),

  p([
    "To ensure your sweater retains its original dimensions and embroidery texture, make sure to read our detailed ",
    { text: "Complete Care Guide: How to Wash and Care for a Hand-Embroidered Baby Sweater", marks: ["link_care"] },
    "."
  ], [
    { _key: "link_care", _type: "link", href: "/blog/how-to-wash-hand-embroidered-baby-sweater", blank: false }
  ]),

  // Section: FAQ
  h2("Frequently Asked Questions About Baby Sweater Sizing"),

  h3("Q: Will a 0–3 month name sweater fit my newborn right after birth?"),
  p([
    "Yes! A 0–3 month sweater will fit an average newborn (7–8.5 lbs) with a relaxed, cozy drape. Simply roll the cuffs once or twice for a camera-ready look. It ensures your baby will continue wearing their personalized keepsake for the entire first 3–4 months rather than outgrowing it in two weeks."
  ]),

  h3("Q: Does a long name (7+ letters) affect how the sweater fits?"),
  p([
    "No. Our embroidery artisans adjust the scale, curvature, and letter spacing to fit proportionally across the chest panel for each specific garment size. The custom stitching does not restrict chest stretch or impact garment dimensions."
  ]),

  h3("Q: Do Knitty Petit cotton sweaters shrink when washed?"),
  p([
    "When cared for properly with cool water hand-washing and flat air drying, shrinkage is virtually zero (less than 1–2%). However, tumble drying on high heat will shrink cotton knit fibers and distort raised yarn embroidery. Always avoid machine dryers."
  ]),

  h3("Q: What if the baby is between sizes?"),
  p([
    "Always choose the larger size. Infants grow continuously, and an oversized knit sweater with rolled sleeves looks stylish and intentional. A garment that is too small cannot be worn at all."
  ]),

  h3("Q: How far in advance should I order for a baby shower or photoshoot?"),
  p([
    "We recommend ordering at least 2 to 3 weeks ahead of your planned event or photo session to account for custom hand-embroidery production and standard shipping."
  ]),

  // Section: CTA
  h2("Ready to Create Your Custom Heirloom?"),

  p([
    "Now that you have the sizing roadmap, it's time to bring your vision to life. Choose from our curated palette of rich earthy tones—from warm oatmeal and dusty rose to camel and forest green—and personalize your sweater with baby’s name and custom botanical or playful yarn embroidery."
  ]),

  p([
    "Explore our bestselling ",
    { text: "Hand Embroidered Kids Name Sweaters", marks: ["link_prod1", "strong"] },
    " or browse the complete ",
    { text: "Kids Name Sweater Collection", marks: ["link_prod2", "strong"] },
    " to begin designing your heirloom today."
  ], [
    { _key: "link_prod1", _type: "link", href: "/products/hand-embroidered-kids-name-sweaters", blank: false },
    { _key: "link_prod2", _type: "link", href: "/products/kids-sweater", blank: false }
  ])
];

// Document object for Sanity
const doc = {
  _id: 'what-size-baby-name-sweater-should-you-get',
  _type: 'post',
  title: 'What Size Baby Name Sweater Should You Get? The Complete Sizing, Fit & Gift Guide',
  slug: {
    _type: 'slug',
    current: 'what-size-baby-name-sweater-should-you-get'
  },
  author: {
    _type: 'reference',
    _ref: '60162e96-7437-4a07-b476-9d5397f6e7aa'
  },
  publishedAt: new Date().toISOString(),
  categories: ['crochet-tips', 'care-guides', 'tutorials'],
  excerpt: 'Unsure which size to pick for a personalized hand-embroidered baby name sweater? Use our definitive sizing chart, growth timeline, and gift-buying cheat sheet to get the perfect cozy fit every time.',
  mainImage: {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: 'image-e724e85be38886570a2fd22011f908fd871ce5f8-1024x1024-jpg'
    },
    alt: 'Hand-embroidered personalized baby name sweaters neatly folded with wooden nursery keepsakes and measuring tape'
  },
  body
};

async function postBlog() {
  console.log('Sending post to Sanity Content Lake...');
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}?returnDocuments=true`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mutations: [
        {
          createOrReplace: doc
        }
      ]
    })
  });

  const data = await res.json();
  console.log('SANITY MUTATE RESPONSE STATUS:', res.status);
  console.log('RESPONSE DATA:', JSON.stringify(data, null, 2));
}

postBlog().catch(console.error);
