// Enable drag-and-drop functionality for image rearrangement and deletion on backspace
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img'); // Select all images

    images.forEach((img, index) => {
        img.setAttribute('draggable', true); // Make images draggable

        img.addEventListener('dragstart', function (e) {
            e.target.classList.add('dragging'); // Optional: Add a class to style the dragged image
        });

        img.addEventListener('dragend', function (e) {
            e.target.classList.remove('dragging'); // Remove the class when drag ends
        });

        img.addEventListener('dragover', function (e) {
            e.preventDefault(); // Allow drop
            const draggingElement = document.querySelector('.dragging'); // Get the dragged image
            const target = e.target;

            if (target !== draggingElement && target.nodeName === 'IMG') {
                // Insert the dragged image before or after the target depending on mouse position
                const rect = target.getBoundingClientRect();
                const isBefore = e.clientX < rect.left + rect.width / 2;
                target.parentNode.insertBefore(draggingElement, isBefore ? target : target.nextSibling);
            }
        });

        img.addEventListener('drop', function (e) {
            e.preventDefault();
        });

        // Enable deletion of image with the backspace key when clicked
        img.addEventListener('click', function () {
            const currentImg = img; // Reference to the clicked image

            // Listen for the backspace key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace') {
                    currentImg.remove(); // Remove the image from the DOM
                }
            });
        });
    });
});
