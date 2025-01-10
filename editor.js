const editor = document.getElementById('editor');
const fileList = document.getElementById('fileList');

let currentFileIndex = 0; // First selected file in the range
let selectedFileIndex = null; // Current file being navigated to
let selectedFiles = [];
let files = []; // Array to store file data (name and content)

// Initialize on window load
window.onload = () => {
    loadFilesFromStorage();
    displayFiles();
    if (files.length > 0) {
        loadFile(0); // Load the first file initially
    } else {
        createNewFile(); // Create a new file if there are no files
    }
};

// Event Listeners
editor.addEventListener('input', saveFileContent);
editor.addEventListener('keydown', handleKeydown);

// Functions for loading, saving, and displaying files

// Load files from localStorage
function loadFilesFromStorage() {
    const savedFiles = JSON.parse(localStorage.getItem('files')) || [];
    files = savedFiles;
}

// Save content to localStorage as the user types
function saveFileContent() {
    if (currentFileIndex !== null) {
        const content = editor.innerText.trim();
        files[currentFileIndex].content = content.length === 0 ? '' : content;
        localStorage.setItem('files', JSON.stringify(files));
        displayFiles(); // Refresh the file list display
    }
}

// Display all files in the file list
function displayFiles() {
    fileList.innerHTML = ''; // Clear existing file list
    files.forEach((file, index) => {
        const fileItem = document.createElement('span');
        const contentPreview = file.content.slice(0, 12);
        const displayText = contentPreview.length < file.content.length ? contentPreview + '...' : contentPreview;
        fileItem.textContent = displayText || "(empty)";
        fileItem.classList.add('fileItem');
        fileItem.dataset.index = index;
        fileList.appendChild(fileItem);
        fileItem.addEventListener('click', () => {
            currentFileIndex = index;
            loadFile(index)});
    });

    selectCurrentFile(); // Ensure current file is selected in the list
}

// Select the current file in the file list
function selectCurrentFile() {
    clearSelection(); // Clear previous selections
    if (currentFileIndex !== null) {
        selectedFiles.push(files[currentFileIndex]); // Add the current file to selected files
        updateFileListSelection();
    }
}

// Update the file list selection visually
function updateFileListSelection() {
    [...fileList.children].forEach((fileItem, index) => {
        const file = files[index];
        const isSelected = selectedFiles.includes(file);
        fileItem.classList.toggle('selected', isSelected);
    });
}

// Clear the selected files array and update UI
function clearSelection() {
    selectedFiles = [];
    updateFileListSelection();
}

// Load a file into the editor
function loadFile(index) {
    if (index >= 0 && index < files.length) {
        selectedFileIndex = index;
        editor.innerText = files[index].content;
        setCursorAtEnd();
        selectCurrentFile();
    } else {
        editor.innerText = ''; // If no valid file, clear the editor
    }
}

// Set cursor at the end of the content
function setCursorAtEnd() {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(editor);
    range.collapse(false); // Collapse the range to the end
    selection.removeAllRanges();
    selection.addRange(range);
}

// Handle keydown events for various shortcuts
function handleKeydown(event) {
    // Ctrl + Enter to create a new file after the current file index
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      createNewFileAfterCurrent();
    }
  
    // Arrow keys for navigation with Ctrl
    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && event.ctrlKey && !event.shiftKey) {
      event.preventDefault();
      if (event.key === 'ArrowUp') {
        navigateToPrevFile();
      } else if (event.key === 'ArrowDown') {
        // If at the end of the list, trigger the Ctrl + Enter behavior
        if (currentFileIndex === files.length - 1) {
          createNewFileAfterCurrent();
        } else {
          navigateToNextFile();
        }
      }
    }
  
    // Ctrl + Shift + Arrow for selection
    if (event.ctrlKey && event.shiftKey) {
      event.preventDefault();
      handleSelection(event);
    }
  
    // Delete selected files with Ctrl + Backspace
    if (event.key === 'Backspace' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      deleteSelectedFiles();
      if (files.length === 0) createNewFile(); // If no files left, create a new file
    }
  }

// Create a new file after the current file index
function createNewFileAfterCurrent() {
    const newFile = { name: `New File ${files.length + 1}`, content: '' };
    files.splice(currentFileIndex + 1, 0, newFile);
    localStorage.setItem('files', JSON.stringify(files));
    displayFiles();
    currentFileIndex++;
    loadFile(currentFileIndex);
}

// Handle file selection with Ctrl + Shift + Arrow Up / Down
function handleSelection(event) {
    if (currentFileIndex === null) {
        currentFileIndex = selectedFileIndex;
    }

    if (event.key === 'ArrowUp' && selectedFileIndex > 0) {
        selectedFileIndex--;
        updateSelectionRange();
    } else if (event.key === 'ArrowDown' && selectedFileIndex < files.length - 1) {
        selectedFileIndex++;
        updateSelectionRange();
    }
}

// Update the selectedFiles array based on the selection range
function updateSelectionRange() {
    const rangeStart = Math.min(currentFileIndex, selectedFileIndex);
    const rangeEnd = Math.max(currentFileIndex, selectedFileIndex);
    selectedFiles = files.slice(rangeStart, rangeEnd + 1);
    updateFileListSelection();
}

// Create a new file
function createNewFile() {
    const newFile = { name: `New File ${files.length + 1}`, content: '' };
    files.push(newFile);
    localStorage.setItem('files', JSON.stringify(files));
    displayFiles();
    loadFile(files.length - 1);
}

// Navigate to the previous file
function navigateToPrevFile() {
    if (currentFileIndex > 0) {
        currentFileIndex--;
        loadFile(currentFileIndex);
    }
}

// Navigate to the next file
function navigateToNextFile() {
    if (currentFileIndex < files.length - 1) {
        currentFileIndex++;
        loadFile(currentFileIndex);
    }
}

function deleteSelectedFiles() {
    // Get the indices of the selected files, sorted in descending order (to avoid shifting issues when deleting)
    const indicesToDelete = selectedFiles.map(file => files.indexOf(file)).sort((a, b) => b - a);

    // Store the current file index before deleting
    const oldCurrentFileIndex = currentFileIndex;

    // Delete the files from the array
    indicesToDelete.forEach(index => {
        files.splice(index, 1);
    });

    // Update the file list in localStorage
    localStorage.setItem('files', JSON.stringify(files));
    displayFiles(); // Refresh the UI

    // Update the currentFileIndex after the deletion
    if (files.length > 0) {
        // Find the number of files deleted before the currentFileIndex
        let deletedBefore = indicesToDelete.filter(index => index < oldCurrentFileIndex).length;

        // Adjust the currentFileIndex downwards by the number of deleted files before it
        currentFileIndex = oldCurrentFileIndex - deletedBefore;

        // Ensure currentFileIndex is within bounds
        if (currentFileIndex >= files.length) {
            currentFileIndex = files.length - 1;
        }

        // Load the newly selected file (currentFileIndex after deletion)
        loadFile(currentFileIndex);

        // Update selection in the file list
        selectCurrentFile();
    } else {
        // If no files remain, create a new file
        createNewFile(); // Create a new file

        // Ensure the editor is empty and ready for the new file
        editor.innerText = ''; // Clear the editor content
        currentFileIndex = 0; // Set the index to the first file (the newly created one)

        // Ensure file list shows the new file
        displayFiles();
        selectCurrentFile(); // Select the new file in the UI
    }
}
