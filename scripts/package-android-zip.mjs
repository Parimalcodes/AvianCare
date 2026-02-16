import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const androidDir = resolve(root, 'android');
const zipPath = resolve(root, 'AvianCare-Android-Studio.zip');

if (!existsSync(androidDir)) {
  console.error('android/ project not found.');
  process.exit(1);
}

if (existsSync(zipPath)) {
  rmSync(zipPath, { force: true });
}

execSync('zip -r AvianCare-Android-Studio.zip android', {
  cwd: root,
  stdio: 'inherit'
});

console.log(`Created: ${zipPath}`);
