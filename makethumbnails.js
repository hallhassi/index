const fsextra = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const inputDirToMakeThumbnails = './public'; // Change this to your input directory
const outputDirToMakeThumbnails = './thumbnails'; // Change this to your output directory

// Supported image types
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.webp']);

async function resizeImages() {
    try {
        await fsextra.ensureDir(outputDirToMakeThumbnails); // Ensure the output directory exists

        const files = await fsextra.readdir(inputDirToMakeThumbnails);

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();

            // Start processing images if the extension is supported
            if (supportedExtensions.has(ext)) {
                const filePath = path.join(inputDirToMakeThumbnails, file);
                const outputPath = path.join(outputDirToMakeThumbnails, file);

                // Check if the output file already exists
                if (await fsextra.pathExists(outputPath)) {
                    console.log(`File already exists, skipping: ${outputPath}`);
                    continue; // Skip resizing if the output file exists
                }

                await sharp(filePath, { limitInputPixels: false })
                    .resize({
                        width: 400,
                        height: 400,
                        fit: sharp.fit.inside,
                        withoutEnlargement: true,
                    })
                    .toFile(outputPath);

                console.log(`Resized: ${file} to ${outputPath}`);
            }
        }
    } catch (error) {
        console.error('Error processing images:', error);
    }
}

resizeImages();
