const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const inputDir = './public';
const loResDir = './thumbnails';
const previewDir = './bigthumbs';
const outputJson = 'layout.json';
const panelSize = 400;

// Supported image types
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.webp']);

// Helper function to delete leftover files not present in the public directory
async function deleteExtraFiles(dir, publicFileSet) {
    const files = await fs.readdir(dir);
    const deletePromises = files.map(async (file) => {
        if (!publicFileSet.has(file)) {
            const filePath = path.join(dir, file);
            await fs.unlink(filePath);
            console.log(`Deleted: ${filePath}`);
        }
    });
    return Promise.all(deletePromises);
}

async function deleteExtraThumbnails() {
    try {
        const [publicFiles, thumbnailFiles, previewFiles] = await Promise.all([
            fs.readdir(inputDir),
            fs.readdir(loResDir),
            fs.readdir(previewDir),
        ]);

        const publicFileSet = new Set(publicFiles);

        // Delete extra files in both thumbnail and preview directories
        await Promise.all([
            deleteExtraFiles(loResDir, publicFileSet),
            deleteExtraFiles(previewDir, publicFileSet),
        ]);
    } catch (error) {
        console.error('Error during thumbnail cleanup:', error);
    }
}

// Resize images and create composite in one pass
async function createComposite() {
    let hasChanges = false;

    try {
        await deleteExtraThumbnails();
        await fs.ensureDir(loResDir);
        await fs.ensureDir(previewDir);

        const files = (await fs.readdir(inputDir)).filter(file => supportedExtensions.has(path.extname(file).toLowerCase()));


        const numImages = files.length;
        const numColumns = Math.ceil(Math.sqrt(numImages));
        const numRows = Math.ceil(numImages / numColumns);

        // Create a blank image for the composite
        const compositeImage = sharp({
            create: {
                width: numColumns * panelSize,
                height: numRows * panelSize,
                channels: 3,
                background: { r: 255, g: 0, b: 0 }, // Red background for debugging
            },
        });

        const overlays = [];
        const aspectRatios = [];

        for (let i = 0; i < numImages; i++) {
            const file = files[i];
            const filePath = path.join(inputDir, file);
            const loResOutputPath = path.join(loResDir, file);
            const hiResOutputPath = path.join(previewDir, file);

            // Read and resize image
            const image = sharp(filePath);
            const metadata = await image.metadata();
            const { width, height } = metadata;
            const aspectRatio = `${width}/${height}`;
            aspectRatios.push(aspectRatio);
            
            let newWidth, newHeight;
            if (width > height) {
                newWidth = panelSize;
                newHeight = Math.round((height / width) * panelSize);
            } else {
                newHeight = panelSize;
                newWidth = Math.round((width / height) * panelSize);
            }

            // Add to composite overlays
            overlays.push({
                input: await image.resize(newWidth, newHeight).toBuffer(),
                left: (i % numColumns) * panelSize,
                top: Math.floor(i / numColumns) * panelSize,
            });

            hasChanges = true;
            console.log(`Processed: ${file}`);

            // Skip processing if resized images already exist
            if (await fs.pathExists(loResOutputPath) && await fs.pathExists(hiResOutputPath)) {
                continue;
            }
            
            // Create low-resolution thumbnail
            await image.resize(400, 400, { fit: sharp.fit.inside, withoutEnlargement: true }).toFile(loResOutputPath);
            // Create high-resolution preview
            await image.resize(3200, 3200, { fit: sharp.fit.inside, withoutEnlargement: true }).jpeg({ quality: 80 }).toFile(hiResOutputPath);
        }

        const layout = { rows: numRows, columns: numColumns, totalImages: numImages, aspectRatios };
        await fs.writeJson(outputJson, layout, { spaces: 2 });

        if (hasChanges) {
            await compositeImage.composite(overlays).jpeg({ quality: 80 }).toFile('composite.jpg');
            await compositeImage.composite(overlays).webp({ quality: 80 }).toFile('composite.webp');

            console.log('Composite image and layout created.');
        } else {
            console.log('No new images to process.');
        }

    } catch (error) {
        console.error('Error creating composite:', error);
    }
}

createComposite().catch(err => console.error(err));


// Compress large files above 1500 KB in the preview directory
const maxSize = 1536000; // 1500 KB

async function compressLargeFiles() {
    try {
        const files = await fs.readdir(previewDir);

        const compressPromises = files.map(async (file) => {
            const filePath = path.join(previewDir, file);
            const stats = await fs.stat(filePath);

            if (stats.size > maxSize) {
                console.log(`Compressing ${file} (Original size: ${stats.size / 1024} KB)`);

                const tmpFilePath = `${filePath}.tmp`;

                await sharp(filePath)
                    .jpeg({ quality: 60, mozjpeg: true, progressive: true })
                    .toFile(tmpFilePath);

                await fs.rename(tmpFilePath, filePath);

                const newStats = await fs.stat(filePath);
                console.log(`Compressed ${file} (New size: ${newStats.size / 1024} KB)`);
            }
        });

        await Promise.all(compressPromises);
    } catch (error) {
        console.error('Error compressing large files:', error);
    }
}

compressLargeFiles().catch(err => console.error(err));
