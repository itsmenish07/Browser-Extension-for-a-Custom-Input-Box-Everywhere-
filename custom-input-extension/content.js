let currentTarget = null;
let floatingBox = null;

document.addEventListener("focusin", (event) => {
  const target = event.target;
  if (target.tagName === "TEXTAREA" || (target.tagName === "INPUT" && target.type === "text")) {
    currentTarget = target;
    showFloatingBox(target);
  }
});

function showFloatingBox(originalInput) {
  if (floatingBox) floatingBox.remove();

  floatingBox = document.createElement("textarea");
  floatingBox.value = originalInput.value;

  floatingBox.style.position = "fixed";
  floatingBox.style.top = "30%";
  floatingBox.style.left = "50%";
  floatingBox.style.transform = "translateX(-50%)";
  floatingBox.style.zIndex = "9999";
  floatingBox.style.width = "400px";
  floatingBox.style.height = "100px";
  floatingBox.style.padding = "10px";
  floatingBox.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
  floatingBox.style.fontSize = "16px";
  floatingBox.style.background = "#f9f9f9";
  floatingBox.style.border = "1px solid #aaa";
  floatingBox.style.borderRadius = "8px";
  floatingBox.style.outline = "none";

  document.body.appendChild(floatingBox);
  floatingBox.focus();

  // ✅ Sync floating → original
  floatingBox.addEventListener("input", () => {
    originalInput.value = floatingBox.value;

    // 🔄 Trigger input event (very important for compatibility)
    const inputEvent = new Event('input', { bubbles: true });
    originalInput.dispatchEvent(inputEvent);
  });

  // Hide when pressing Esc
  floatingBox.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      floatingBox.remove();
      floatingBox = null;
    }
  });
}
