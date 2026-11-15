// Browser check for 360° equirectangular panoramas.
// Works with a File or Blob from <input type="file"> or drag and drop.

export const MAX_WIDTH = 16384; // largest common equirectangular width (16K)

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];

/**
 * Check that a panorama is a full 2:1 equirectangular image
 * (or 1:1 when it is a top-bottom stereo pair).
 *
 * @param {File|Blob} file
 * @param {{ stereo?: boolean, maxWidth?: number }} [options]
 * @returns {Promise<{ ok: boolean, width?: number, height?: number, reason?: string, checkedOnServer?: boolean }>}
 */
export async function checkPanorama(file, options = {}) {
  const { stereo = false, maxWidth = MAX_WIDTH } = options;

  if (!ALLOWED.includes(file.type)) {
    return { ok: false, reason: 'Convert to JPG, PNG, TIFF or WebP first.' };
  }

  // Most browsers cannot decode TIFF; check it on the server instead.
  if (file.type === 'image/tiff') return { ok: true, checkedOnServer: true };

  const bmp = await createImageBitmap(file);
  const { width, height } = bmp;
  bmp.close();

  return checkSize(width, height, { stereo, maxWidth });
}

/**
 * Pure dimension check, shared by the browser and Node versions.
 */
export function checkSize(width, height, { stereo = false, maxWidth = MAX_WIDTH } = {}) {
  const expected = stereo ? height : height * 2;
  if (width !== expected) {
    const shape = stereo ? '1:1 (two 2:1 halves stacked top-bottom)' : '2:1';
    return {
      ok: false,
      width,
      height,
      reason: `${width} × ${height} is not ${shape}. A full 360° panorama is exactly twice as wide as it is tall${stereo ? ' per eye' : ''}.`,
    };
  }
  if (width > maxWidth) {
    return { ok: false, width, height, reason: `${width} px wide is larger than ${maxWidth} px. Resize before upload.` };
  }
  return { ok: true, width, height };
}
