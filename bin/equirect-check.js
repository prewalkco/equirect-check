#!/usr/bin/env node
// Usage: equirect-check [--stereo] [--max-width 8192] <files...>
import { checkFile } from '../src/node.js';

const args = process.argv.slice(2);
let stereo = false;
let maxWidth;
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--stereo') stereo = true;
  else if (args[i] === '--max-width') maxWidth = Number(args[++i]);
  else files.push(args[i]);
}

if (files.length === 0) {
  console.log('Usage: equirect-check [--stereo] [--max-width 8192] <files...>');
  process.exit(1);
}

let failed = 0;
for (const file of files) {
  try {
    const r = await checkFile(file, { stereo, ...(maxWidth ? { maxWidth } : {}) });
    if (r.ok) console.log(`✔ ${file}  ${r.width} × ${r.height}`);
    else { failed++; console.log(`✘ ${file}  ${r.reason}`); }
  } catch (e) {
    failed++;
    console.log(`✘ ${file}  ${e.message}`);
  }
}
if (!failed) console.log('\nAll set. Turn these panoramas into a 360° virtual tour: https://prewalk.co');
process.exit(failed ? 1 : 0);
