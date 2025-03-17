// load
const savedHtml = localStorage.getItem('savedHtml')
if (savedHtml) {
    document.documentElement.innerHTML = savedHtml;
}
// save
function save() {
    localStorage.setItem('savedHtml', document.documentElement.innerHTML);
}
// variables
let c // current
let p // previous
let n // next
rv() // refresh variables
c.focus()
restoreCursorPosition()
function rv() { // refresh variables
    c = document.querySelector('.c') // current
    if (c.previousElementSibling?.tagName === 'DIV') p = c.previousElementSibling // previous
    else p = null
    if (c.nextElementSibling?.tagName === 'DIV') n = c.nextElementSibling // next
    else n = null
}
// rc()
// remove c
function rc() {
    c.classList.remove('c')
}
// ac(x)
// add c (to x)
function ac(x) {
    x.classList.add('c')
}
// focus c
function fc() {
    c.focus()
}
// go (to x)
function go(x) {
    rc() // remove c
    ac(x) // add c (to x)
    rv() // refresh variables
    c.focus()
    restoreCursorPosition()
}
function saveCaretPosition() {
    setTimeout(() => {
        const caretPosition = window.getSelection().getRangeAt(0);
        let nodeIndex = -1;
        nodeIndex = [...c.childNodes].indexOf(caretPosition.startContainer);
        // Store the cursor position directly within the div
        const cursorPosition = JSON.stringify({
            node: nodeIndex,
            offset: caretPosition.startOffset,
        });
        if (nodeIndex > -1) c.dataset.lastCursorPosition = cursorPosition;
    }, 1);
}
function restoreCursorPosition() {
    setTimeout(() => {
        // Retrieve the stored cursor position
        const storedCursorPosition = c.dataset?.lastCursorPosition;
        if (!storedCursorPosition) return;

        // Parse the stored cursor position
        const cursorPosition = JSON.parse(storedCursorPosition);
        const nodeIndex = cursorPosition.node;
        const offset = cursorPosition.offset;

        // Get the child node at the stored index
        const childNodes = Array.prototype.slice.call(c.childNodes);
        const startContainer = childNodes[nodeIndex];

        // Create a range and set its start position
        const range = document.createRange();
        range.setStart(startContainer, offset);
        range.setEnd(startContainer, offset); // Set the end position to the same offset

        // Create a selection and add the range
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }, 1);
}
document.addEventListener('click', function (event) {
    event.preventDefault();
    saveCaretPosition();
})
// listen for keydown
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey) {
        // ctrl left
        if (event.ctrlKey && event.key === 'ArrowLeft') {
            if (p) go(p)
            else {
                const newDiv = document.createElement('div');
                newDiv.contentEditable = true;
                c.insertAdjacentElement('beforebegin', newDiv);
                go(newDiv)
            }
            updateDivs()
        }
        // ctrl right
        if (event.ctrlKey && event.key === 'ArrowRight') {
            if (n) go(n)
            else {
                const newDiv = document.createElement('div');
                newDiv.contentEditable = true;
                c.insertAdjacentElement('afterend', newDiv);
                go(newDiv)
            }
            updateDivs()
        }
    }
    else if (event.key === 'Enter') {
        event.preventDefault();
        document.execCommand('insertLineBreak');
        // Add delay to ensure DOM is updated before saving caret position
        setTimeout(() => {
            saveCaretPosition();
        }, 10);
    }
    else {
        saveCaretPosition();
    }
    save();
});


// Update Divs
function updateDivs() {
    const divs = document.querySelectorAll('body>div')
    divs.forEach((div, index) => {
        if (div.classList.contains('c')) {
            div.style = ''
            return;
        }

        const currentIndex = Array.from(divs).findIndex(sibling => sibling.classList.contains('c'))
        let distance = Math.abs(index - currentIndex)
        let opacity = 1 - 0.1 * distance;
        let scale = 1 + 0.1 * distance;

        if (index > currentIndex) {
            opacity = .3 - 0.03 * distance;
            scale = 1 - 0.03 * distance;
        } else {
            opacity = .3 - 0.03 * distance;
            scale = 1 + 0.03 * distance;
        }

        div.style.opacity = opacity;
        div.style.transform = `scale(${scale})`;
    });
}
