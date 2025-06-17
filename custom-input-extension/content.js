let activeInput = null;
let floatBox = null;

document.addEventListener("focusin", (e) => {
  if (e.target.tagName === "TEXTAREA" || (e.target.tagName === "INPUT" && e.target.type === "text")) {
    activeInput = e.target;
    showFloatingBox(activeInput.value);
  }
});

document.addEventListener("focusout", (e) => {
  if (floatBox && !floatBox.contains(e.relatedTarget)) {
    hideFloatingBox();
  }
});
function showFloatingBox(initialValue) {
  if (floatBox) return;

  floatBox = document.createElement("textarea");
  floatBox.id = "custom-floating-box";
  floatBox.value = initialValue;
  document.body.appendChild(floatBox);

  floatBox.focus();

  // Sync typed text to actual input
  floatBox.addEventListener("input", () => {
    if (activeInput) activeInput.value = floatBox.value;
  });
}
function hideFloatingBox() {
  if (floatBox) {
    floatBox.remove();
    floatBox = null;
    activeInput = null;
  }
}