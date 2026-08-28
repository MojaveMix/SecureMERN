#!/usr/bin/env node

const { createProject } = require('./create');

const args = process.argv.slice(2);
const command = args[0];
const projectName = args[1];

if (command === 'create') {
  createProject(projectName);
} else {
  console.log('SecureMERN CLI\n\nUsage:\n  secure-mern create <project-name>');
  process.exit(1);
}
