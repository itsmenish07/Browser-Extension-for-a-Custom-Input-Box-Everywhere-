let activeInput = null;
let floatingBox = null;
let currentMode = "habit";
let settings = {
  defaultMode: 'habit',
  boxPosition: 'top',
  theme: 'light',
  apiKey: ''
};

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

chrome.storage.local.get(['defaultMode', 'boxPosition', 'theme', 'apiKey'], (prefs) => {
  settings = { ...settings, ...prefs };
  applySettings();
});

function applySettings() {
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

  if (settings.theme === 'dark') {
    floatingBox.style.background = "#222";
    floatingBox.style.color = "#eee";
  } else {
    floatingBox.style.background = "#fdfdfd";
    floatingBox.style.color = "#222";
  }

  currentMode = settings.defaultMode;
  if (currentMode === "habit") enableHabitMode();
  else enableAdvancedMode();
}

function enableHabitMode() {
  console.log("✅ Habit Mode enabled");
}
function enableAdvancedMode() {
  console.log("✅ Advanced Mode enabled");
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "updateSettings") {
    chrome.storage.local.get(['defaultMode', 'boxPosition', 'theme', 'apiKey'], (prefs) => {
      settings = { ...settings, ...prefs };
      applySettings();
    });
  } else if (msg.action === "setMode") {
    currentMode = msg.mode;
    if (currentMode === "habit") enableHabitMode();
    else enableAdvancedMode();
  }
});

document.addEventListener('focusin', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
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
  floatingBox.style.display = 'block';
  setTimeout(() => floatingBox.style.opacity = "1", 10);
  floatingBox.focus();

  if (currentMode === "habit") {
    floatingBox.value = target.value;
    floatingBox.oninput = () => { target.value = floatingBox.value; };
    target.addEventListener('input', () => { floatingBox.value = target.value; });
  } else {
    floatingBox.value = '';
    floatingBox.oninput = null;
  }
}

function hideFloatingInput() {
  floatingBox.style.opacity = "0";
  setTimeout(() => floatingBox.style.display = 'none', 200);
}

floatingBox.addEventListener('keydown', async (e) => {
  if (e.key === 'Escape') {
    hideFloatingInput();
  }

  if (e.key === 'Enter' && currentMode === "advanced") {
    e.preventDefault();
    const value = floatingBox.value.trim();
    console.log("🎯 Advanced Mode: Enter pressed. Value:", value);

    if (value.startsWith("/")) {
      const command = value.slice(1);
      console.log("🧠 Sending command to OpenRouter:", command);

      const css = await getCSSFromCommand(command);
      console.log("🎨 CSS received:", css);

      if (css) {
        injectCSS(css);
      } else {
        alert("⚠️ No CSS received from OpenRouter.");
      }

      floatingBox.value = '';
      hideFloatingInput();
    }
  }
});

// ✅ OpenRouter Chat API for CSS Commands
async function getCSSFromCommand(command) {
  const payload = {
    model: "phi-3", // use the name shown in LM Studio
    messages: [
      {
        role: "system",
        content: "You are a helpful CSS assistant. Only respond with valid CSS stylesheets, no explanations or markdown."
      },
      {
        role: "user",
        content: `Convert this instruction into CSS:\n"${command}"`
      }
    ],
    temperature: 0.5,
    max_tokens: 200
  };

  try {
    const res = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("🧠 LM Studio Response:", data);

    const css = data.choices?.[0]?.message?.content?.trim();
    console.log("🎨 Extracted CSS:", css);

    return css || null;
  } catch (err) {
    console.error("❌ LM Studio API error:", err);
    alert("⚠️ Failed to connect to LM Studio. Make sure it's running and the server is ON.");
    return null;
  }
}
