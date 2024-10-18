const sharp = require('sharp');
const fs = require('fs');
const fspromises = require('fs').promises;
const fsextra = require('fs-extra');
const path = require('path');
const publicDir = './public';
const loResDir = './thumbnails';
const previewDir = './bigthumbs';

// Supported image types
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.webp']);

// -------- delete leftover files in thumbnails that were removed from public--------

async function deleteExtraThumbnails() {
    try {
        // Read files in both directories
        const [publicFiles, thumbnailFiles, previewFiles] = await Promise.all([
            fspromises.readdir(publicDir),
            fspromises.readdir(loResDir),
            fspromises.readdir(previewDir),
        ]);

        // Create a Set of public files for quick lookup
        const publicFileSet = new Set(publicFiles);

        // Loop through the thumbnail files
        for (const file of thumbnailFiles) {
            // Check if the file is not in the public directory
            if (!publicFileSet.has(file)) {
                const filePath = path.join(loResDir, file);
                // Delete the file
                await fspromises.unlink(filePath);
                console.log(`Deleted: ${filePath}`);
            }
        }

        // Loop through the preview files
        for (const file of previewFiles) {
            // Check if the file is not in the public directory
            if (!publicFileSet.has(file)) {
                const filePath = path.join(loResDir, file);
                // Delete the file
                await fspromises.unlink(filePath);
                console.log(`Deleted: ${filePath}`);
            }
        }

    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

// -----------Make thumbnails----------------


async function resizeImages() {
    let changes = [];

    try {
        await deleteExtraThumbnails();

        await fsextra.ensureDir(loResDir); // Ensure the output directory exists
        await fsextra.ensureDir(previewDir); // Ensure the hiRes output directory exists

        const files = await fsextra.readdir(publicDir);

        for (const file of files) {

            const ext = path.extname(file).toLowerCase();

            // Start processing images if the extension is supported
            if (supportedExtensions.has(ext)) {
                const filePath = path.join(publicDir, file);
                const loResOutputPath = path.join(loResDir, file);
                const hiResOutputPath = path.join(previewDir, file);

                // Check if the output file already exists
                if (await fsextra.pathExists(loResOutputPath) && await fsextra.pathExists(hiResOutputPath)) {
                    continue; // Skip resizing if output files exist
                }

                await sharp(filePath, { limitInputPixels: false })
                    .resize({
                        width: 400,
                        height: 400,
                        fit: sharp.fit.inside,
                        withoutEnlargement: true,
                    })
                    .toFile(loResOutputPath);

                await sharp(filePath, { limitInputPixels: false })
                    .resize({
                        width: 3200,
                        height: 3200,
                        fit: sharp.fit.inside,
                        withoutEnlargement: true,
                    })
                .jpeg({
                  quality: 80,
                })
                .toFile(hiResOutputPath);
              
                changes.push('success');

                console.log(`Resized: ${file} to ${loResOutputPath} and ${hiResOutputPath}`);
            }
        }

        return changes.length > 0 ? 1 : null;

    } catch (error) {
        console.error('Error processing images:', error);
    }
}


// ------------------compress images above 1500kb----------------

const maxSize = 1536000; // 1500 KB

async function compressLargeFiles() {
  try {
    const files = await fspromises.readdir(previewDir);

    for (const file of files) {
      const filePath = path.join(previewDir, file);
      const stats = await fspromises.stat(filePath);

      if (stats.size > maxSize) {
        console.log(`File ${file} exceeds 1500 KB. Original size: ${stats.size / 1024} KB`);

        // Create a temporary file path
        const tmpFilePath = `${filePath}.tmp`;

        // Perform action on large file (e.g., compress)
        await sharp(filePath)
          .jpeg({
            quality: 60,
            mozjpeg: true,
            progressive: true,
          })
          .toFile(tmpFilePath);

        // Replace the original file with the compressed temporary file
        await fspromises.rename(tmpFilePath, filePath);

        const newStats = await fspromises.stat(filePath);
        console.log(`Compressed ${file}. New size: ${newStats.size / 1024} KB`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}


// ------------------Make composite-------------------

const outputImage = 'composite.jpg'; // Output image file
const outputJson = 'layout.json'; // Output JSON file
const panelSize = 400; // Size of each panel

async function createComposite() {

    await compressLargeFiles();

    const changes = await resizeImages();

    if (changes === null) {
        // Your additional logic goes here
    } else {

        const files = fs.readdirSync(loResDir).filter(file => {
            return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file);
        });

        const numImages = files.length;
        const numColumns = Math.ceil(Math.sqrt(numImages));
        const numRows = Math.ceil(numImages / numColumns);

        // Create a new blank image with transparent background
        const compositeImage = sharp({
            create: {
                width: numColumns * panelSize,
                height: numRows * panelSize,
                channels: 3,
                background: { r: 255, g: 0, b: 0 }
            }
        });

        const overlays = [];
        const ratios = []; // Array to hold aspect ratios

        for (let i = 0; i < numImages; i++) {
            const imagePath = path.join(loResDir, files[i]);
            const image = sharp(imagePath);

            const { width, height } = await image.metadata();

            // Calculate the aspect ratio and store it
            const ratio = `${width}/${height}`;
            ratios.push(ratio);

            // Calculate the new size to fit into the panel
            let newWidth = width;
            let newHeight = height;

            if (width > height) {
                newWidth = panelSize;
                newHeight = Math.round((height / width) * panelSize);
            } else {
                newHeight = panelSize;
                newWidth = Math.round((width / height) * panelSize);
            }

            const x = (i % numColumns) * panelSize;
            const y = Math.floor(i / numColumns) * panelSize;

            overlays.push({
                input: await image.resize(newWidth, newHeight).toBuffer(),
                left: x,
                top: y // Align to the top
            });
        }

        await compositeImage.composite(overlays).jpeg({ quality: 80 }).toFile(outputImage);

        // Create layout JSON
        const layout = {
            rows: numRows,
            columns: numColumns,
            totalImages: numImages,
            aspectRatios: ratios // Include the ratios array
        };

        fs.writeFileSync(outputJson, JSON.stringify(layout, null, 2));
        console.log('Composite image created and layout saved.');
    }

}

createComposite().catch(err => console.error(err));
