// popup.js
document.addEventListener('change', (e) => {
  if (e.target.name === 'mode') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "setMode", mode: e.target.value });
    });
  }
});
