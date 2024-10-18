const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const inputDir = './';
const loResDir = './unusedthumbnails';
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
        const [publicFiles, thumbnailFiles] = await Promise.all([
            fs.readdir(inputDir),
            fs.readdir(loResDir),
        ]);

        const publicFileSet = new Set(publicFiles);

        // Delete extra files in both thumbnail and preview directories
        await Promise.all([
            deleteExtraFiles(loResDir, publicFileSet),
        ]);
    } catch (error) {
        console.error('Error during thumbnail cleanup:', error);
    }
}



// Helper function to get all files recursively from a directory
async function getFilesRecursive(dir) {
    let files = await fs.readdir(dir, { withFileTypes: true });
    let allFiles = [];

    for (const file of files) {
        const filePath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
            // If it's a directory, recurse into it
            const subDirFiles = await getFilesRecursive(filePath);
            allFiles = allFiles.concat(subDirFiles);
        } else {
            // If it's a file, add it to the list
            allFiles.push(filePath);
        }
    }

    return allFiles;
}

// Resize images and create composite in one pass
async function createComposite() {
    let hasChanges = false;

    try {
        await deleteExtraThumbnails();
        await fs.ensureDir(loResDir);

        const files = (await getFilesRecursive(inputDir)).filter(file => supportedExtensions.has(path.extname(file).toLowerCase()));

        if (!files.length) {
            console.log('No images to process.');
            return;
        }

        const numImages = files.length;

        for (let i = 0; i < numImages; i++) {
            const file = files[i];
            const ext = path.extname(file).toLowerCase();
            const filePath = path.join(inputDir, file);
            const loResOutputPath = path.join(loResDir, path.basename(file));

            // Skip processing if resized images already exist
            if (await fs.pathExists(loResOutputPath)) {
                continue;
            }

            // Read and resize image
            const image = sharp(filePath);
            const metadata = await image.metadata();
            const { width, height } = metadata;

            let newWidth, newHeight;
            if (width > height) {
                newWidth = panelSize;
                newHeight = Math.round((height / width) * panelSize);
            } else {
                newHeight = panelSize;
                newWidth = Math.round((width / height) * panelSize);
            }

            // Create low-resolution thumbnail
            await image.resize(400, 400, { fit: sharp.fit.inside, withoutEnlargement: true }).toFile(loResOutputPath);

            hasChanges = true;
            console.log(`Processed: ${file}`);
        }

    } catch (error) {
        console.error('Error creating composite:', error);
    }
}

createComposite().catch(err => console.error(err));

