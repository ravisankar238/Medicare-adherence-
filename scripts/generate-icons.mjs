import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function generateIconPNG(size, isMaskable = false) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (1 + width * 4));

  const center = size / 2;
  const radius = size * (isMaskable ? 0.38 : 0.44);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background color: #0f766e (Teal 700) or rounded badge
      let r = 15, g = 118, b = 110, a = 255;

      if (!isMaskable) {
        // Rounded squircle background
        const cornerR = size * 0.22;
        const qx = Math.max(0, Math.abs(dx) - (size / 2 - cornerR));
        const qy = Math.max(0, Math.abs(dy) - (size / 2 - cornerR));
        const cornerDist = Math.sqrt(qx * qx + qy * qy);
        if (cornerDist > cornerR) {
          a = 0; // Transparent
        }
      }

      if (a > 0) {
        // Draw medical cross + heart motif
        // Cross vertical bar:
        const crossW = size * 0.12;
        const crossH = size * 0.52;
        const inVBar = Math.abs(dx) <= crossW / 2 && Math.abs(dy) <= crossH / 2;
        const inHBar = Math.abs(dy) <= crossW / 2 && Math.abs(dx) <= crossH / 2;

        // Inner glowing ring or circle
        const ringDist = Math.abs(dist - size * 0.28);
        const inRing = ringDist <= (size * 0.02);

        if (inVBar || inHBar) {
          // White medical plus symbol
          r = 255;
          g = 255;
          b = 255;
        } else if (inRing) {
          // Light teal glow
          r = 45;
          g = 212;
          b = 191; // teal-400
        } else {
          // Subtle gradient: slightly darker towards edges
          const factor = Math.max(0, 1 - dist / (size * 0.6));
          r = Math.floor(13 + factor * 7);
          g = Math.floor(90 + factor * 35);
          b = Math.floor(85 + factor * 30);
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // Header chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // No interlace

  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generateIconPNG(192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generateIconPNG(512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generateIconPNG(512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateIconPNG(180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generateIconPNG(64, false));

// Also generate icon.svg
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#0f766e" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#tealGrad)" />
  <circle cx="256" cy="256" r="160" fill="none" stroke="#5eead4" stroke-width="8" stroke-dasharray="8 12" opacity="0.4" />
  <!-- Medical Cross -->
  <path d="M224 136 h64 v88 h88 v64 h-88 v88 h-64 v-88 h-88 v-64 h88 z" fill="#ffffff" filter="url(#shadow)" rx="16"/>
  <!-- Gentle Heart accent in center -->
  <path d="M256 244 c4 -8 16 -12 24 -4 c9 9 4 20 -24 38 c-28 -18 -33 -29 -24 -38 c8 -8 20 -4 24 4 z" fill="#0d9488" opacity="0.9"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

console.log('Successfully generated all PWA icons in /public!');
