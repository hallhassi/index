let img = Array.from(document.querySelectorAll('img'));
let i, y

window.addEventListener('scroll', () => {
    img = Array.from(document.querySelectorAll('img'));
    img.forEach(el => el.classList.remove('on'))
    if (canvas.hidden !== true) {
        i = Math.round(window.scrollY * img.length / y);
        y = document.body.getBoundingClientRect().height
        requestAnimationFrame(() => {
            canvas.width = img[i].naturalWidth;
            canvas.height = img[i].naturalHeight;
            canvas.getContext("2d").drawImage(img[i], 0, 0, img[i].naturalWidth, img[i].naturalHeight);
            img[i].classList.add('on')
            canvas.parentElement.href = img[i].parentElement.href
        })
    }
});

window.addEventListener('click', handleClickOrTouch);
window.addEventListener('touchstart', handleClickOrTouch);

function handleClickOrTouch(e){
    // click outside canvas to hide it
    if (canvas.hidden !== true && e.target !== canvas) canvas.hidden = true
    // click image to show canvas
    else if (canvas.hidden && img.includes(e.target)) {
        canvas.hidden = false
        scrollTo(0, y * img.indexOf(e.target) / img.length)
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowRight') scrollBy(0, y/img.length)
    else if  (e.key == 'ArrowLeft') scrollBy(0, -y/img.length)
    else if  (e.key == 'Escape') canvas.hidden = canvas.hidden == true ? false : true
})
