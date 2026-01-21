const fs = require('fs');
const path = require('path');

// Configuration
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://electric-meter-portal.vercel.app';
const OUTPUT_PATH = path.join(__dirname, '../out/sitemap.xml');
const PUBLIC_PATH = path.join(__dirname, '../public/sitemap.xml');

// Static routes
const routes = [
  '/',
  '/dashboard',
  '/metrics',
  '/analytics',
  '/info',
];

// Generate sitemap XML
function generateSitemap() {
  const currentDate = new Date().toISOString();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to public directory for development
  fs.writeFileSync(PUBLIC_PATH, sitemap);
  console.log(`✅ Sitemap generated at ${PUBLIC_PATH}`);

  // Write to output directory if it exists (for production build)
  const outputDir = path.dirname(OUTPUT_PATH);
  if (fs.existsSync(outputDir)) {
    fs.writeFileSync(OUTPUT_PATH, sitemap);
    console.log(`✅ Sitemap generated at ${OUTPUT_PATH}`);
  }
}

// Generate robots.txt
function generateRobotsTxt() {
  const robotsPath = path.join(__dirname, '../out/robots.txt');
  const publicRobotsPath = path.join(__dirname, '../public/robots.txt');
  
  const robots = `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml`;

  // Update public robots.txt
  fs.writeFileSync(publicRobotsPath, robots);
  console.log(`✅ Robots.txt updated at ${publicRobotsPath}`);

  // Copy to output directory if it exists
  const outputDir = path.dirname(robotsPath);
  if (fs.existsSync(outputDir)) {
    fs.writeFileSync(robotsPath, robots);
    console.log(`✅ Robots.txt generated at ${robotsPath}`);
  }
}

// Main execution
try {
  generateSitemap();
  generateRobotsTxt();
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}