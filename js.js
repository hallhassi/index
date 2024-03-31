let img = Array.from(document.querySelectorAll('img'));
let i, y

// click or touch
window.addEventListener('click', handleClickOrTouch);
window.addEventListener('touchend', handleClickOrTouch);
function handleClickOrTouch(e) {
    // click outside canvas to hide it
    if (!canvas.hidden && e.target !== canvas) canvas.hidden = true
    // click image to show canvas
    else if (canvas.hidden && img.includes(e.target)) {
        canvas.hidden = false
        scrollTo(0, y * img.indexOf(e.target) / img.length)
    }
}

// keydown
window.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowRight') scrollBy(0, y / img.length)
    else if (e.key == 'ArrowLeft') scrollBy(0, -y / img.length)
    else if (e.key == 'Escape') canvas.hidden = canvas.hidden == true ? false : true
})

// scroll
window.addEventListener('scroll', handleScroll, { passive: true });
function handleScroll() {
    window.addEventListener('touchmove', onZoom)
    img = Array.from(document.querySelectorAll('img'));
    img.forEach(el => el.classList.remove('on'))
    if (canvas.hidden !== true) {
        i = Math.min(Math.round(window.scrollY * img.length / y), img.length-1);
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
function onZoom() {
    if (window.visualViewport.scale > 1) {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('click', handleClickOrTouch)
        window.removeEventListener('touchend', handleClickOrTouch)
        window.removeEventListener('touchmove', onZoom)
        window.addEventListener('touchmove', onReset)
        let img = new Image()
        img.src = images[i].src.replace(/\/200\//, '/800/')
        img.onload = function () {
            context.drawimage(img, 0, 0, img.naturalWidth, img.naturalHeight)
        }
    }
}

// zoom out (reset)
function onReset() {
    if (window.visualViewport.scale === 1) {
        window.removeEventListener('touchmove', onReset)
        window.addEventListener('click', handleClickOrTouch)
        window.addEventListener('touchend', handleClickOrTouch)
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}
