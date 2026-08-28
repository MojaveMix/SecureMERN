#!/usr/bin/env node

const { generateProject } = require('../generators/project-generator');

const args = process.argv.slice(2);
const command = args[0];
const projectName = args[1];

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

if (command === 'create') {
  generateProject(projectName);
} else {
  console.log(`${colors.cyan}${colors.bold}SecureMERN CLI${colors.reset}\n\n${colors.bold}Usage:${colors.reset}\n  secure-mern create <project-name>`);
  process.exit(1);
}
