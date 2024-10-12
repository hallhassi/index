const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const inputDir = './public'; // Change this to your input directory
const outputDir = './thumbnails'; // Change this to your output directory

// Supported image types
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.webp']);

async function resizeImages() {
    try {
        await fs.ensureDir(outputDir); // Ensure the output directory exists

        const files = await fs.readdir(inputDir);

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();

            // Start processing images if the extension is supported
            if (supportedExtensions.has(ext)) {
                const filePath = path.join(inputDir, file);
                const outputPath = path.join(outputDir, file);

                // Check if the output file already exists
                if (await fs.pathExists(outputPath)) {
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
