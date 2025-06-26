document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(
    ['defaultMode', 'boxPosition', 'theme', 'apiKey'],
    (prefs) => {
      document.getElementById('defaultMode').value = prefs.defaultMode || 'habit';
      document.getElementById('boxPosition').value = prefs.boxPosition || 'top';
      document.getElementById('theme').value = prefs.theme || 'light';
      document.getElementById('apiKey').value = prefs.apiKey || '';
    }
  );

  document.getElementById('saveSettings').addEventListener('click', () => {
    const defaultMode = document.getElementById('defaultMode').value;
    const boxPosition = document.getElementById('boxPosition').value;
    const theme = document.getElementById('theme').value;
    const apiKey = document.getElementById('apiKey').value;

    chrome.storage.local.set({ defaultMode, boxPosition, theme, apiKey }, () => {
      alert('Settings saved!');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "updateSettings" });
      });
    });
  });
});
