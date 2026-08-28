const fs = require('node:fs');
const path = require('node:path');

function generateProject(projectName) {
  if (!projectName) {
    console.error('✖ Please provide a project name.\n\nUsage:\n  secure-mern create <project-name>');
    process.exit(1);
  }

  const isValidName = /^[a-zA-Z0-9-_]+$/.test(projectName);
  if (!isValidName) {
    console.error('✖ Invalid project name. Use only letters, numbers, dashes, and underscores.');
    process.exit(1);
  }

  const projectDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    console.error(`✖ Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  console.log('SecureMERN\n');
  console.log('✔ Creating project...');

  try {
    fs.mkdirSync(projectDir, { recursive: true });

    console.log('✔ Creating frontend...');
    copyTemplate(path.join(__dirname, '../templates/client'), path.join(projectDir, 'client'));
    
    // Update client package.json with project name
    const clientPkgPath = path.join(projectDir, 'client', 'package.json');
    if (fs.existsSync(clientPkgPath)) {
      const clientPkg = JSON.parse(fs.readFileSync(clientPkgPath, 'utf-8'));
      clientPkg.name = `${projectName}-client`;
      fs.writeFileSync(clientPkgPath, JSON.stringify(clientPkg, null, 2));
    }

    console.log('✔ Creating backend...');
    copyTemplate(path.join(__dirname, '../templates/server'), path.join(projectDir, 'server'));

    // Update server package.json with project name
    const serverPkgPath = path.join(projectDir, 'server', 'package.json');
    if (fs.existsSync(serverPkgPath)) {
      const serverPkg = JSON.parse(fs.readFileSync(serverPkgPath, 'utf-8'));
      serverPkg.name = `${projectName}-server`;
      fs.writeFileSync(serverPkgPath, JSON.stringify(serverPkg, null, 2));
    }

    console.log('✔ Configuring security defaults...');
    console.log('✔ Configuring error handling...');
    console.log('✔ Configuring rate limiting...');

    const envExample = `NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api

DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=secure_mern_dev

JWT_ACCESS_SECRET=change-me-in-development
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change-me-in-development
JWT_REFRESH_EXPIRES_IN=7d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
BODY_LIMIT=10kb
`;
    fs.writeFileSync(path.join(projectDir, '.env.example'), envExample);
    fs.writeFileSync(path.join(projectDir, '.gitignore'), 'node_modules/\n.env\n.DS_Store\n');

    console.log('✔ Creating documentation...');
    const readmeContent = `# ${projectName}

A Full-Stack project generated with SecureMERN.

## Current Version

V0.6

## Quick Start

\`\`\`bash
npx secure-mern create my-app
cd my-app
cp .env.example .env
npm install
npm run db:migrate
npm run dev
\`\`\`

> **Note:** Make sure to replace \`JWT_ACCESS_SECRET\` and \`JWT_REFRESH_SECRET\` in your \`.env\` file with strong secrets before deploying to production.

## Architecture

React + Vite
     ↓
Express API
     ↓
Node.js

## Authentication

SecureMERN provides a ready-to-use authentication foundation.

Features:
- Registration
- Login
- Password hashing
- JWT access tokens
- Refresh tokens
- Logout
- Protected routes

## API Endpoints

- \`GET /api/health\`
- \`POST /api/auth/register\`
- \`POST /api/auth/login\`
- \`POST /api/auth/refresh\`
- \`POST /api/auth/logout\`
- \`GET /api/auth/me\` (Protected)

The development environment automatically starts both the React frontend and the Express API server.
`;
    fs.writeFileSync(path.join(projectDir, 'README.md'), readmeContent);

    const rootPackageJson = {
      name: projectName,
      version: "0.1.0",
      private: true,
      scripts: {
        "install": "npm run install:client && npm run install:server",
        "install:client": "cd client && npm install",
        "install:server": "cd server && npm install",
        "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
        "dev:server": "cd server && npm run dev",
        "dev:client": "cd client && npm run dev",
        "db:migrate": "cd server && npx sequelize-cli db:migrate",
        "db:migrate:undo": "cd server && npx sequelize-cli db:migrate:undo",
        "db:seed": "cd server && npx sequelize-cli db:seed:all"
      },
      devDependencies: {
        "concurrently": "^8.2.2"
      }
    };
    fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(rootPackageJson, null, 2));

    console.log('\nSecureMERN project created successfully!\n\nNext steps:\n');
    console.log(`  cd ${projectName}`);
    console.log(`  npm install`);
    console.log(`  npm run dev\n`);
  } catch (error) {
    console.error('✖ An error occurred while creating the project:', error.message);
    process.exit(1);
  }
}

function copyTemplate(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyTemplate(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

module.exports = { generateProject };
