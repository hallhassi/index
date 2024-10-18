const b = () => {
const fs = require('fs');
let years = [];
for (let i=2008; i<2023; i++) {
  years.push(i.toString());
}
const navdef = years.map(i => `<a href="${i}/index.html">${i}</a>`);
for (let year of years) {
  const nav = years.map(i => i == year ? i : `<a href="../${i}/index.html">${i}</a>`);
  const defs = ['index', '404'];
  for (let def of defs) {
    fs.promises.writeFile(`${def}.html`, `<!-- blaiselarmee@gmail.com -->
    <!DOCTYPE html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${def}</title> 
    </head>
    <body>
      <nav>
      ${navdef.join(' ')}
      </nav>
      <main>
      </main>
    </body>
    </html>`)  
  }
fs.promises
  .readdir(year)
  .then(filenames => {
    let aList = [];
    for (let filename of filenames) {
      if (/\.html/.test(filename) || filename == '.DS_Store') {}
      else if (/\.\w+$/.test(filename)) {
        aList.push(`<a href='${filename}'>${filename}</a>`);
      } else {}
    }
    fs.promises.writeFile(year + `/index.html`, `<!-- blaiselarmee@gmail.com -->
    <!DOCTYPE html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${year}</title> 
    </head>
    <body>
      <nav>
      ${nav.join(' ')}
      </nav>
      <main>
      ${aList.join('<br>')}
      </main>
    </body>
    </html>`)
  });
  }
}
exports.b = b();