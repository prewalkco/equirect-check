// Node check for 360° equirectangular panoramas, using sharp.
// npm install sharp
import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import { checkSize, MAX_WIDTH } from './browser.js';

export { checkSize, MAX_WIDTH };

/** True when the image is exactly 2:1. */
export async function isEquirect(path) {
  const { width, height } = await sharp(path).metadata();
  return width === height * 2;
}

/**
 * Full check: ratio, width limit and file size.
 * @param {string} path
 * @param {{ stereo?: boolean, maxWidth?: number, maxBytes?: number }} [options]
 */
export async function checkFile(path, options = {}) {
  const { maxBytes = 1024 ** 3 } = options; // 1 GB
  const { size } = await stat(path);
  if (size > maxBytes) {
    return { ok: false, reason: `${(size / 1024 ** 2).toFixed(0)} MB is larger than ${(maxBytes / 1024 ** 2).toFixed(0)} MB.` };
  }
  const { width, height, format } = await sharp(path).metadata();
  return { ...checkSize(width, height, options), format, bytes: size };
}
