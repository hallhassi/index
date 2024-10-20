const sharp = require('sharp');
const fs = require('fs-extra');

(async () => {
  try {
    const files = await fs.readdir('./temp');

    for (let i = 0; i < files.length; i++) {
      const inputPath = `./temp/${files[i]}`;
      const outputPath = `./temp/processed_${files[i]}`;

      try {
        // Process only image files (you can adjust the extensions as needed)
        if (/\.(jpg|jpeg|png|gif)$/i.test(files[i])) {
          await sharp(inputPath) // Load the input image
            .toColourspace('b-w') // Convert to grayscale
            .composite([{live 
              input: Buffer.from([255, 0, 0, 255]), // Red background
              blend: 'dest-over'
            }])
            .toFile(outputPath); // Save to a new output file

          console.log(`Background changed to red for ${files[i]}.`);
        } else {
          console.log(`Skipping non-image file: ${files[i]}`);
        }
      } catch (fileError) {
        console.error(`Error processing ${files[i]}: ${fileError.message}`);
      }
    }
  } catch (err) {
    console.error(`Error reading directory: ${err.message}`);
  }
})();
