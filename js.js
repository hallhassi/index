let img = Array.from(document.querySelectorAll('img'));
let i, y

canvaswrapper.addEventListener('click', hide)
function hide(e) {
    console.log(e.target);
    if (e.target !== canvas) {
        canvaswrapper.hidden = true
    }
}

img.forEach((el, index) => {
    el.addEventListener('click', (e) => {
        console.log(e.target);
        if (e.target !== canvaswrapper) {
            canvaswrapper.hidden = false
            scrollTo(0, y * index / img.length)
        }
    })
})

// scroll
window.addEventListener('scroll', handleScroll, { passive: true });
function handleScroll() {
    img = Array.from(document.querySelectorAll('img'));
    img.forEach(el => el.classList.remove('on'))
    if (!canvaswrapper.hidden) {
        window.addEventListener('touchmove', onZoom)
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
function onZoom() {
    if (window.visualViewport.scale > 1) {
        removeClickOrTouch()
        window.removeEventListener('scroll', handleScroll)
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
        addClickOrTouch()
        window.removeEventListener('touchmove', onReset)
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

// keydown
window.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowRight') scrollBy(0, y / img.length)
    else if (e.key == 'ArrowLeft') scrollBy(0, -y / img.length)
    else if (e.key == 'Escape') canvaswrapper.hidden = canvaswrapper.hidden == true ? false : true
})


// click or touch
// function addClickOrTouch() {
//     window.addEventListener('click', handleClickOrTouch);
//     window.addEventListener('touchend', handleClickOrTouch);
// }
// function removeClickOrTouch() {
//     window.removeEventListener('click', handleClickOrTouch);
//     window.removeEventListener('touchend', handleClickOrTouch);
// }

// function handleClickOrTouch(e) {
//     console.log(e);
//     console.log(eventHandled);
//     if (!eventHandled) {
//         // hide canvas
//         if (!canvas.hidden && e.target !== canvas) canvas.hidden = true
//         // show canvas
//         else if (canvas.hidden && img.includes(e.target)) {
//             canvas.hidden = false
//             scrollTo(0, y * img.indexOf(e.target) / img.length)
//         }

//         eventHandled = true;

//         setTimeout(function() {
//           eventHandled = false;
//         }, 500); // Adjust the delay as needed
//       }
// }

// function hide() {
//     // hide canvas
//     if (!canvas.hidden && e.target !== canvas) canvas.hidden = true
//     // show canvas
//     else if (canvas.hidden && img.includes(e.target)) {
//         canvas.hidden = false
//         scrollTo(0, y * img.indexOf(e.target) / img.length)
//     }
// }
