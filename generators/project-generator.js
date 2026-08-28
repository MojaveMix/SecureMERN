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

    console.log('✔ Creating server structure...');
    copyTemplate(path.join(__dirname, '../templates/server'), path.join(projectDir, 'server'));

    console.log('✔ Creating configuration files...');
    fs.writeFileSync(path.join(projectDir, '.env.example'), 'NODE_ENV=development\n');
    fs.writeFileSync(path.join(projectDir, '.gitignore'), 'node_modules/\n.env\n.DS_Store\n');

    console.log('✔ Creating documentation...');
    const readmeContent = `# ${projectName}\n\nA Full-Stack project generated with SecureMERN.\n\n## Structure\n\n### Client\n\nThe frontend application.\n\n### Server\n\nThe backend application.\n\n## Getting Started\n\nThis project was generated using SecureMERN CLI.\n\n## Current Version\n\nSecureMERN V0.2\n`;
    fs.writeFileSync(path.join(projectDir, 'README.md'), readmeContent);

    console.log('\nProject created successfully!\n\nNext steps:\n');
    console.log(`  cd ${projectName}\n`);
  } catch (error) {
    console.error('✖ An error occurred while creating the project:', error.message);
    process.exit(1);
  }
}

function copyTemplate(src, dest) {
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
