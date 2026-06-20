/**
 * Finsight — App Icon Generator
 * Run from the finsight-mobile root:
 *   node generate-icons.js
 *
 * Uses sharp from the server package (already installed).
 * Generates all required icon/splash PNGs in assets/images/.
 */

const path = require("path");
const fs   = require("fs");

// ── Locate sharp ──────────────────────────────────────────────────────────────
let sharp;
const candidates = [
  path.join(__dirname, "..", "server", "node_modules", "sharp"),
  path.join(__dirname, "node_modules", "sharp"),
  "sharp",
];
for (const p of candidates) {
  try { sharp = require(p); break; } catch (_) {}
}
if (!sharp) {
  console.error("❌  sharp not found. Run:  cd ../server && npm install");
  process.exit(1);
}

const OUT = path.join(__dirname, "assets", "images");
fs.mkdirSync(OUT, { recursive: true });

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG       = "#0A0C10";
const EMERALD  = "#00D68F";
const MINT     = "#4DFFB8";
const DEEP     = "#00845C";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ICON SVG  (1024 × 1024)
// Design: dark graphite bg · emerald gradient coin · bold dark "F"
// ─────────────────────────────────────────────────────────────────────────────
function mainIconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <!-- Background ambient glow -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="55%">
      <stop offset="0%"   stop-color="${EMERALD}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${BG}"       stop-opacity="0"/>
    </radialGradient>

    <!-- Coin face gradient: mint top-left → deep emerald bottom-right -->
    <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${MINT}"/>
      <stop offset="55%"  stop-color="${EMERALD}"/>
      <stop offset="100%" stop-color="${DEEP}"/>
    </linearGradient>

    <!-- Inner sheen: white top reflection -->
    <linearGradient id="sheen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <!-- Coin glow / shadow -->
    <filter id="coinGlow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="0"  stdDeviation="32" flood-color="${EMERALD}" flood-opacity="0.50"/>
      <feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="${DEEP}"    flood-opacity="0.40"/>
    </filter>

    <!-- Subtle inner shadow on F to make it feel pressed -->
    <filter id="letterShadow">
      <feDropShadow dx="0" dy="3" stdDeviation="8" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- ── Background ── -->
  <rect width="1024" height="1024" fill="${BG}"/>
  <rect width="1024" height="1024" fill="url(#bgGlow)"/>

  <!-- ── Coin (rounded square) ── -->
  <rect x="152" y="152" width="720" height="720" rx="196" ry="196"
        fill="url(#coinGrad)" filter="url(#coinGlow)"/>

  <!-- Top sheen highlight -->
  <rect x="152" y="152" width="720" height="360" rx="196" ry="196"
        fill="url(#sheen)"/>

  <!-- ── Letter "F" — geometric, precise, bold ── -->
  <!-- Vertical stroke -->
  <rect x="332" y="268" width="96" height="488" rx="12" ry="12"
        fill="${BG}" filter="url(#letterShadow)"/>
  <!-- Top horizontal bar -->
  <rect x="332" y="268" width="336" height="90"  rx="12" ry="12"
        fill="${BG}" filter="url(#letterShadow)"/>
  <!-- Middle horizontal bar -->
  <rect x="332" y="453" width="244" height="84"  rx="12" ry="12"
        fill="${BG}" filter="url(#letterShadow)"/>

  <!-- ── Trend-up accent dot: tiny emerald spark at top-right of coin ── -->
  <circle cx="796" cy="228" r="28" fill="${MINT}" opacity="0.85"/>
  <circle cx="796" cy="228" r="16" fill="${BG}" opacity="0.6"/>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANDROID FOREGROUND  (1024 × 1024, transparent bg)
// Coin + F centred, scaled to 72% to stay inside the adaptive safe zone
// ─────────────────────────────────────────────────────────────────────────────
function androidForegroundSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${MINT}"/>
      <stop offset="55%"  stop-color="${EMERALD}"/>
      <stop offset="100%" stop-color="${DEEP}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <filter id="coinGlow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="0"  stdDeviation="28" flood-color="${EMERALD}" flood-opacity="0.55"/>
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="${DEEP}"    flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Transparent bg — adaptive icon system applies its own shape -->

  <!-- Coin scaled to 72% (safe zone) centred at 512,512 -->
  <g transform="translate(512,512) scale(0.72) translate(-512,-512)">
    <rect x="152" y="152" width="720" height="720" rx="196" ry="196"
          fill="url(#coinGrad)" filter="url(#coinGlow)"/>
    <rect x="152" y="152" width="720" height="360" rx="196" ry="196"
          fill="url(#sheen)"/>
    <!-- F -->
    <rect x="332" y="268" width="96"  height="488" rx="12" fill="${BG}"/>
    <rect x="332" y="268" width="336" height="90"  rx="12" fill="${BG}"/>
    <rect x="332" y="453" width="244" height="84"  rx="12" fill="${BG}"/>
    <!-- Dot accent -->
    <circle cx="796" cy="228" r="28" fill="${MINT}" opacity="0.85"/>
    <circle cx="796" cy="228" r="16" fill="${BG}"   opacity="0.6"/>
  </g>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANDROID BACKGROUND  (1024 × 1024, solid dark)
// ─────────────────────────────────────────────────────────────────────────────
function androidBackgroundSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="65%">
      <stop offset="0%"   stop-color="#111820"/>
      <stop offset="100%" stop-color="${BG}"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANDROID MONOCHROME  (1024 × 1024, white-on-black for themed icons)
// ─────────────────────────────────────────────────────────────────────────────
function androidMonochromeSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#000000"/>
  <g transform="translate(512,512) scale(0.72) translate(-512,-512)">
    <rect x="152" y="152" width="720" height="720" rx="196" ry="196" fill="#ffffff"/>
    <rect x="332" y="268" width="96"  height="488" rx="12" fill="#000000"/>
    <rect x="332" y="268" width="336" height="90"  rx="12" fill="#000000"/>
    <rect x="332" y="453" width="244" height="84"  rx="12" fill="#000000"/>
  </g>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH ICON  (512 × 512, transparent — displayed on dark splash bg)
// ─────────────────────────────────────────────────────────────────────────────
function splashIconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${MINT}"/>
      <stop offset="55%"  stop-color="${EMERALD}"/>
      <stop offset="100%" stop-color="${DEEP}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0"  stdDeviation="20" flood-color="${EMERALD}" flood-opacity="0.60"/>
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="${DEEP}"    flood-opacity="0.40"/>
    </filter>
  </defs>
  <!-- Coin -->
  <rect x="56" y="56" width="400" height="400" rx="100" ry="100"
        fill="url(#coinGrad)" filter="url(#glow)"/>
  <rect x="56" y="56" width="400" height="200" rx="100" ry="100"
        fill="url(#sheen)"/>
  <!-- F -->
  <rect x="160" y="122" width="54"  height="268" rx="8" fill="${BG}"/>
  <rect x="160" y="122" width="192" height="50"  rx="8" fill="${BG}"/>
  <rect x="160" y="242" width="140" height="48"  rx="8" fill="${BG}"/>
  <!-- Dot -->
  <circle cx="418" cy="94" r="18" fill="${MINT}" opacity="0.85"/>
  <circle cx="418" cy="94" r="10" fill="${BG}"   opacity="0.6"/>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FAVICON  (48 × 48)
// ─────────────────────────────────────────────────────────────────────────────
function faviconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${MINT}"/>
      <stop offset="100%" stop-color="${DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="11" fill="url(#g)"/>
  <rect x="14" y="10" width="6"  height="28" rx="1.5" fill="${BG}"/>
  <rect x="14" y="10" width="20" height="6"  rx="1.5" fill="${BG}"/>
  <rect x="14" y="23" width="15" height="5"  rx="1.5" fill="${BG}"/>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Render helpers
// ─────────────────────────────────────────────────────────────────────────────
async function svgToPng(svgString, outPath, width, height) {
  await sharp(Buffer.from(svgString))
    .resize(width, height)
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`✅  ${path.basename(outPath)}  (${width}×${height})`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  console.log("\n🎨  Generating Finsight icons...\n");

  await svgToPng(mainIconSVG(),           path.join(OUT, "icon.png"),                       1024, 1024);
  await svgToPng(androidForegroundSVG(),  path.join(OUT, "android-icon-foreground.png"),    1024, 1024);
  await svgToPng(androidBackgroundSVG(),  path.join(OUT, "android-icon-background.png"),    1024, 1024);
  await svgToPng(androidMonochromeSVG(),  path.join(OUT, "android-icon-monochrome.png"),    1024, 1024);
  await svgToPng(splashIconSVG(),         path.join(OUT, "splash-icon.png"),                 512,  512);
  await svgToPng(faviconSVG(),            path.join(OUT, "favicon.png"),                      48,   48);

  console.log("\n🚀  All icons generated in assets/images/\n");
})();
