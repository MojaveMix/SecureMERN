const test = require('node:test');
const assert = require('node:assert');
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const CLI_PATH = path.resolve(__dirname, '../cli/index.js');
const RUN_CMD = `node ${CLI_PATH}`;

test('Test 6: Missing name', () => {
  try {
    execSync(`${RUN_CMD} create`);
    assert.fail('Should have thrown an error');
  } catch (error) {
    const output = error.stderr ? error.stderr.toString() : error.stdout.toString();
    assert.match(output, /Please provide a project name/);
  }
});

test('Test 1, 2, 3, 4, 7: Project creation & template integrity', () => {
  const projectName = 'test-project';
  const projectDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }

  const output = execSync(`${RUN_CMD} create ${projectName}`).toString();

  assert.match(output, /Project created successfully/);
  
  // Test 1: verify root structure
  assert.ok(fs.existsSync(path.join(projectDir, 'client')));
  assert.ok(fs.existsSync(path.join(projectDir, 'server')));
  assert.ok(fs.existsSync(path.join(projectDir, '.env.example')));
  assert.ok(fs.existsSync(path.join(projectDir, '.gitignore')));
  assert.ok(fs.existsSync(path.join(projectDir, 'README.md')));
  assert.ok(fs.existsSync(path.join(projectDir, 'package.json')));
  
  // Test 2: Client structure
  const clientDir = path.join(projectDir, 'client');
  const clientSrc = path.join(clientDir, 'src');
  assert.ok(fs.existsSync(path.join(clientDir, 'package.json')));
  assert.ok(fs.existsSync(path.join(clientDir, 'index.html')));
  assert.ok(fs.existsSync(path.join(clientSrc, 'components')));
  assert.ok(fs.existsSync(path.join(clientSrc, 'pages')));
  assert.ok(fs.existsSync(path.join(clientSrc, 'hooks')));
  assert.ok(fs.existsSync(path.join(clientSrc, 'services')));
  assert.ok(fs.existsSync(path.join(clientSrc, 'utils')));
  assert.ok(fs.existsSync(path.join(clientSrc, 'main.jsx')));
  assert.ok(fs.existsSync(path.join(clientSrc, 'App.jsx')));
  assert.ok(fs.existsSync(path.join(clientSrc, 'services', 'api.js')));

  // Test 3: Server structure
  const serverDir = path.join(projectDir, 'server');
  const serverSrc = path.join(serverDir, 'src');
  assert.ok(fs.existsSync(path.join(serverDir, 'package.json')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'config')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'controllers')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'middlewares')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'models')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'routes')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'services')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'utils')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'app.js')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'server.js')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'routes', 'health.routes.js')));
  assert.ok(fs.existsSync(path.join(serverSrc, 'controllers', 'health.controller.js')));

  // Test 4: README
  const readmeContent = fs.readFileSync(path.join(projectDir, 'README.md'), 'utf8');
  assert.match(readmeContent, new RegExp(`# ${projectName}`));
  assert.match(readmeContent, /A Full-Stack project generated with SecureMERN/);
  
  // Test 8: ENV example
  const envContent = fs.readFileSync(path.join(projectDir, '.env.example'), 'utf8');
  assert.match(envContent, /NODE_ENV=development/);
  assert.match(envContent, /PORT=5000/);
  assert.match(envContent, /VITE_API_URL=http:\/\/localhost:5000\/api/);

  // Test 7: Template integrity - can be copied repeatedly
  const projectName2 = 'test-project-2';
  const projectDir2 = path.resolve(process.cwd(), projectName2);
  if (fs.existsSync(projectDir2)) {
    fs.rmSync(projectDir2, { recursive: true, force: true });
  }
  execSync(`${RUN_CMD} create ${projectName2}`);
  assert.ok(fs.existsSync(path.join(projectDir2, 'client', 'src', 'App.jsx')));
  
  // Clean up
  fs.rmSync(projectDir, { recursive: true, force: true });
  fs.rmSync(projectDir2, { recursive: true, force: true });
});

test('Test 5: Existing project', () => {
  const projectName = 'test-project-exists';
  const projectDir = path.resolve(process.cwd(), projectName);

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
