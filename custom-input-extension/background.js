chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

chrome.commands.onCommand.addListener((command) => {
  console.log("Command triggered:", command);
  // You'll send this to content.js later
});