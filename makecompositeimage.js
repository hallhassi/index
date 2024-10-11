const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const inputDir = './thumbnails'; // Directory containing input images
const outputImage = 'composite.jpg'; // Output image file
const outputJson = 'layout.json'; // Output JSON file
const panelSize = 600; // Size of each panel

async function createComposite() {
    const files = fs.readdirSync(inputDir).filter(file => {
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
        const imagePath = path.join(inputDir, files[i]);
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
            left: x ,
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

createComposite().catch(err => console.error(err));
