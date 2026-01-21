const fs = require('fs');
const path = require('path');

// Configuration
const PUBLIC_DIR = path.join(__dirname, '../public');
const OUT_DIR = path.join(__dirname, '../out');

// Image optimization settings
const OPTIMIZATION_CONFIG = {
  svg: {
    removeComments: true,
    removeWhitespace: true,
    minifyStyles: true,
  },
  general: {
    quality: 85,
    progressive: true,
  }
};

// Optimize SVG files
function optimizeSVG(content) {
  return content
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .trim();
}

// Process images in directory
function processImages(dir) {
  const files = fs.readdirSync(dir);
  let optimizedCount = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      optimizedCount += processImages(filePath);
    } else if (path.extname(file).toLowerCase() === '.svg') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const optimized = optimizeSVG(content);
        
        if (optimized.length < content.length) {
          fs.writeFileSync(filePath, optimized);
          const savings = ((content.length - optimized.length) / content.length * 100).toFixed(1);
          console.log(`✅ Optimized ${file}: ${savings}% smaller`);
          optimizedCount++;
        }
      } catch (error) {
        console.warn(`⚠️  Could not optimize ${file}:`, error.message);
      }
    }
  });

  return optimizedCount;
}

// Copy and optimize assets
function copyAndOptimizeAssets() {
  if (!fs.existsSync(OUT_DIR)) {
    console.log('❌ Output directory not found. Run build first.');
    return;
  }

  // Copy public assets to out directory if not already there
  const publicAssets = ['favicon.ico', 'manifest.json', 'sw.js'];
  
  publicAssets.forEach(asset => {
    const srcPath = path.join(PUBLIC_DIR, asset);
    const destPath = path.join(OUT_DIR, asset);
    
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`📁 Copied ${asset} to output directory`);
    }
  });
}

// Generate performance budget report
function generatePerformanceBudget() {
  const budgetPath = path.join(__dirname, '../lighthouse-budget.json');
  const budget = {
    "budget": [
      {
        "path": "/*",
        "timings": [
          {
            "metric": "first-contentful-paint",
            "budget": 2000
          },
          {
            "metric": "largest-contentful-paint",
            "budget": 3000
          },
          {
            "metric": "cumulative-layout-shift",
            "budget": 0.1
          }
        ],
        "resourceSizes": [
          {
            "resourceType": "script",
            "budget": 300
          },
          {
            "resourceType": "stylesheet",
            "budget": 100
          },
          {
            "resourceType": "image",
            "budget": 500
          },
          {
            "resourceType": "total",
            "budget": 1000
          }
        ]
      }
    ]
  };

  fs.writeFileSync(budgetPath, JSON.stringify(budget, null, 2));
  console.log(`📊 Performance budget generated at ${budgetPath}`);
}

// Main execution
try {
  console.log('🚀 Starting image optimization...');
  
  // Process images in public directory
  const publicOptimized = processImages(PUBLIC_DIR);
  
  // Process images in output directory if it exists
  let outOptimized = 0;
  if (fs.existsSync(OUT_DIR)) {
    outOptimized = processImages(OUT_DIR);
    copyAndOptimizeAssets();
  }
  
  generatePerformanceBudget();
  
  console.log(`✅ Optimization complete! Optimized ${publicOptimized + outOptimized} files.`);
} catch (error) {
  console.error('❌ Error during optimization:', error);
  process.exit(1);
}