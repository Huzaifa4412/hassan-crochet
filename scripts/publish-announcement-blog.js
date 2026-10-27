const fs = require('fs');

const TOKEN = process.env.SANITY_API_TOKEN;
const PROJECT_ID = '6m1z3oqp';
const DATASET = 'production';
const API_VERSION = '2026-02-23';

let keyCounter = 1;
function genKey() {
  return 'ann_' + (keyCounter++).toString(36) + '_' + Math.random().toString(36).substring(2, 7);
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

// Complete body content for the Announcement Styling Guide
const body = [
  // Google Featured Snippet target lead
  p([
    { text: "The secret to styling a viral baby name announcement sweater is ", marks: [] },
    { text: "keeping your backdrop calm and letting the raised cursive yarn embroidery be the undisputed hero", marks: ["strong"] },
    { text: ". Pair a 100% cotton knit sweater in warm oatmeal or camel with an unbleached linen surface, a round wooden birth stat disc, tiny knit booties, and soft 45-degree morning window light. ", marks: [] },
    { text: "Rolling the cuffs twice gives that effortless, cozy boutique silhouette", marks: ["strong"] },
    { text: " that captures hearts on Instagram and nursery announcement cards alike." }
  ]),

  p([
    "Few moments in life feel as magical as introducing your new baby to friends, family, and the world. Over the past few seasons, traditional plastic letterboards and flat-printed graphic onesies have taken a backseat to a warmer, more sentimental trend: the ",
    { text: "personalized hand-embroidered baby name sweater", marks: ["strong"] },
    "."
  ]),

  p([
    "A custom name sweater is more than just an adorable photo prop—it is a wearable heirloom. The raised, tactile yarn stitches add warmth and dimension that flat fabric prints simply cannot rival. When captured under natural morning light, every loop of embroidery highlights your baby’s carefully chosen name with unmistakable elegance."
  ]),

  quote(
    "“When you photograph a hand-embroidered sweater, you aren’t just documenting an outfit. You are capturing the very first time your child wears their name, handcrafted into a keepsake they will cherish when they are grown.”"
  ),

  // Infographic Visual Guide
  h2("The Anatomy of an Aesthetic Baby Name Announcement Photo"),

  p([
    "Before you begin snapping photos, study our studio's quick-reference styling anatomy. Combining these six elements creates an editorial-worthy shot every single time:"
  ]),

  inlineImage(
    "image-d0f946c562b8d6f1f205c9518de231c050a51410-1600x1100-png",
    "The Anatomy of a Viral Baby Name Announcement Photo Styling Formula",
    "The 6-element styling formula used by boutique newborn photographers: hero knitwear, textured base, prop equation, morning light, dual angles, and rolled cuffs."
  ),

  // Section 2: 7 Styling Ideas
  h2("7 Creative Ways to Style Your Baby Name Announcement Sweater"),

  h3("1. The Minimalist Heirloom Flat-Lay"),
  p([
    "If your newborn is fussy or sleeping through their golden window, a carefully curated flat-lay is timeless, stress-free, and stunning. Lay your baby's custom name sweater flat across an organic cotton waffle blanket or raw unbleached linen."
  ]),
  bullet([
    { text: "The Props: ", marks: ["strong"] },
    { text: "A round engraved wooden birth stat disc (listing birth date, time, weight, and length), an ultrasound sonogram picture tucked delicately into the corner, and a pair of tiny knit booties." }
  ]),
  bullet([
    { text: "The Composition: ", marks: ["strong"] },
    { text: "Shoot directly overhead at a crisp 90-degree angle. Keep generous negative space around the sweater so the frame feels airy and peaceful." }
  ]),

  h3("2. The Organic Moses Basket Nest"),
  p([
    "Woven palm leaf or seagrass Moses baskets are a staple of modern bohemian and minimalist nurseries. Line the basket with a neutral muslin swaddle, dress baby in their cozy name sweater, and tuck a lightweight blanket across their legs while leaving the custom embroidered chest visible."
  ]),
  p([
    "This setup gives your newborn a secure, womb-like feeling that encourages deep, contented sleep while you capture natural, peaceful portraits."
  ]),

  h3("3. The Hospital Going-Home & 'Fresh 48' Snuggle"),
  p([
    "Those first 48 hours in the hospital room are sacred. Hospital bassinet sheets are notoriously plain, making a warm chunky sweater the perfect centerpiece to elevate the scene."
  ]),
  p([
    "Pair an Oatmeal or Camel Knitty Petit sweater with a soft ribbed baby beanie and tiny organic socks. Even if the room's lighting is subdued, rolling the hospital bassinet near the room's large window provides gentle, diffused daylight."
  ]),

  h3("4. The Sibling Coordinated Reveal"),
  p([
    "Including older brothers or sisters turns a birth announcement into a deeply emotional family memory. Dress big brother or big sister in a coordinating sweater while they gently cradle the new arrival on the master bed or living room rug."
  ]),
  bullet([
    { text: "Styling Secret: ", marks: ["strong"] },
    { text: "You don't need identical colors! Pair a Camel sweater for the older sibling with an Oatmeal or Dusty Rose sweater for baby to create harmonious, complementary earth tones." }
  ]),

  h3("5. The Golden Hour Parent Cuddle"),
  p([
    "Instead of setting baby down, hold them close against your chest. Have mom or dad wear a plain textured knit or linen shirt in cream, tan, or charcoal. Cradle baby over your shoulder or nestled into your arms with their embroidered name facing directly towards the camera."
  ]),
  p([
    "The contrast between large adult hands and tiny baby shoulders wrapped in custom knitwear visually emphasizes just how delicate and new your little one is."
  ]),

  h3("6. The Seasonal Botanical Accent"),
  p([
    "Celebrate the season in which your baby entered the world by weaving subtle botanical touches around the sweater:"
  ]),
  bullet([
    { text: "Autumn Babies (Sept–Nov): ", marks: ["strong"] },
    { text: "Small white 'baby boo' mini pumpkins, cinnamon sticks, and dried wheat sprigs on a warm camel knit." }
  ]),
  bullet([
    { text: "Winter Babies (Dec–Feb): ", marks: ["strong"] },
    { text: "A subtle evergreen cedar branch, miniature pinecones, and cozy knitted mittens." }
  ]),
  bullet([
    { text: "Spring & Summer Babies (Mar–Aug): ", marks: ["strong"] },
    { text: "Dried baby's breath, eucalyptus leaves, or delicate chamomile stems." }
  ]),

  h3("7. The Macro Detail Close-Up"),
  p([
    "Don't overlook the macro shots! Zoom in close to capture your baby's tiny curled fingers resting against the textured yarn stitches of their name, or a macro shot of tiny toes peeking out from beneath the ribbed sweater hem. These intimate details become the most treasured pages in your baby photo album."
  ]),

  // Section 3: Lighting & Sizing
  h2("Photographer's Lighting & Fit Secrets for Flawless Photos"),

  p([
    "Even the most beautiful custom knitwear can look underwhelming under harsh overhead lighting. Follow these three golden photography rules:"
  ]),

  bullet([
    { text: "1. Turn Off Yellow Indoor Bulbs: ", marks: ["strong"] },
    { text: "Overhead ceiling lamps cast harsh shadows and unnatural yellow color casts. Rely 100% on natural daylight coming from an open window." }
  ]),
  bullet([
    { text: "2. The 45-Degree Side Light Angle: ", marks: ["strong"] },
    { text: "Position your baby or flat-lay at a 45-degree angle to the window. Light grazing across the sweater creates delicate micro-shadows beneath each raised cursive stitch, making the name pop with three-dimensional depth." }
  ]),
  bullet([
    { text: "3. Choose Size 0–3M and Roll the Cuffs: ", marks: ["strong"] },
    { text: "Rather than buying a snug newborn size that baby outgrows in two weeks, pick size 0–3 Months and fold the wrist cuffs twice. The relaxed drape looks cozy, prevents fabric bunching across the chest, and extends wearable life for months." }
  ]),

  p([
    "Unsure whether to pick 0–3M or 3–6M for your baby's expected birth weight? Read our definitive companion guide: ",
    { text: "What Size Baby Name Sweater Should You Get? Complete Sizing & Fit Guide", marks: ["link_size"] },
    "."
  ], [
    { _key: "link_size", _type: "link", href: "/blog/what-size-baby-name-sweater-should-you-get", blank: false }
  ]),

  // FAQ Section
  h2("Frequently Asked Questions About Announcement Sweaters"),

  h3("Q: How far in advance should I order an announcement sweater before my due date?"),
  p([
    "We recommend ordering during your early third trimester (around week 28 to 32). This ensures your handcrafted sweater arrives well before your hospital bag needs to be packed, giving you complete peace of mind."
  ]),

  h3("Q: What should my baby wear underneath the sweater for photos?"),
  p([
    "A plain short-sleeve or sleeveless white cotton bodysuit (onesie) is ideal. It provides a soft, breathable base layer that protects baby's sensitive skin without bulky sleeves bunching up inside the sweater arms."
  ]),

  h3("Q: Which knit colors photograph best in natural light?"),
  p([
    "Oatmeal, Camel, and Dusty Rose are our top three most requested announcement colors. Their warm, earthy undertones photograph exceptionally well across all skin tones and harmonize naturally with linen and wood props."
  ]),

  h3("Q: How do I wash the sweater if baby spits up during the photoshoot?"),
  p([
    "Hand wash inside out in cool water with gentle, bleach-free baby detergent, roll inside a towel to remove excess water, and dry flat. Never use a tumble dryer. For full instructions, check our ",
    { text: "Complete Hand-Embroidered Sweater Care Guide", marks: ["link_care"] },
    "."
  ], [
    { _key: "link_care", _type: "link", href: "/blog/how-to-wash-hand-embroidered-baby-sweater", blank: false }
  ]),

  // Call to Action
  h2("Handcraft Your Baby's Name Announcement Sweater"),

  p([
    "Ready to design the keepsake outfit for your baby's grand entrance? Choose from our curated palette of rich, earthy cotton knits and let our master artisans hand-embroider your baby's name with delicate cursive stitches."
  ]),

  p([
    "Explore the bestselling ",
    { text: "Hand Embroidered Kids Name Sweaters", marks: ["link_prod", "strong"] },
    " or design your custom heirloom today to create memories that last forever."
  ], [
    { _key: "link_prod", _type: "link", href: "/products/hand-embroidered-kids-name-sweaters", blank: false }
  ])
];

// Sanity Document
const doc = {
  _id: 'baby-name-announcement-sweater-styling-ideas',
  _type: 'post',
  title: 'Baby Name Announcement Outfits: 7 Aesthetic Ways to Style an Embroidered Name Sweater',
  slug: {
    _type: 'slug',
    current: 'baby-name-announcement-sweater-styling-ideas'
  },
  author: {
    _type: 'reference',
    _ref: '60162e96-7437-4a07-b476-9d5397f6e7aa'
  },
  publishedAt: new Date().toISOString(),
  categories: ['inspiration', 'tutorials', 'crochet-tips'],
  excerpt: "Planning your newborn's birth reveal? Discover 7 timeless, aesthetic ways to style a personalized hand-embroidered baby name sweater for unforgettable announcement photos.",
  mainImage: {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: 'image-562df182957668a94c02253315570f67089cdb6d-3000x2250-jpg'
    },
    alt: 'Collection of hand-embroidered personalized baby name sweaters styled for newborn birth announcement photos'
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
  console.log('DOCUMENT ID:', data.results?.[0]?.document?._id);
  console.log('TITLE:', data.results?.[0]?.document?.title);
}

postBlog().catch(console.error);
