let rows = 0
let cols = 0
let imageLength = 0
let ratios = []
const gap = document.getElementById('images').getBoundingClientRect().top + window.scrollY
const anchors = Array.from(document.querySelectorAll('#images a'))
const imgsrcs = Array.from(anchors).map(anchor => anchor.href)
const composite = new (Image)
composite.src = 'composite.webp'
// Set the onerror function to load the JPG image if the WebP fails
composite.onerror = function() {
    img().src = 'composite.jpg'; // Fallback to the JPG source
};

const panelSize = 400
tv.width = panelSize
tv.height = panelSize


fetch('layout.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        rows = data.rows
        cols = data.columns
        imageLength = data.totalImages
        ratios = data.aspectRatios
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });


function openLink() {
    window.open(`public/${anchors[i()()].innerHTML}`)
}


composite.onload = drawframe
window.onscroll = drawframe



function drawframe() {
    requestAnimationFrame(() => {
        if (composite.complete) {
            tv.removeEventListener('click', openLink)
            tv.getContext("2d").clearRect(0, 0, panelSize, panelSize)
            tv.style.display = ''
            sticky.innerHTML = ''
            if (i()() >= 0) {
                tv.style.display = ''
                const width = getImageDimensions(ratios[i()()]).width
                const height = getImageDimensions(ratios[i()()]).height
                tv.addEventListener('click', openLink);
                sticky.innerHTML = `<a href="public/${anchors[i()()].innerHTML}">${anchors[i()()].innerHTML}</a>`
                tv.width = width
                tv.height = height
                tv.getContext("2d").drawImage(composite, x(), y()())
                window.ontouchmove = window.onwheel = onzoom
            } else advertise()
        }
    })
}

function onzoom(e) {
    if (window.visualViewport.scale > 1 | (e.touches !== undefined && e.touches.length > 1)) {
        let hiRes
        hiRes = new Image()
        hiRes.src = imgsrcs[i()()].replace('public', 'bigthumbs')
        hiRes.onload = function () {
            if (tv.width < document.body.clientWidth) tv.style.height = tv.height
            if (tv.height < document.body.clientHeight) tv.style.width = tv.width
            tv.width = hiRes.naturalWidth
            tv.height = hiRes.naturalHeight
            tv.getContext("2d").drawImage(hiRes, 0, 0, hiRes.naturalWidth, hiRes.naturalHeight)
        }
        window.onscroll = window.ontouchmove = null
        window.ontouchend = window.onwheel = onzoomreset
    }
}

function onzoomreset() {
    if (window.visualViewport.scale === 1) {
        const width = getImageDimensions(ratios[i()()]).width
        const height = getImageDimensions(ratios[i()()]).height
        tv.width = width
        tv.height = height
        tv.style.height = ''
        tv.style.width = ''
        tv.getContext("2d").drawImage(composite, x(), y()())
        window.ontouchend = null
        window.onscroll = drawframe
        window.ontouchmove = window.onwheel = onzoom
    }
}



function getImageDimensions(aspectRatio) {
    const maxSize = panelSize;
    const [widthRatio, heightRatio] = aspectRatio.split('/').map(Number);

    // Calculate the width and height based on the aspect ratio
    const ratio = widthRatio / heightRatio;

    let width, height;

    if (ratio > 1) {
        // Wider than tall
        width = maxSize;
        height = maxSize / ratio;
    } else {
        // Taller than wide or square
        height = maxSize;
        width = maxSize * ratio;
    }

    return {
        width: Math.round(width),
        height: Math.round(height)
    };
}



function getMatrixPosition(value, totalCells, maxRows, maxColumns) {
    // Validate inputs
    if (value < 0 || value >= totalCells) {
        return null; // Return null for invalid value
    }

    // Calculate effective number of columns in the matrix
    const effectiveColumns = Math.min(maxColumns, Math.ceil(totalCells / maxRows));

    // Calculate the row and column
    const rowIndex = Math.floor(value / effectiveColumns);
    const columnIndex = value % effectiveColumns;

    // Check if the position is within the defined limits
    if (rowIndex < maxRows && columnIndex < effectiveColumns) {
        return [rowIndex, columnIndex]; // Return as an array
    }

    return null; // Return null if out of bounds
}



function y()() { return -getMatrixPosition(i()(), imageLength, rows, cols)[0] * panelSize }
function x() { return -getMatrixPosition(i()(), imageLength, rows, cols)[1] * panelSize }
function i() { return Math.round((imageLength * mapValue(window.scrollY)) - .25) }
function docHeight() { return document.body.offsetHeight }


function mapValue(input) {
    // Ensure input is within the expected range
    if (input < gap) return -1;
    if (input > docHeight()) return 100;

    // Linear mapping from gap to 100
    return ((input - gap) / (docHeight() - gap));
}



// function advertise() {
//     advertisement.width = panelSize
//     advertisement.height = panelSize
//     const ctx = advertisement.getContext('2d');

//     // Text and padding setup
//     const text = "ADVERTISEMENT";
//     const padding = 20;

//     // Set font to small caps and configure the style
//     ctx.font = 'small-caps 24px Arial';  // Use small caps
//     ctx.textAlign = 'center';            // Center the text horizontally
//     ctx.textBaseline = 'middle';         // Center the text vertically

//     // Calculate the x and y position for centering
//     const xx = advertisement.width / 2;
//     const yy = advertisement.height / 2;

//     // Optional: Clear the advertisement (in case there was something drawn before)
//     ctx.clearRect(0, 0, advertisement.width, advertisement.height);

//     // Draw the text on the advertisement
//     ctx.fillText(text, xx, yy);
// }