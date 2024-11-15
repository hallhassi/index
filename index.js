function img() { return Array.from(document.querySelectorAll('img')).filter(img => img.complete && img.naturalWidth > 0) }
function i() { return Math.min(Math.round(window.scrollY * img().length / y()), img().length - 1) }
function y() { return document.body.getBoundingClientRect().height }
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('touchmove', zoomIn)
window.addEventListener('wheel', zoomIn)

// image links
Array.from(document.querySelectorAll('img')).forEach((el) => {
    if (el.complete && el.naturalWidth > 0) {
      // Image already loaded
      requestAnimationFrame(() => {
        el.parentNode.style.display = '';
      });
    } else {
      el.addEventListener('load', function() {
        requestAnimationFrame(() => {
          el.parentNode.style.display = '';
        });
      });
    }
    el.parentNode.addEventListener('click', (e) => {
        e.preventDefault()
    })
  });  

// hide canvas
canvaswrapper.addEventListener('click', (e) => {
    if (e.target !== canvas) {
        canvaswrapper.hidden = true
    }
})

// scroll
function handleScroll() {
    if (!canvaswrapper.hidden) { // if canvas is visible
        requestAnimationFrame(() => {
            canvas.width = img()[i()].naturalWidth;
            canvas.height = img()[i()].naturalHeight;
            canvas.getContext("2d").drawImage(img()[i()], 0, 0, img()[i()].naturalWidth, img()[i()].naturalHeight);
            canvas.parentElement.href = img()[i()].parentElement.href
            info.innerText = img()[i()].parentNode.innerText
        })
    }
}

// zoom in
function zoomIn() {
    if (window.visualViewport.scale > 1 && !canvaswrapper.hidden) {
        let hiRes = new Image()
        hiRes.src = img()[i()].src.replace('/300/', '/hi/')
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
        canvas.width = img()[i()].naturalWidth;
        canvas.height = img()[i()].naturalHeight;
        canvas.style.height = ''
        canvas.style.width = ''
        canvas.getContext("2d").drawImage(img()[i()], 0, 0, img()[i()].naturalWidth, img()[i()].naturalHeight);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('touchmove', zoomIn)
        window.addEventListener('wheel', zoomIn)
        window.removeEventListener('touchmove', zoomOut)
    }
}

// keydown
window.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowRight') scrollBy(0, y() / img().length)
    else if (e.key == 'ArrowLeft') scrollBy(0, -y() / img().length)
    else if (e.key == 'Escape') canvaswrapper.hidden = canvaswrapper.hidden == true ? false : true
})