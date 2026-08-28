#!/usr/bin/env node

const { generateProject } = require('../generators/project-generator');

const args = process.argv.slice(2);
const command = args[0];
const projectName = args[1];

if (command === 'create') {
  generateProject(projectName);
} else {
  console.log('SecureMERN CLI\n\nUsage:\n  secure-mern create <project-name>');
  process.exit(1);
}
