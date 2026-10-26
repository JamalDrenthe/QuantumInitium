import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const THEME_BG = '#05070d';
const BRAND_NAME = 'QuantumInitium Ltd';
const BRAND_SHORT_NAME = 'QuantumInitium';
const BRAND_DESCRIPTION = 'Holdingstructuur en strategisch deelnemingenoverzicht voor QuantumInitium Ltd';

// Hex to RGBA
function hexToRgba(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b, alpha: 1 };
}

// Build standard ICO container with PNG entries
function createIco(pngBuffers) {
  // pngBuffers: array of { width, height, buffer }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(pngBuffers.length, 4); // count

  let offset = 6 + 16 * pngBuffers.length;
  const dirEntries = [];

  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(item.buffer.length, 8); // data size
    entry.writeUInt32LE(offset, 12); // data offset
    dirEntries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map((b) => b.buffer)]);
}

async function run() {
  const publicDir = path.resolve('public');
  const distDir = path.resolve('dist');
  const svgSource = path.join(publicDir, 'favicon.svg');

  console.log('🚀 Starting LogoAnywhere Digital Asset Pack generation...');

  if (!fs.existsSync(svgSource)) {
    throw new Error(`Master SVG not found at ${svgSource}`);
  }

  const svgContent = fs.readFileSync(svgSource);
  const bg = hexToRgba(THEME_BG);

  // 1. Favicons (16x16, 32x32, 48x48)
  console.log('🎨 Generating Favicon PNGs & ICO...');
  const icoSizes = [16, 32, 48];
  const icoPngs = [];

  for (const size of icoSizes) {
    const pngBuf = await sharp(svgContent)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();

    fs.writeFileSync(path.join(publicDir, `favicon-${size}x${size}.png`), pngBuf);
    icoPngs.push({ width: size, height: size, buffer: pngBuf });
    console.log(`  ✓ favicon-${size}x${size}.png`);
  }

  const icoBuf = createIco(icoPngs);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
  console.log('  ✓ favicon.ico (multi-size: 16x16, 32x32, 48x48)');

  // 2. Apple Touch Icon (180x180, non-transparent #05070d, 140x140 safe zone)
  console.log('🍎 Generating Apple Touch Icon (180x180, solid background, safe zone)...');
  const appleInner = await sharp(svgContent)
    .resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const appleTouchIcon = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: appleInner, gravity: 'center' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);
  console.log('  ✓ apple-touch-icon.png');

  // 3. Android / PWA Icons (192x192 & 512x512, solid background with 80% safe zone)
  console.log('📱 Generating Android / PWA Icons (192x192 & 512x512)...');
  for (const size of [192, 512]) {
    const innerSize = Math.round(size * 0.8);
    const inner = await sharp(svgContent)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    const pwaIcon = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bg,
      },
    })
      .composite([{ input: inner, gravity: 'center' }])
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(publicDir, `android-chrome-${size}x${size}.png`), pwaIcon);
    // Also keep icon-192.png / icon-512.png for backwards-compat
    fs.writeFileSync(path.join(publicDir, `icon-${size}.png`), pwaIcon);
    console.log(`  ✓ android-chrome-${size}x${size}.png & icon-${size}.png`);
  }

  // 4. Social Avatar (1000x1000, 20% safe zone margin => 700x700 logo)
  console.log('👤 Generating Social Avatar (1000x1000, 20% circular cut margin)...');
  const avatarInner = await sharp(svgContent)
    .resize(700, 700, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const socialAvatar = await sharp({
    create: {
      width: 1000,
      height: 1000,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: avatarInner, gravity: 'center' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'social-avatar.png'), socialAvatar);
  console.log('  ✓ social-avatar.png');

  // 5. Open Graph Image (1200x630, safe zone central 630x320)
  console.log('🌐 Generating Open Graph Preview (1200x630, WhatsApp/LinkedIn safe)...');
  // Create an executive luxury SVG background with centered logo & typography within the central 630x320 box
  const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#141c2e" />
      <stop offset="45%" stop-color="#0a101d" />
      <stop offset="100%" stop-color="#05070d" />
    </radialGradient>
    <radialGradient id="goldAmbient" cx="50%" cy="35%" r="40%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.18" />
      <stop offset="60%" stop-color="#d4af37" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#05070d" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffd700" stop-opacity="0" />
      <stop offset="30%" stop-color="#ffd700" stop-opacity="0.7" />
      <stop offset="50%" stop-color="#fff0aa" stop-opacity="1" />
      <stop offset="70%" stop-color="#ffd700" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#ffd700" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="textGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#fde047" />
      <stop offset="75%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
  </defs>

  <!-- Solid Canvas Background -->
  <rect width="1200" height="630" fill="#05070d" />
  <rect width="1200" height="630" fill="url(#bgGlow)" />
  <circle cx="600" cy="270" r="320" fill="url(#goldAmbient)" />

  <!-- Subtle Executive Grid Lines -->
  <line x1="0" y1="629" x2="1200" y2="629" stroke="rgba(255, 215, 0, 0.2)" stroke-width="1" />
  <line x1="285" y1="500" x2="915" y2="500" stroke="url(#goldLine)" stroke-width="1.5" />

  <!-- Central Safe Zone Box Guide (600x320 centered: x=300 to 900, y=155 to 475) -->
  <g id="safe-content">
    <!-- Emblem will be composited at (500, 150) size 200x200 -->

    <!-- Typography -->
    <text x="600" y="415" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800" letter-spacing="7" fill="url(#textGold)" text-anchor="middle">
      QUANTUM INITIUM
    </text>
    <text x="600" y="455" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" letter-spacing="5" fill="#38bdf8" text-anchor="middle">
      LTD • LONDON HQ
    </text>
    <text x="600" y="482" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" letter-spacing="2" fill="#94a3b8" text-anchor="middle">
      INTERNATIONALE TECH-, AI- &amp; VASTGOEDGROEP
    </text>

    <!-- Top Tag -->
    <rect x="490" y="100" width="220" height="28" rx="14" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <text x="600" y="119" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" letter-spacing="2.5" fill="#facc15" text-anchor="middle">
      PRE-IPO HOLDING
    </text>
  </g>
</svg>
`;

  const ogEmblem = await sharp(svgContent)
    .resize(230, 230, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const ogBase = await sharp(Buffer.from(ogSvg)).png().toBuffer();

  const ogImage = await sharp(ogBase)
    .composite([
      {
        input: ogEmblem,
        left: 600 - 115, // centered horizontally
        top: 145, // positioned right above the text
      },
    ])
    .png({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogImage);
  console.log('  ✓ og-image.png (1200x630, safe zone centered)');

  // 6. site.webmanifest
  console.log('📄 Writing site.webmanifest...');
  const manifest = {
    name: BRAND_NAME,
    short_name: BRAND_SHORT_NAME,
    description: BRAND_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: THEME_BG,
    theme_color: THEME_BG,
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('  ✓ site.webmanifest');

  // Copy all generated files to dist/ if dist exists
  if (fs.existsSync(distDir)) {
    console.log('📦 Syncing assets to dist/...');
    const filesToSync = [
      'favicon.ico',
      'favicon.svg',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'favicon-48x48.png',
      'apple-touch-icon.png',
      'android-chrome-192x192.png',
      'android-chrome-512x512.png',
      'icon-192.png',
      'icon-512.png',
      'social-avatar.png',
      'og-image.png',
      'site.webmanifest',
    ];

    for (const f of filesToSync) {
      const src = path.join(publicDir, f);
      const dst = path.join(distDir, f);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst);
      }
    }
    console.log('  ✓ All assets copied to dist/');
  }

  console.log('\n✨ LogoAnywhere Asset Pack successfully generated!');
}

run().catch((err) => {
  console.error('❌ Error during asset generation:', err);
  process.exit(1);
});
