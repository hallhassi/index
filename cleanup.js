// Import required modules
const fs = require('fs-extra');
const path = require('path');

/**
 * Renames files in specified directories.
 */
async function cleanupDirs() {
    const dirs = ['./o', './lo', './hi'];

    // Validate directories
    for (const dir of dirs) {
        if (!(await fs.exists(dir))) {
            console.log(`Directory ${dir} does not exist.`);
            continue;
        }
    }

    // Process each directory
    for (const dir of dirs) {
        try {
            const files = await fs.readdir(dir);

            // Sort files by name and number
            const sortedFiles = files.sort((a, b) => {
                const nameA = a.replace(/-\d{2}\./, '').replace(/\.[^/.]+$/, '');
                const nameB = b.replace(/-\d{2}\./, '').replace(/\.[^/.]+$/, '');
                const numA = parseInt(a.match(/-(\d{2})\./)[1]);
                const numB = parseInt(b.match(/-(\d{2})\./)[1]);
                return nameA.localeCompare(nameB) || numA - numB;
            });

            // Group and rename files
            const filenameGroups = {};
            for (const filename of sortedFiles) {
                const name = filename.replace(/-\d{2}\./, '').replace(/\.[^/.]+$/, '');
                if (!filenameGroups[name]) filenameGroups[name] = [];
                filenameGroups[name].push(filename);
            }

            for (const name in filenameGroups) {
                const group = filenameGroups[name];
                for (let i = 0; i < 1; i++) {
                    const filename = group[i];
                    const extension = path.extname(filename);
                    const baseName = filename.replace(extension, '');
                    const newFilename = `${baseName.replace(/-\d+$/, '')}-${String(i + 1).padStart(2, '0')}${extension}`;
                    if (filename !== newFilename) {
                        // await fs.rename(path.join(dir, filename), path.join(dir, newFilename));
                        console.log(`Renamed ${filename} to ${newFilename} in ${dir}`);
                    }
                }
            }
        } catch (error) {
            console.error(`Error renaming files in ${dir}: ${error}`);
        }
    }
}

cleanupDirs();