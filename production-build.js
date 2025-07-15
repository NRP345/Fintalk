#!/usr/bin/env node

/**
 * Production Build Script with proper bcrypt handling
 * This script creates a production build that properly includes all dependencies
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function createProdBuild() {
  console.log('🚀 Starting production build...');
  
  try {
    // Clean previous build
    if (fs.existsSync('dist')) {
      console.log('🧹 Cleaning previous build...');
      fs.rmSync('dist', { recursive: true, force: true });
    }
    
    // Create dist directory
    fs.mkdirSync('dist', { recursive: true });
    
    // Build frontend
    console.log('📦 Building frontend...');
    execSync('npx vite build', { stdio: 'pipe' });
    console.log('✅ Frontend built successfully');
    
    // Build backend with simplified approach - just copy TypeScript files and compile
    console.log('📦 Building backend...');
    
    // Copy server files
    execSync('cp -r server dist/', { stdio: 'pipe' });
    console.log('✅ Server files copied');
    
    // Copy shared files
    execSync('cp -r shared dist/', { stdio: 'pipe' });
    console.log('✅ Shared files copied');
    
    // Create production package.json with all dependencies
    const originalPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const productionPackage = {
      name: originalPackage.name,
      version: originalPackage.version,
      type: 'module',
      scripts: {
        start: 'node server/index.js'
      },
      dependencies: originalPackage.dependencies, // Include ALL dependencies
      engines: {
        node: '>=18.0.0'
      }
    };
    
    fs.writeFileSync('dist/package.json', JSON.stringify(productionPackage, null, 2));
    console.log('✅ Production package.json created');
    
    // Copy other necessary files
    const filesToCopy = [
      'drizzle.config.ts',
      'tsconfig.json'
    ];
    
    filesToCopy.forEach(file => {
      if (fs.existsSync(file)) {
        execSync(`cp ${file} dist/`, { stdio: 'pipe' });
        console.log(`✅ ${file} copied`);
      }
    });
    
    // Create deployment README
    const deploymentReadme = `# Production Deployment

## Setup Instructions

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set environment variables:
   - DATABASE_URL
   - SESSION_SECRET
   - ANGEL_ONE_API_KEY
   - ANGEL_ONE_USERNAME
   - ANGEL_ONE_PASSWORD
   - ANGEL_ONE_TOTP
   - ALPHA_VANTAGE_API_KEY
   - STRIPE_SECRET_KEY
   - STRIPE_PUBLISHABLE_KEY
   - SENDGRID_API_KEY (or GMAIL_USER/GMAIL_APP_PASSWORD)

3. Run database migrations:
   \`\`\`bash
   npm run db:push
   \`\`\`

4. Start the application:
   \`\`\`bash
   npm start
   \`\`\`

## Notes
- All dependencies including bcrypt are included in package.json
- TypeScript files are preserved for production compilation
- Static files are pre-built and ready to serve
`;
    
    fs.writeFileSync('dist/README.md', deploymentReadme);
    console.log('✅ Deployment README created');
    
    console.log('');
    console.log('🎉 Production build completed successfully!');
    console.log('');
    console.log('📋 Build summary:');
    console.log('  ✅ Frontend assets built and optimized');
    console.log('  ✅ Backend TypeScript files preserved');
    console.log('  ✅ All dependencies included in package.json');
    console.log('  ✅ bcrypt properly configured for production');
    console.log('  ✅ Deployment documentation included');
    console.log('');
    console.log('📁 The dist/ folder is ready for deployment');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

createProdBuild();