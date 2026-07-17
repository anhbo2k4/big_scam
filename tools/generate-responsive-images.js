const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const imagesDir = path.join(rootDir, 'public', 'images');

const jobs = [
  {
    input: 'logo.png',
    variants: [64, 96, 128, 160, 192],
    outputPrefix: 'logo'
  },
  {
    input: 'lixi.png',
    variants: [150, 300],
    outputPrefix: 'lixi'
  }
];

async function ensureExists(filePath) {
  await fs.promises.access(filePath, fs.constants.F_OK);
}

async function generateWebpVariants({ input, variants, outputPrefix }) {
  const inputPath = path.join(imagesDir, input);
  await ensureExists(inputPath);

  for (const width of variants) {
    const outputPath = path.join(imagesDir, `${outputPrefix}-${width}.webp`);
    await sharp(inputPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 68, effort: 6 })
      .toFile(outputPath);
    console.log(`Generated: ${path.relative(rootDir, outputPath)}`);
  }
}

(async function run() {
  try {
    for (const job of jobs) {
      await generateWebpVariants(job);
    }
    console.log('Responsive image generation completed.');
  } catch (error) {
    console.error('Image generation failed:', error.message || error);
    process.exitCode = 1;
  }
})();
