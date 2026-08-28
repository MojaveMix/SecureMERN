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

const logo = `
   _____                          __  __ ______ _____  _   _ 
  / ____|                        |  \\/  |  ____|  __ \\| \\ | |
 | (___   ___  ___ _   _ _ __ ___| \\  / | |__  | |__) |  \\| |
  \\___ \\ / _ \\/ __| | | | '__/ _ \\ |\\/| |  __| |  _  /| . \` |
  ____) |  __/ (__| |_| | | |  __/ |  | | |____| | \\ \\| |\\  |
 |_____/ \\___|\\___|\\__,_|_|  \\___|_|  |_|______|_|  \\_\\_| \\_|
`;

if (command === 'create') {
  generateProject(projectName);
} else {
  console.log(`${colors.cyan}${colors.bold}${logo}${colors.reset}\n${colors.bold}Usage:${colors.reset}\n  secure-mern create <project-name>`);
  process.exit(1);
}
