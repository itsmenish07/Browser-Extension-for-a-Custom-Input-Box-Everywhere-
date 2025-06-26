let currentMode = "habit"; // Default mode

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "setMode") {
    currentMode = msg.mode;
    if (currentMode === "habit") {
      enableHabitMode();
    } else {
      enableAdvancedMode();
    }
  }
});

function enableHabitMode() {
  console.log('Habit Mode enabled');
  // You can put logic to activate floating box features
}
function enableAdvancedMode() {
  console.log('Advanced Mode enabled');
  // You can put logic to disable floating box & enable advanced stuff
}

// ====================
// GLOBAL VARIABLES
// ====================

let activeInput = null;
let floatingBox = null;


// ====================
// CREATE & STYLE THE FLOATING BOX
// ====================

function createFloatingBox() {
  floatingBox = document.createElement('textarea');
  floatingBox.id = 'habit-mode-input';

  floatingBox.style.cssText = `
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px;
    min-width: 320px;
    border-radius: 8px;
    border: 1px solid #888;
    background: #fdfdfd;
    color: #222;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    font-size: 1rem;
    resize: none;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.2s ease;
    display: none;
  `;

  // Dark mode support
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    floatingBox.style.background = "#222";
    floatingBox.style.color = "#eee";
  }

  document.body.appendChild(floatingBox);
}
createFloatingBox();


// ====================
// SHOW FLOATING BOX WHEN INPUT FOCUSES
// ====================

document.addEventListener('focusin', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    activeInput = e.target;
    showFloatingInput(activeInput);
  }
});

function showFloatingInput(target) {
  floatingBox.value = target.value;
  floatingBox.style.display = 'block';
  setTimeout(() => (floatingBox.style.opacity = "1"), 10); // fade-in
  floatingBox.focus();

  // Sync floating → original
  floatingBox.oninput = () => {
    target.value = floatingBox.value;
  };

  // Sync original → floating
  target.addEventListener('input', () => {
    floatingBox.value = target.value;
  });
}


// ====================
// HIDE FLOATING BOX WHEN FOCUS MOVES AWAY
// ====================

document.addEventListener('focusout', (e) => {
  const newFocus = e.relatedTarget;
  if (!newFocus || (newFocus !== floatingBox && newFocus !== activeInput)) {
    hideFloatingInput();
  }
});

floatingBox.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideFloatingInput();
});

function hideFloatingInput() {
  floatingBox.style.opacity = "0";
  setTimeout(() => floatingBox.style.display = 'none', 200); // hide after fade
}
