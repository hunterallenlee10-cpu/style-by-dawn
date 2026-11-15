// hex -> oklch (for the @theme token list)
const hexes = {linen:'#FAF6F0',petal:'#F3E7E3',sage:'#DCE5DD',mint:'#B8CABD',rose:'#9B4555',roseDeep:'#7F3343',green:'#3F5747',espresso:'#2A211E',barnwood:'#6A5A54',seam:'#E5D8D0',wood:'#785450',success:'#3F6B4F',error:'#A3322F',onRose:'#FFF9F5'};
const lin=c=>{c/=255;return c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4};
function ok(hex){const r=lin(parseInt(hex.slice(1,3),16)),g=lin(parseInt(hex.slice(3,5),16)),b=lin(parseInt(hex.slice(5,7),16));
const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b),m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b),s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
const L=0.2104542553*l+0.7936177850*m-0.0040720468*s,A=1.9779984951*l-2.4285922050*m+0.4505937099*s,B=0.0259040371*l+0.7827717662*m-0.8086757660*s;
const C=Math.hypot(A,B);let H=Math.atan2(B,A)*180/Math.PI;if(H<0)H+=360;return `oklch(${(L*100).toFixed(2)}% ${C.toFixed(4)} ${H.toFixed(2)})`}
const lum=h=>{const [r,g,b]=[1,3,5].map(i=>lin(parseInt(h.slice(i,i+2),16)));return 0.2126*r+0.7152*g+0.0722*b};
const cr=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return ((x+0.05)/(y+0.05)).toFixed(2)};
for (const [k,v] of Object.entries(hexes)) console.log(k.padEnd(10),v,ok(v));
const pairs=[['espresso','linen'],['espresso','petal'],['espresso','sage'],['espresso','mint'],['barnwood','linen'],['barnwood','petal'],['barnwood','sage'],['onRose','rose'],['onRose','roseDeep'],['rose','linen'],['rose','petal'],['green','linen'],['green','sage'],['green','petal'],['rose','sage']];
for (const [a,b] of pairs) console.log(`${a} on ${b}: ${cr(hexes[a],hexes[b])}`);
