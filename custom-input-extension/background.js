// background.js
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-habit-mode") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "setMode", mode: "habit" });
    });
  } else if (command === "toggle-advanced-mode") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "setMode", mode: "advanced" });
    });
  }
});
