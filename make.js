const fs = require('fs-extra');
const path = require('path');

// Specify directory
const dir = './o';

// Initialize arrays
let images = [];
let nonImages = [];

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
        images.push(`<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/${file}" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/${file}" style="display:none;">${file}</a>`);
      } else {
        nonImages.push(file);
      }
    }
  });

  const head = `<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{white-space:pre;background:red;margin:1em 0 calc(100vh - 2em) 0;line-height:1em;}a{all:unset;cursor:pointer;}</style>  <meta name="description" content="personal website for Blaise Larmee"><title>Blaise Larmee, artist and cartoonist</title></head>`
  const indexHTML = `<body><div id="canvaswrapper" style="position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;pointer-events:none;"><a><canvas id="canvas" width="0" height="0" style="position:fixed;right:0;object-fit:contain;max-height:100vh;max-width:100vw;pointer-events:auto;cursor:pointer;"></canvas></a></div><div id="info" style="position:fixed;top:0;background:red;height:1em;width:100%;text-align:right;"></div>books<ol><li><a href="3books.html">3books.html</a></li></ol>websites<ol><li><a href="https://mp4.bar">https://mp4.bar</a></li><li><a href="https://apartment.gallery">https://apartment.gallery</a></li><li><a href="https://larmee.org">https://larmee.org</a></li><li><a href="https://2dcloud.com">https://2dcloud.com</a></li></ol>images<ol><li><a href="images.html">images.html</a></li><li><a href="index2.html">index2.html</a></li></ol><a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-01.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-01.jpg" style="display:none;">blaiselarmee-2024-apartment-01.jpg</a>
<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-02.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-02.jpg" style="display:none;">blaiselarmee-2024-apartment-02.jpg</a>
<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-03.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-03.jpg" style="display:none;">blaiselarmee-2024-apartment-03.jpg</a>
<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-04.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-04.jpg" style="display:none;">blaiselarmee-2024-apartment-04.jpg</a>
<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-05.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-05.jpg" style="display:none;">blaiselarmee-2024-apartment-05.jpg</a>
<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-06.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-06.jpg" style="display:none;">blaiselarmee-2024-apartment-06.jpg</a>
<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-07.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-07.jpg" style="display:none;">blaiselarmee-2024-apartment-07.jpg</a>
<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-08.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-08.jpg" style="display:none;">blaiselarmee-2024-apartment-08.jpg</a>
<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-09.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-09.jpg" style="display:none;">blaiselarmee-2024-apartment-09.jpg</a>
<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-10.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-10.jpg" style="display:none;">blaiselarmee-2024-apartment-10.jpg</a>
<a href="https://blaiselarmee.mo.cloudinary.net/auto/o/blaiselarmee-2024-apartment-11.jpg" style="display:none;"><img src="https://blaiselarmee.mo.cloudinary.net/300/o/blaiselarmee-2024-apartment-11.jpg" style="display:none;">blaiselarmee-2024-apartment-11.jpg</a>
<div style="position:absolute;bottom:0;">last updated ${new Date()}</div>
<script src="index.js"></script></body></html>`;
const imageHTML = `<body><div id="canvaswrapper" style="position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;pointer-events:none;"><a><canvas id="canvas" width="0" height="0" style="position:fixed;top:1em;right:0;object-fit:contain;max-height:100vh;max-width:100vw;pointer-events:auto;cursor:pointer;"></canvas></a></div><div id="info" style="position:fixed;top:0;background:red;height:1em;width:100%;text-align:right;"></div>${images.join('\n')}<script src="index.js"></script></body></html>`;
  const threebooksHTML = `<body>attempts and succeeds to bring controversy on its author. a book about sex, mostly paintings with sing song text, as well as drawings and photos, thinly contextualized as worthy of scrutiny. blaise larmee was marketing director for 2dcloud, the publisher, at the time of its creation. see <a href="https://2dcloud.substack.com/p/names-p1">https://2dcloud.substack.com/p/names-p1</a>.<br><img src="./o/blaiselarmee-2015-3books-01.jpg"><img src="./o/blaiselarmee-2015-3books-02.jpg"></body></html>`
  const younglionsHTML = `<body><img src="./o/blaiselarmee-2010-younglions-01.jpg"></body></html>`
  const HTML2001 = `<body>2001 i think of the cover. <img src="./o/blaiselarmee-2017-2001-01.jpg"></body></html>`
  // Write to files

  const htmlDocs = [
    {
      filename: 'images.html',
      content: imageHTML,
      script: './makeimages.js'
    },
    {
      filename: 'index.html',
      content: indexHTML
    },
    {
      filename: 'younglions.html',
      content: younglionsHTML
    },
    {
      filename: '3books.html',
      content: threebooksHTML
    },
    {
      filename: '2001.html',
      content: HTML2001
    }
    // Add more documents here
  ];
  
  htmlDocs.forEach((doc) => {
    fs.writeFile(doc.filename, `${head}${doc.content}`, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`${doc.filename} generated successfully!`);
        // if (doc.script) require(doc.script);
      }
    });
  });

  


})