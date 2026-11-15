// All photos, looks and tiles. Descriptions come from the photo map in BUILD-SPEC section 0.
import { captions } from './business';

export type PhotoId =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11'
  | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21';

export type Category = 'sweaters' | 'jackets' | 'dresses' | 'denim' | 'bags' | 'cozy' | 'tees';

export type Photo = {
  id: PhotoId;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string; // hangtag text
  categories: Category[];
  sized: boolean; // false for caps, hats and bags: the Hold Request skips the size step
  watermark: 'bl' | 'bc' | 'ml' | 'none'; // where her "STYLE by Dawn" mark sits, so crops keep it whole
};

const p = (
  id: PhotoId,
  file: string,
  width: number,
  height: number,
  alt: string,
  caption: string,
  categories: Category[],
  sized = true,
  watermark: Photo['watermark'] = 'bl',
): Photo => ({ id, src: `/images/${file}`, width, height, alt, caption, categories, sized, watermark });

export const photos: Record<PhotoId, Photo> = {
  '01': p('01', '01-storefront-style-by-dawn-sign.jpg', 1268, 952,
    "The Style by Dawn shopfront inside Shepherd's Old Field Market: a sage sign reading Style By Dawn, Be your best you, string lights, barnwood beams and overalls and star prints in the windows",
    "Find us inside Shepherd's Old Field Market, a block off the square", [], false, 'none'),
  '02': p('02', '02-storefront-sign-alt-angle.jpg', 1078, 952,
    'The Style by Dawn shopfront with its sage sign and the door open to the pink interior',
    'The door is open on Duke Street', [], false, 'none'),
  '03': p('03', '03-stiffany-black-ribbed-dress-then-cream-coat-diptych.jpg', 1092, 1092,
    'Stiffany the shop mannequin in a black ribbed midi dress with a leopard belt, then the same look with a long cream coat',
    'Black ribbed midi, leopard belt, cream coat', ['dresses', 'jackets'], true, 'bc'),
  '04': p('04', '04-stiffany-taupe-ribbed-dress-cream-coat.jpg', 967, 1211,
    'Stiffany in a taupe ribbed midi dress with a leopard belt and a long cream coat, a star tote and a You glow girl sign behind',
    'Taupe ribbed midi, leopard belt, cream coat', ['dresses', 'jackets'], true, 'ml'),
  '05': p('05', '05-three-fall-looks-at-shop-door-sign.jpg', 907, 1211,
    'Three fall looks at the shop door under the sign: leopard overalls with a cream hat, an olive long vest over florals, and a sherpa jacket with wide-leg jeans and a woven tote',
    'Leopard overalls, olive long vest, sherpa jacket', ['jackets', 'denim'], true, 'none'),
  '06': p('06', '06-pink-plaid-shacket-mannequin-at-sign.jpg', 1092, 1092,
    'A pink plaid shacket over a white tee with jeans and a taupe wide-brim hat, a blue zigzag cardigan beside it',
    'Pink plaid shacket, wide-brim hat', ['jackets'], true, 'bl'),
  '07': p('07', '07-white-utility-jacket-and-black-dress.jpg', 967, 1211,
    'A white cinched utility jacket with wide-leg jeans beside a black tiered dress and a crossbody bag',
    'White utility jacket, black tiered dress', ['jackets', 'dresses', 'denim'], true, 'none'),
  '08': p('08', '08-taupe-cardigan-crossbody-wide-leg-jeans.jpg', 967, 1211,
    'A taupe cropped cardigan with a tan leather crossbody bag and sailor-pocket wide-leg jeans',
    'Taupe cropped cardigan, leather crossbody', ['sweaters', 'denim', 'bags'], true, 'bl'),
  '09': p('09', '09-green-cardigan-velvet-witch-hat.jpg', 967, 1211,
    'A green button cardigan on a dress form wearing a purple velvet witch hat',
    'Green cardigan, velvet witch hat', ['sweaters'], true, 'ml'),
  '10': p('10', '10-cable-cardigan-window-velvet-hat.jpg', 853, 1211,
    'A cream and caramel cable cardigan with a leather crossbody in the shop window',
    'Cable cardigan in the window', ['sweaters'], true, 'none'),
  '11': p('11', '11-window-aztec-maxi-and-denim-jacket.jpg', 1092, 1092,
    'The shop window: an aztec striped maxi with a denim jacket and rust hat, and a white denim jacket over a plaid dress',
    'Aztec maxi, denim jacket, rust hat', ['dresses', 'jackets', 'denim'], true, 'bl'),
  '12': p('12', '12-merry-and-bright-snapback-caps.jpg', 1092, 1092,
    'Three holiday snapback caps: Merry and Bright with a red polka dot brim, MERRY with a buffalo plaid brim, and Merry and Bright with a green stripe brim',
    'Merry & Bright snapback caps', ['bags', 'cozy'], false, 'bc'),
  '13': p('13', '13-250-years-of-freedom-tee-star-hat.jpg', 967, 1211,
    'A 250 Years of Freedom 1776 to 2026 graphic tee on a dress form with a navy star sun hat',
    '250 Years of Freedom tee, star sun hat', ['tees', 'bags'], true, 'bl'),
  '14': p('14', '14-plaid-shackets-rust-hat-wall.jpg', 1092, 1092,
    'Two plaid shackets and a rust tank on a barnwood wall with a rust felt hat and jeans below',
    'Plaid shackets, rust felt hat', ['jackets', 'bags', 'denim'], true, 'bl'),
  '15': p('15', '15-sherpa-quarter-zips-buffalo-check-backpacks.jpg', 1092, 1092,
    'Grey, berry and buffalo check sherpa quarter zips hanging over four buffalo check sherpa backpacks',
    'Sherpa quarter zips, buffalo check backpacks', ['cozy', 'jackets', 'bags'], true, 'bl'),
  '16': p('16', '16-muk-luks-slipper-boots.jpg', 1092, 1092,
    'Fair isle knit slipper boots with sherpa cuffs and Muk Luks tags on a wooden shelf',
    'Muk Luks slipper boots', ['cozy'], true, 'bl'),
  '17': p('17', '17-olive-vest-floral-top-closeup.jpg', 1092, 1092,
    'Close-up of an olive quilted vest over a dark floral top',
    'Olive quilted vest, floral top', ['jackets'], true, 'bl'),
  '18': p('18', '18-zebra-totes-wide-leg-jeans.jpg', 1092, 1092,
    'Pink and black zebra print totes beside very wide-leg faded jeans',
    'Zebra totes, wide-leg jeans', ['bags', 'denim'], true, 'bl'),
  '19': p('19', '19-denim-table-graphic-tees-wall.jpg', 874, 874,
    'The barnwood and galvanised denim table with graphic tees and caps on the wall behind',
    'The denim table', ['denim', 'tees'], true, 'none'),
  '20': p('20', '20-denim-stack-closeup.jpg', 874, 874,
    'A close stack of jeans showing back pockets and tags',
    'Jeans, stacked and tagged', ['denim'], true, 'bl'),
  '21': p('21', '21-blue-embroidered-crossbody-bag.jpg', 966, 1211,
    'A navy canvas bag with a white embroidered pattern and leather straps on barnwood',
    'Navy embroidered crossbody', ['bags'], false, 'ml'),
};

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sweaters', label: 'Sweaters and cardigans' },
  { id: 'jackets', label: 'Jackets and vests' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'denim', label: 'Denim' },
  { id: 'bags', label: 'Bags and hats' },
  { id: 'cozy', label: 'Cozy and gifts' },
  { id: 'tees', label: 'Graphic tees' },
];

// A look in the styler deck. Notes are Dawn's exact captions or nothing.
export type Look = {
  photo: PhotoId;
  pieces: string[]; // from the photo map
  short: string; // short pieces line for the text message
  note?: string; // Dawn's caption, quoted exactly
};

export type OccasionId = 'dinner' | 'town' | 'weekend' | 'holiday' | 'fun';
export type Occasion = { id: OccasionId; label: string; looks: Look[] };

export const occasions: Occasion[] = [
  {
    id: 'dinner',
    label: 'Dinner out',
    looks: [
      { photo: '03', pieces: ['Black ribbed midi dress', 'Leopard belt', 'Long cream coat'], short: 'black ribbed dress and cream coat', note: captions.boots },
    ],
  },
  {
    id: 'town',
    label: 'A day in town',
    looks: [
      { photo: '04', pieces: ['Taupe ribbed midi dress', 'Leopard belt', 'Long cream coat'], short: 'taupe ribbed dress and cream coat', note: captions.boots },
      // DRAFT: confirm this caption belongs to photo 08
      { photo: '08', pieces: ['Taupe cropped cardigan', 'Tan leather crossbody', 'Sailor-pocket wide-leg jeans'], short: 'taupe cardigan, crossbody and wide-leg jeans', note: captions.basics },
      { photo: '07', pieces: ['White cinched utility jacket', 'Wide-leg jeans'], short: 'white utility jacket and wide-leg jeans' },
    ],
  },
  {
    id: 'weekend',
    label: 'Weekend easy',
    looks: [
      { photo: '05', pieces: ['Leopard overalls, cream hat', 'Olive long vest over florals', 'Sherpa jacket, wide-leg jeans, woven tote'], short: 'fall looks at the shop door' },
      { photo: '06', pieces: ['Pink plaid shacket', 'Taupe wide-brim hat', 'Jeans'], short: 'pink plaid shacket and wide-brim hat' },
      { photo: '11', pieces: ['Aztec striped maxi', 'Denim jacket', 'Rust hat'], short: 'aztec maxi and denim jacket' },
      { photo: '14', pieces: ['Plaid shackets', 'Rust tank', 'Rust felt hat'], short: 'plaid shacket and rust felt hat' },
    ],
  },
  {
    id: 'holiday',
    label: 'Holiday season',
    looks: [
      { photo: '12', pieces: ['Merry & Bright snapback, red polka dot brim', 'MERRY snapback, buffalo plaid brim', 'Merry & Bright snapback, green stripe brim'], short: 'Merry & Bright snapbacks', note: captions.snapbacks },
      { photo: '15', pieces: ['Sherpa quarter zips in grey, berry and buffalo check', 'Buffalo check sherpa backpacks'], short: 'sherpa quarter zip' },
      { photo: '16', pieces: ['Fair isle knit slipper boots', 'Sherpa cuffs'], short: 'Muk Luks slipper boots' },
    ],
  },
  {
    id: 'fun',
    label: 'Something fun',
    looks: [
      { photo: '09', pieces: ['Green button cardigan', 'Purple velvet witch hat'], short: 'green cardigan' },
      { photo: '13', pieces: ['250 Years of Freedom 1776 to 2026 tee', 'Star sun hat'], short: '250 Years of Freedom tee' },
      { photo: '18', pieces: ['Pink zebra tote', 'Black zebra tote', 'Very wide-leg faded jeans'], short: 'zebra tote and wide-leg jeans' },
    ],
  },
];

// The hero rail: five hanger cards. Each one opens the styler on its occasion.
// Cards share a 9:10 frame. `focus` is the object-position that keeps each watermark whole:
// 04 mark is mid-left (crop the floor), 06 mark is bottom-left (crop the right edge),
// 08 mark is bottom-left (crop the top), 05 and 07 have none.
export const railLooks: { photo: PhotoId; name: string; occasion: OccasionId; focus: string }[] = [
  { photo: '04', name: 'A day in town', occasion: 'town', focus: '50% 0%' },
  { photo: '06', name: 'Pink plaid weather', occasion: 'weekend', focus: '0% 50%' },
  { photo: '05', name: 'Fall at the door', occasion: 'weekend', focus: '50% 0%' },
  { photo: '08', name: 'Easy taupe', occasion: 'town', focus: '50% 100%' },
  { photo: '07', name: 'Crisp white jacket', occasion: 'town', focus: '50% 0%' },
];

// Home bento: "New on the racks"
export const bentoTiles: PhotoId[] = ['12', '13', '14', '15', '18', '21'];

// /new grid: every photo from 03 to 21
export const newArrivals: PhotoId[] = [
  '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
  '13', '14', '15', '16', '17', '18', '19', '20', '21',
];

// What the Hold Request is about
export type HoldItem = {
  id: string;
  label: string; // "Dinner out look"
  detail?: string; // "black ribbed dress and cream coat"
  photo?: PhotoId;
  sized: boolean;
  kind?: 'piece' | 'facebook' | 'help';
};

export const occasionItem = (o: Occasion, lookIndex = 0): HoldItem => {
  const look = o.looks[lookIndex];
  return { id: `look-${o.id}-${look.photo}`, label: `${o.label} look`, detail: look.short, photo: look.photo, sized: photos[look.photo].sized };
};

export const photoItem = (id: PhotoId): HoldItem => ({
  id: `photo-${id}`,
  label: photos[id].caption,
  photo: id,
  sized: photos[id].sized,
});

export const stiffanyItem: HoldItem = {
  id: 'stiffany-03',
  label: "Stiffany's look",
  detail: 'black ribbed dress, leopard belt and cream coat',
  photo: '03',
  sized: true,
};

export const giftItem: HoldItem = {
  id: 'gift',
  label: 'holiday gift',
  detail: 'sherpa, slipper boots or a Merry & Bright cap',
  photo: '15',
  sized: false,
};

export const pickerItems: HoldItem[] = [
  ...occasions.map((o) => occasionItem(o)),
  { id: 'facebook', label: 'Something from Facebook', sized: true, kind: 'facebook' },
  { id: 'help', label: 'Not sure yet, help me pick', sized: true, kind: 'help' },
];
