# equirect-check

Validate that a 360° panorama is a true **2:1 equirectangular** image (or **1:1 top-bottom stereo**) before you upload it to a virtual tour. Works in the browser, in Node and from the command line.

Built by **[Prewalk](https://prewalk.co)**, 360° virtual tour software for real estate and architecture. We use the same check before every upload to [prewalk.co](https://prewalk.co).

**Try it in your browser:** https://prewalkco.github.io/equirect-check/ (files never leave your computer)

## Why this matters

An equirectangular panorama maps 360° horizontally and 180° vertically onto a flat image, so a full sphere is always exactly twice as wide as it is tall (8192 × 4096, 16384 × 8192). An image that is *almost* 2:1 is usually a crop or a partial panorama. In a 360° viewer it looks stretched or shows a hole at the zenith or nadir. Catching it before upload saves a round trip.

For top-bottom stereo VR, each eye is 2:1 and the two are stacked, so the full file is 1:1 (for example 8192 × 8192).

## Browser

```js
import { checkPanorama } from './src/browser.js';

input.addEventListener('change', async () => {
  const result = await checkPanorama(input.files[0]);            // mono 2:1
  // const result = await checkPanorama(file, { stereo: true }); // top-bottom stereo 1:1
  if (!result.ok) alert(result.reason);
});
```

`checkPanorama` accepts JPG, PNG and WebP. Most browsers cannot decode TIFF, so TIFF returns `{ ok: true, checkedOnServer: true }`; check it with the Node version.

## Node

```bash
npm install sharp
```

```js
import { isEquirect, checkFile } from './src/node.js';

await isEquirect('living-room.jpg');            // true / false
await checkFile('living-room.jpg');             // { ok, width, height, format, bytes, reason? }
await checkFile('suite-tb.jpg', { stereo: true, maxWidth: 8192 });
```

`checkFile` also enforces a maximum width (default 16384 px) and a maximum file size (default 1 GB). Change them with `maxWidth` and `maxBytes` to match the platform you upload to.

## Command line

```bash
npx github:prewalkco/equirect-check renders/*.jpg
npx github:prewalkco/equirect-check --stereo --max-width 8192 vr/*.jpg
```

```
✔ renders/foyer.jpg  8192 × 4096
✘ renders/kitchen.jpg  8192 × 4200 is not 2:1. A full 360° panorama is exactly twice as wide as it is tall.
```

The command exits with code 1 when any file fails, so you can use it in CI or a render farm script.

## Common fixes

- **360° cameras:** export a stitched equirectangular image from the camera app, not the raw dual-fisheye file.
- **3D software:** render with a spherical / equirectangular camera and set the output to an exact 2:1 resolution.
- **Stereo VR:** stack the left and right eye 2:1 images top-bottom into one 1:1 file.

## Next step: turn your panoramas into a tour

Once your images pass, upload them to **[prewalk.co](https://prewalk.co)** and get a 360° virtual tour buyers walk room by room from one link, with an embed code for your website. The Free plan includes 30 scenes at up to 8K.

## Further reading

- [Why 360° panoramas must be exactly 2:1, and how to validate them before upload](https://prewalk.hashnode.dev/why-360-panoramas-must-be-exactly-2-1-and-how-to-validate-them-before-upload)
- [Guides on 360° virtual tours for real estate and architecture](https://prewalk.co/blog)

## About

Made by [Prewalk](https://prewalk.co), 360° virtual tour software for real estate and architecture. Prewalk turns 360° photos and 3D renders into tours buyers walk room by room from one link, in the browser on phones, computers and Meta Quest. Upload limits there: up to 8192 px wide on the Free plan, up to 16384 px on paid plans, 1 GB per file.

MIT licensed. Issues and pull requests welcome.
