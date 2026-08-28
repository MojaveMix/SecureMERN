const test = require('node:test');
const assert = require('node:assert');
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const CLI_PATH = path.resolve(__dirname, '../cli/index.js');
const RUN_CMD = `node ${CLI_PATH}`;

test('Test 2: Missing project name', () => {
  try {
    execSync(`${RUN_CMD} create`);
    assert.fail('Should have thrown an error');
  } catch (error) {
    const output = error.stderr ? error.stderr.toString() : error.stdout.toString();
    assert.match(output, /Please provide a project name/);
  }
});

test('Test 1 & 4: Creating a project and README generation', () => {
  const projectName = 'test-project';
  const projectDir = path.resolve(process.cwd(), projectName);

  // Clean up if exists
  if (fs.existsSync(projectDir)) {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }

  const output = execSync(`${RUN_CMD} create ${projectName}`).toString();

  assert.match(output, /Project created successfully/);
  assert.ok(fs.existsSync(projectDir));
  assert.ok(fs.existsSync(path.join(projectDir, 'client')));
  assert.ok(fs.existsSync(path.join(projectDir, 'server')));
  
  const readmePath = path.join(projectDir, 'README.md');
  assert.ok(fs.existsSync(readmePath));
  
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  assert.match(readmeContent, new RegExp(`# ${projectName}`));
  assert.match(readmeContent, /A project generated with SecureMERN/);

  // Clean up
  fs.rmSync(projectDir, { recursive: true, force: true });
});

test('Test 3: Existing project', () => {
  const projectName = 'test-project-exists';
  const projectDir = path.resolve(process.cwd(), projectName);

  // Create it first
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir);
  }

  try {
    execSync(`${RUN_CMD} create ${projectName}`);
    assert.fail('Should have thrown an error');
  } catch (error) {
    const output = error.stderr ? error.stderr.toString() : error.stdout.toString();
    assert.match(output, new RegExp(`Directory "${projectName}" already exists`));
  }

  // Clean up
  fs.rmSync(projectDir, { recursive: true, force: true });
});
