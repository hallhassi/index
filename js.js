
// --- Configuration ---
const STORAGE_KEY = 'tragedyFilterState';
const BODY_CLASS = 'show-tragedy';
const SWITCH_ID = 'tragedy-switch';

function initializeTragedySwitch() {
    const body = document.body;
    const switchElement = document.getElementById(SWITCH_ID);

    if (!switchElement) {
        console.error(`Error: Could not find the switch element with ID: ${SWITCH_ID}. Make sure the HTML is present.`);
        return;
    }

    // --- A. Load state from Local Storage ---
    // Local Storage stores everything as strings, so we compare to the string 'true'
    const storedState = localStorage.getItem(STORAGE_KEY) === 'true';

    // --- B. Apply initial state to body and switch ---
    if (storedState) {
        body.classList.add(BODY_CLASS);
        switchElement.checked = true;
        console.log("Tragedy images filter loaded: ON.");
    } else {
        // Default is OFF, so the CSS hides the images
        body.classList.remove(BODY_CLASS);
        switchElement.checked = false;
        console.log("Tragedy images filter loaded: OFF (Default).");
    }

    // --- C. Add Event Listener for Toggling ---
    switchElement.addEventListener('change', function () {
        const isChecked = this.checked;

        if (isChecked) {
            // Switch ON: Add class to body and save state
            body.classList.add(BODY_CLASS);
            localStorage.setItem(STORAGE_KEY, 'true');
            console.log("Tragedy images switch: ON. Local Storage updated.");
        } else {
            // Switch OFF: Remove class from body and save state
            body.classList.remove(BODY_CLASS);
            localStorage.setItem(STORAGE_KEY, 'false');
            console.log("Tragedy images switch: OFF. Local Storage updated.");
        }
    });

    console.log("Tragedy switch successfully initialized.");
}

// Execute the initialization function
initializeTragedySwitch();









