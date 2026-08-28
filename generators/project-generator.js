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

    console.log('✔ Creating client structure...');
    copyTemplate(path.join(__dirname, '../templates/client'), path.join(projectDir, 'client'));
    
    // Update client package.json with project name
    const clientPkgPath = path.join(projectDir, 'client', 'package.json');
    if (fs.existsSync(clientPkgPath)) {
      const clientPkg = JSON.parse(fs.readFileSync(clientPkgPath, 'utf-8'));
      clientPkg.name = `${projectName}-client`;
      fs.writeFileSync(clientPkgPath, JSON.stringify(clientPkg, null, 2));
    }

    console.log('✔ Creating server structure...');
    copyTemplate(path.join(__dirname, '../templates/server'), path.join(projectDir, 'server'));

    // Update server package.json with project name
    const serverPkgPath = path.join(projectDir, 'server', 'package.json');
    if (fs.existsSync(serverPkgPath)) {
      const serverPkg = JSON.parse(fs.readFileSync(serverPkgPath, 'utf-8'));
      serverPkg.name = `${projectName}-server`;
      fs.writeFileSync(serverPkgPath, JSON.stringify(serverPkg, null, 2));
    }

    console.log('✔ Creating configuration files...');
    fs.writeFileSync(path.join(projectDir, '.env.example'), 'NODE_ENV=development\nPORT=5000\nVITE_API_URL=http://localhost:5000/api\n');
    fs.writeFileSync(path.join(projectDir, '.gitignore'), 'node_modules/\n.env\n.DS_Store\n');

    console.log('✔ Creating documentation...');
    const readmeContent = `# ${projectName}\n\nA Full-Stack project generated with SecureMERN.\n\n## Current Version\n\nV0.3\n\n## Quick Start\n\n\`\`\`bash\nnpx secure-mern create my-app\ncd my-app\nnpm install\nnpm run dev\n\`\`\`\n\n## Architecture\n\nReact + Vite\n     ↓\nExpress API\n     ↓\nNode.js\n\n## API Endpoints\n\n- \`GET /api/health\`\n\nThe development environment automatically starts both the React frontend and the Express API server.\n`;
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
        "dev:client": "cd client && npm run dev"
      },
      devDependencies: {
        "concurrently": "^8.2.2"
      }
    };
    fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(rootPackageJson, null, 2));

    console.log('\nProject created successfully!\n\nNext steps:\n');
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
