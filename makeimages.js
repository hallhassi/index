const sharp = require('sharp');const fs = require('fs-extra');
const path = require('path');
const inputDir = './o';
const loResDir = './lo';
const hiResDir = './hi';

// Supported image types
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.webp']);

// Helper function to delete leftover files not present in the public directory
async function deleteExtraFiles(dir, inputFileSet) {
    const files = await fs.readdir(dir);
    const deletePromises = files.map(async (file) => {
        if (!inputFileSet.has(file)) {
            const filePath = path.join(dir, file);
            await fs.unlink(filePath);
            console.log(`Deleted: ${filePath}`);
        }
    });
    return Promise.all(deletePromises);
}

async function deleteExtraImages() {
    try {
        const inputFiles = await fs.readdir(inputDir);
        const inputFileSet = new Set(inputFiles.filter((file) => supportedExtensions.has(path.extname(file))));

        // Delete extra files in both lo and hi directories
        await Promise.all([
            deleteExtraFiles(loResDir, inputFileSet),
            deleteExtraFiles(hiResDir, inputFileSet),
        ]);
    } catch (error) {
        console.error('Error during thumbnail cleanup:', error);
    }
}


// Make images
async function makeImages() {

    try {
        await deleteExtraImages();
        // await fs.ensureDir(loResDir);
        await fs.ensureDir(hiResDir);

        const files = (await fs.readdir(inputDir)).filter(file => supportedExtensions.has(path.extname(file).toLowerCase()));

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const image = sharp(path.join(inputDir, file));
            const loResOutputPath = path.join(loResDir, file);
            const hiResOutputPath = path.join(hiResDir, file);

            // Skip processing if resized images already exist
            if (await fs.pathExists(hiResOutputPath) && await fs.pathExists(loResOutputPath)) {
                continue;
            }
            
            // Create high-resolution image
            await image.resize(3200, 3200, { fit: sharp.fit.inside, withoutEnlargement: true }).jpeg({ quality: 80 }).toFile(hiResOutputPath);
            
            // Create low-resolution image from high-resolution image
            await sharp(hiResOutputPath).resize(400, 400, { fit: sharp.fit.inside, withoutEnlargement: true }).toFile(loResOutputPath);        
        }

    } catch (error) {
        console.error('Error creating images:', error);
    }
}

makeImages().catch(err => console.error(err));

// Compress large files above 1500 KB in the preview directory
const maxSize = 1536000; // 1500 KB

async function compressLargeFiles() {
    try {
        const files = await fs.readdir(hiResDir);

        const compressPromises = files.map(async (file) => {
            const filePath = path.join(hiResDir, file);
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
