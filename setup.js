#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function checkCommand(command) {
  try {
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function runCommand(command, cwd = process.cwd()) {
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash'
    });
    return true;
  } catch (error) {
    return false;
  }
}

function checkPrerequisites() {
  log('🔍 Checking prerequisites...', 'blue');
  
  // Check Node.js
  if (!checkCommand('node --version')) {
    logError('Node.js is not installed. Please install Node.js 18+ first.');
    logInfo('Download from: https://nodejs.org/');
    return false;
  }
  
  // Check npm
  if (!checkCommand('npm --version')) {
    logError('npm is not installed. Please install npm first.');
    return false;
  }
  
  // Check Docker
  if (!checkCommand('docker --version')) {
    logError('Docker is not installed or not running. Please install Docker Desktop.');
    logInfo('Download from: https://www.docker.com/products/docker-desktop/');
    return false;
  }
  
  // Check Docker Compose
  if (!checkCommand('docker-compose --version')) {
    logError('Docker Compose is not available. Please install Docker Compose.');
    return false;
  }
  
  logSuccess('All prerequisites are satisfied');
  return true;
}

function installDependencies() {
  log('📦 Installing dependencies...', 'blue');
  
  // Install backend dependencies
  logInfo('Installing backend dependencies...');
  if (!runCommand('npm install', path.join(process.cwd(), 'backend'))) {
    logError('Failed to install backend dependencies');
    return false;
  }
  logSuccess('Backend dependencies installed');
  
  // Install frontend dependencies
  logInfo('Installing frontend dependencies...');
  if (!runCommand('npm install', path.join(process.cwd(), 'frontend'))) {
    logError('Failed to install frontend dependencies');
    return false;
  }
  logSuccess('Frontend dependencies installed');
  
  return true;
}

function verifySetup() {
  log('🔍 Verifying setup...', 'blue');
  
  const requiredFiles = [
    'docker-compose.yml',
    'backend/package.json',
    'backend/src/index.ts',
    'backend/prisma/schema.prisma',
    'frontend/package.json',
    'frontend/src/App.tsx',
    'frontend/index.html'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      logError(`Missing required file: ${file}`);
      return false;
    }
  }
  
  logSuccess('All required files are present');
  return true;
}

function main() {
  log('🚀 Setting up Layout Builder project...', 'blue');
  log('');
  
  // Check if we're in the right directory
  if (!fs.existsSync('docker-compose.yml')) {
    logError('Please run this script from the project root directory');
    process.exit(1);
  }
  
  // Check prerequisites
  if (!checkPrerequisites()) {
    process.exit(1);
  }
  
  log('');
  
  // Install dependencies
  if (!installDependencies()) {
    process.exit(1);
  }
  
  log('');
  
  // Verify setup
  if (!verifySetup()) {
    process.exit(1);
  }
  
  log('');
  logSuccess('Setup completed successfully!');
  log('');
  log('🎯 Next steps:', 'yellow');
  log('1. Run: npm start');
  log('2. Visit: http://localhost:3000');
  log('3. Start building your layouts!');
  log('');
  log('🔧 Available commands:', 'yellow');
  log('- npm start     - Start the application');
  log('- npm run dev   - Start in development mode');
  log('- npm run stop  - Stop all containers');
  log('- npm run clean - Remove all containers and volumes');
  log('');
  log('💡 Tip: Make sure Docker Desktop is running before starting the application', 'blue');
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  log('Layout Builder Setup Script', 'blue');
  log('');
  log('Usage: node setup.js [options]', 'yellow');
  log('');
  log('Options:', 'yellow');
  log('  --help, -h    Show this help message');
  log('  --check       Only check prerequisites');
  log('  --verify      Only verify setup');
  log('');
  log('This script will:', 'blue');
  log('1. Check prerequisites (Node.js, npm, Docker)');
  log('2. Install dependencies for both frontend and backend');
  log('3. Verify that all required files are present');
  log('');
  process.exit(0);
}

if (args.includes('--check')) {
  if (checkPrerequisites()) {
    logSuccess('All prerequisites are satisfied');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

if (args.includes('--verify')) {
  if (verifySetup()) {
    logSuccess('Setup verification passed');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Run the main setup
main(); 