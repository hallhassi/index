const fs = require('fs');
const path = require('path');

// Specify the directory you want to read
const directoryPath = './public';

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.error('Unable to scan directory: ' + err);
    }

    // Filter and sort the files
    const filteredFiles = files
        .filter(file => /^blaiselarmee-(201[2-9]|202[0-2])/.test(file)) // Match files starting with 2013-2022
        .sort(); // Sort alphabetically

    // Log the filtered and sorted files
    filteredFiles.forEach(file => {
        console.log(file);
    });
});
