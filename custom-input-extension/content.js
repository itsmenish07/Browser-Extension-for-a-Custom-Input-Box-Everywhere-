// ====================
// GLOBAL VARIABLES
// ====================
let activeInput = null;
let floatingBox = null;
let currentMode = "habit";
let settings = { defaultMode: 'habit', boxPosition: 'top', theme: 'light', apiKey: '' };

// ====================
// CREATE FLOATING BOX
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
  document.body.appendChild(floatingBox);
}
createFloatingBox();

// ====================
// LOAD SETTINGS
// ====================
chrome.storage.local.get(
  ['defaultMode', 'boxPosition', 'theme', 'apiKey'],
  (prefs) => {
    settings = { ...settings, ...prefs };
    applySettings();
  }
);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "updateSettings") {
    chrome.storage.local.get(
      ['defaultMode', 'boxPosition', 'theme', 'apiKey'],
      (prefs) => { settings = { ...settings, ...prefs }; applySettings(); }
    );
  } else if (msg.action === "setMode") {
    currentMode = msg.mode;
    if (currentMode === "habit") enableHabitMode();
    else enableAdvancedMode();
  }
});

function applySettings() {
  // Box position
  if (settings.boxPosition === 'top') {
    floatingBox.style.top = '10%';
    floatingBox.style.bottom = '';
    floatingBox.style.transform = 'translateX(-50%)';
  } else if (settings.boxPosition === 'center') {
    floatingBox.style.top = '50%';
    floatingBox.style.bottom = '';
    floatingBox.style.transform = 'translate(-50%, -50%)';
  } else if (settings.boxPosition === 'bottom') {
    floatingBox.style.bottom = '10%';
    floatingBox.style.top = '';
    floatingBox.style.transform = 'translateX(-50%)';
  }

  // Theme
  if (settings.theme === 'dark') {
    floatingBox.style.background = "#222";
    floatingBox.style.color = "#eee";
  } else {
    floatingBox.style.background = "#fdfdfd";
    floatingBox.style.color = "#222";
  }

  // Default mode
  currentMode = settings.defaultMode;
  if (currentMode === "habit") enableHabitMode();
  else enableAdvancedMode();
}

// ====================
// MODES
// ====================
function enableHabitMode() {
  console.log('Habit Mode enabled.');
}
function enableAdvancedMode() {
  console.log('Advanced Mode enabled.');
}

// ====================
// SHOW/HIDE FLOATING BOX
// ====================
document.addEventListener('focusin', (e) => {
  if ((e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') && currentMode === "habit") {
    activeInput = e.target;
    showFloatingInput(activeInput);
  }
});

document.addEventListener('focusout', (e) => {
  const newFocus = e.relatedTarget;
  if (!newFocus || (newFocus !== floatingBox && newFocus !== activeInput)) {
    hideFloatingInput();
  }
});

function showFloatingInput(target) {
  floatingBox.value = target.value;
  floatingBox.style.display = 'block';
  setTimeout(() => floatingBox.style.opacity = "1", 10);
  floatingBox.focus();

  floatingBox.oninput = () => { target.value = floatingBox.value; };
  target.addEventListener('input', () => { floatingBox.value = target.value; });
}

floatingBox.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideFloatingInput();
});

function hideFloatingInput() {
  floatingBox.style.opacity = "0";
  setTimeout(() => floatingBox.style.display = 'none', 200);
}
