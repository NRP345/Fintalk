import { build } from 'esbuild';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// Create production package.json with proper dependencies
function createProductionPackageJson() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Ensure bcrypt is in production dependencies
  const productionPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    type: packageJson.type,
    scripts: {
      start: "node index.js"
    },
    dependencies: {
      // Copy all dependencies
      ...packageJson.dependencies,
      // Ensure bcrypt is explicitly included
      bcrypt: packageJson.dependencies.bcrypt || "^6.0.0"
    }
  };
  
  fs.writeFileSync('dist/package.json', JSON.stringify(productionPackageJson, null, 2));
  console.log('Created production package.json with bcrypt dependency');
}

async function buildApp() {
  try {
    console.log('Building frontend...');
    await execAsync('npx vite build');
    
    console.log('Building backend...');
    await build({
      entryPoints: ['server/index.ts'],
      platform: 'node',
      bundle: true,
      format: 'esm',
      outdir: 'dist',
      external: [
        // Keep only system-level packages as external
        'fsevents',
        'cpu-features',
        // Keep bcrypt external and handle with proper package.json
        'bcrypt'
      ],
      minify: false,
      sourcemap: true,
      target: 'node18',
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    
    // Create production package.json
    createProductionPackageJson();
    
    console.log('Build completed successfully!');
    console.log('To deploy: copy dist/ folder with package.json and run npm install in production');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();