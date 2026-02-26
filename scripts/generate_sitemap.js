import { EXPERIENCES } from '../src/data/experiences.js';
import fs from 'fs';

const BASE = 'https://uhigh.xyz';
const TODAY = new Date().toISOString().split('T')[0];
const FIXED = ['fractal', 'fluid', 'particles', 'tunnel', 'plexus', 'mandala', 'abyss'];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE}/gallery</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

// Fixed experiences (higher priority)
FIXED.forEach(id => {
    xml += `  <url>
    <loc>${BASE}/experience/${id}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

// Dynamic experiences
EXPERIENCES.filter(e => !FIXED.includes(e.id)).forEach(e => {
    xml += `  <url>
    <loc>${BASE}/experience/${e.id}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
});

xml += `</urlset>`;

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`✅ Sitemap created with ${2 + FIXED.length + EXPERIENCES.filter(e => !FIXED.includes(e.id)).length} URLs`);
