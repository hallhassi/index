const fs = require('fs-extra');
const path = require('path');
const dir = './o';
let images = [];

// Read directory contents
fs.readdir(dir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const extension = path.extname(file).toLowerCase();
      if (['.jpg', '.gif', '.png', 'webp'].includes(extension)) {
        images.push(`<a href="https://blaiselarmee.com/o/${file}" style="display:none;"><img src="https://blaiselarmee.com/lo/${file}" style="display:none;">${file}</a>`);
      }
    }
  });

  const head = `<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{white-space:pre;background:red;margin:1em 0 calc(100vh - 2em) 0;line-height:1em;}a{all:unset;cursor:pointer;}</style><meta name="description" content="personal website for Blaise Larmee"><title>Blaise Larmee, artist and cartoonist</title></head>`
  const indexHTML = `<body><div id="canvaswrapper" style="position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;pointer-events:none;"><a><canvas id="canvas" width="0" height="0" style="position:fixed;top:0;right:0;object-fit:contain;max-height:100vh;max-width:100vw;pointer-events:auto;cursor:pointer;"></canvas></a></div><div id="info" style="position:fixed;top:0;background:red;height:1em;width:100%;text-align:right;"></div>${images.join('\n')}<script src="index.js"></script></body></html>`;

  const htmlDocs = [
    {
      filename: 'index.html',
      content: indexHTML,
      script: './makeimages.js'
    }
  ];
  
  htmlDocs.forEach((doc) => {
    fs.writeFile(doc.filename, `${head}${doc.content}`, (err) => {
      if (err) {
        console.error(err);
      } 
      else {
        console.log(`${doc.filename} generated successfully!`);
      }
      if (doc.script) require(doc.script);
    });
  });

})