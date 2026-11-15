// Every fact on the site lives here, with its source beside it. Invent nothing.
// Sources: Google Business Profile (GBP), Dawn's Facebook page (FB), Instagram bio (IG),
// The BayNet article, March 2026 (BayNet), and the shop sign in photo 01 (Sign).

export const business = {
  name: 'Style by Dawn', // Sign + FB page name. Body copy always writes "Style by Dawn".
  owner: 'Dawn Campbell', // BayNet, March 2026. Copy uses "Dawn".
  ownerShort: 'Dawn',

  address: {
    street: '22725 Duke Street', // GBP
    city: 'Leonardtown', // GBP
    region: 'MD', // GBP
    postalCode: '20650', // GBP
    country: 'US',
  },
  addressLine: '22725 Duke Street, Leonardtown, MD 20650', // GBP, exact NAP form used everywhere
  market: "Shepherd's Old Field Market", // GBP "Located in: Shepherd's Old Field Market"
  marketShort: 'SOF Market', // Dawn's own shorthand (BayNet quote: "SOF Market")
  nearby: 'a block off the square', // FB posts: "just about a block off the square"
  county: "St. Mary's County", // BayNet: she grew up in St. Mary's County

  // DRAFT: confirm. Google and Yelp list (301) 481-7914
  phoneDisplay: '(301) 461-3147', // FB "mobile" listing
  phoneE164: '+13014613147',
  phoneHref: 'tel:+13014613147',
  smsHref: 'sms:+13014613147',
  email: 'mystylebydawn@gmail.com', // FB contact info

  facebook: 'https://www.facebook.com/shopstylebydawn', // FB, about 1K followers
  facebookReviews: 'https://www.facebook.com/shopstylebydawn/reviews', // FB recommendations tab
  instagram: 'https://www.instagram.com/style_by_dawn/', // IG @style_by_dawn
  instagramHandle: '@style_by_dawn',

  sinceYear: 2016, // BayNet quote: "since SOF opened in 2016"
  historyLine: "Dawn has run boutiques at Shepherd's Old Field Market since it opened in 2016.", // BayNet, reworded per spec

  // Her own lines
  signLine: 'Be your best you!', // Sign (photo 01)
  fbBio: "Women's fashion at affordable prices to help you feel fabulous every day!", // FB bio
  igBio: 'Helping you feel your best every day', // IG bio
  findLine: 'Find your next favorite outfit!', // FB posts
  shopSmall: 'Shop small.', // FB posts
} as const;

// Hours: GBP and her Facebook post, Nov 2026. Index 0 = Sunday (matches Date.getDay()).
export type DayHours = { day: string; short: string; open: string | null; close: string | null; label: string };
export const hours: DayHours[] = [
  { day: 'Sunday', short: 'Sun', open: '11:00', close: '17:00', label: '11 AM to 5 PM' },
  { day: 'Monday', short: 'Mon', open: null, close: null, label: 'Closed' },
  { day: 'Tuesday', short: 'Tue', open: '10:00', close: '19:00', label: '10 AM to 7 PM' },
  { day: 'Wednesday', short: 'Wed', open: '10:00', close: '19:00', label: '10 AM to 7 PM' },
  { day: 'Thursday', short: 'Thu', open: '10:00', close: '19:00', label: '10 AM to 7 PM' },
  { day: 'Friday', short: 'Fri', open: '10:00', close: '19:00', label: '10 AM to 7 PM' },
  { day: 'Saturday', short: 'Sat', open: '10:00', close: '19:00', label: '10 AM to 7 PM' },
];
export const hoursSummary = 'Tuesday to Saturday 10 AM to 7 PM, Sunday 11 AM to 5 PM. Closed Monday.';
export const timeZone = 'America/New_York';

// Dawn's captions, word for word from her Facebook posts. Quote exactly, never rewrite.
export const captions = {
  boots: 'Just add your favorite boots for an effortlessly polished outfit, perfect for dinner out or a day in town!',
  tallBoots:
    'Pair it with tall brown boots and a coordinating handbag for a fresh fall look, or dress it up with heels and gold jewelry for dinner out!',
  cropCardi: 'Super soft and perfect for Fall, this super soft cropped cardi pairs perfectly with your favorite jeans or skirt!',
  // DRAFT: confirm this caption belongs to photo 08
  basics:
    'Gear up for Fall with the basics! Check out this wool blend cardi, perfect in this neutral taupe color! Jeans by Artemis Vintage, and leather Myra bag to finish off the look!',
  snapbacks: 'These newly added snapbacks are giving your favorite jeans and sweatshirt a little Christmas cheer!',
  stiffany: 'Stiffany is ready to head out in style!', // FB post in Stiffany's voice
} as const;

// Reviews: Facebook recommendations, the only reviews that exist. Google shows none.
// Plain attributed text only. Never aggregateRating or review markup.
export const reviews = [
  {
    name: 'Jessica R.',
    source: 'Facebook',
    date: 'April 2019',
    quote:
      "I met the owner Dawn, and she was wonderful! I'm not good at shopping, and have lost some weight recently, so I was lost. Dawn actually helped me so much! She helped me pick out some amazing outfits, and showed me different ways to wear the items.",
    second: 'The clothes are all superb, amazing, boutique quality, but affordable prices!',
    excerpt:
      'Dawn actually helped me so much! She helped me pick out some amazing outfits, and showed me different ways to wear the items.',
  },
  { name: "De'Lores R.", source: 'Facebook', date: 'November 2018', quote: 'Great clothes and affordable check her out!' },
  // DRAFT: confirm date on Facebook
  { name: 'AnnMarie A.', source: 'Facebook', date: null, quote: 'Beautiful Apparel! Friendly Customer Service!' },
] as const;

// DRAFT: confirm whether she wants Style House on this site, and the "24/7" wording.
export const secondShop = {
  show: true,
  name: 'Style House on Park Avenue',
  inside: 'The Inn at Leonardtown',
  address: '41655 Park Avenue, Leonardtown', // BayNet, March 2026 ribbon cutting
  note: 'A coastal-inspired boutique for women and men.',
};

// DRAFT: Hunter or Dawn updates this weekly
export const thisWeek = "New this week: holiday snapbacks, sherpa and Stiffany's dinner look.";

// Off by default. Turns on "from $X" tile labels once Dawn supplies real numbers. Never invent a price.
export const showPricing = false;
export const prices: Record<string, number> = {};

export const mapsDirectionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(`${business.market}, ${business.addressLine}`);
export const mapsPlaceUrl =
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${business.name}, ${business.addressLine}`);
export const mapsEmbedUrl =
  'https://www.google.com/maps?output=embed&q=' + encodeURIComponent(`${business.addressLine}`);
