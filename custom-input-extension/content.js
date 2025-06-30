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
  if (!settings.apiKey) {
    alert("❌ No API key set. Please paste your OpenRouter key in settings.");
    return null;
  }

  const messages = [
    {
      role: "system",
      content: "You are a helpful CSS assistant. Respond with only raw CSS code. No markdown, no explanation."
    },
    {
      role: "user",
      content: `Generate CSS for the following command:\n${command}`
    }
  ];

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${settings.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",  // You can try others too
        messages: messages,
        max_tokens: 200,
        temperature: 0.5
      })
    });

    const data = await res.json();
    console.log("📦 Full OpenRouter Chat Response:", data);

    const css = data.choices?.[0]?.message?.content?.trim();
    console.log("📦 Extracted CSS:", css);

    return css || null;
  } catch (err) {
    console.error("❌ OpenRouter API error:", err);
    alert("⚠️ Failed to connect to OpenRouter.");
    return null;
  }
}

function injectCSS(css) {
  let styleTag = document.getElementById('custom-css-injector');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'custom-css-injector';
    document.head.appendChild(styleTag);
  }
  styleTag.textContent += `\n${css}`;
  console.log("✅ Injected CSS:", css);
}
