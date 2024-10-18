let img = Array.from(document.querySelectorAll('img'));
let i, y // current index of images, height of document body

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('touchmove', zoomIn)
window.addEventListener('wheel', zoomIn)

// click image
img.forEach((el, index) => {
    el.addEventListener('click', (e) => {
        img[i].classList.add('on')
        canvaswrapper.hidden = false
        scrollTo(0, y * index / img.length)
    })
})

// hide canvas
canvaswrapper.addEventListener('click', (e) => {
    if (e.target !== canvas) {
        canvaswrapper.hidden = true
        img.forEach(el => el.classList.remove('on'))
    }
})

// scroll
function handleScroll() {
    img = Array.from(document.querySelectorAll('img'));
    img.forEach(el => el.classList.remove('on'))
    if (!canvaswrapper.hidden) { // if canvas is visible
        i = Math.min(Math.round(window.scrollY * img.length / y), img.length - 1);
        y = document.body.getBoundingClientRect().height
        requestAnimationFrame(() => {
            canvas.width = img[i].naturalWidth;
            canvas.height = img[i].naturalHeight;
            canvas.getContext("2d").drawImage(img[i], 0, 0, img[i].naturalWidth, img[i].naturalHeight);
            img[i].classList.add('on')
            canvas.parentElement.href = img[i].parentElement.href
        })
    }
}

// zoom in
function zoomIn() {
    if (window.visualViewport.scale > 1 && !canvaswrapper.hidden) {
        let hiRes = new Image()
        hiRes.src = img[i].src.replace('blaiselarmee.mo.cloudinary.net/800', 'raw.githubusercontent.com/hallhassi/index/main')
        hiRes.onload = function () {
            const h = canvas.height
            const w = canvas.width
            if (w < document.body.getBoundingClientRect().width) canvas.style.height = h
            if (h < document.body.getBoundingClientRect().height) canvas.style.width = w
            canvas.width = hiRes.naturalWidth
            canvas.height = hiRes.naturalHeight
            canvas.getContext("2d").drawImage(hiRes, 0, 0, hiRes.naturalWidth, hiRes.naturalHeight)
        }
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('touchmove', zoomIn)
        window.removeEventListener('wheel', zoomIn);
        window.addEventListener('touchmove', zoomOut)
        window.addEventListener('wheel', zoomOut)
    }
}

// zoom out (reset)
function zoomOut() {
    if (window.visualViewport.scale === 1) {
        canvas.width = img[i].naturalWidth;
        canvas.height = img[i].naturalHeight;
        canvas.style.height = ''
        canvas.style.width = ''
        canvas.getContext("2d").drawImage(img[i], 0, 0, img[i].naturalWidth, img[i].naturalHeight);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('touchmove', zoomIn)
        window.addEventListener('wheel', zoomIn)
        window.removeEventListener('touchmove', zoomOut)
    }
}

// keydown
window.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowRight') scrollBy(0, y / img.length)
    else if (e.key == 'ArrowLeft') scrollBy(0, -y / img.length)
    else if (e.key == 'Escape') canvaswrapper.hidden = canvaswrapper.hidden == true ? false : true
})
