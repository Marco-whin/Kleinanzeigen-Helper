// Firefox compatibility
const storageAPI = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
const tabsAPI = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;
const runtimeAPI = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;

// Load stats
function loadStats() {
  storageAPI.sync.get(['templates', 'hiddenAds']).then((result) => {
    const templates = result.templates || [];
    const hiddenAds = result.hiddenAds || [];
    
    document.getElementById('templateCount').textContent = templates.length;
    document.getElementById('hiddenCount').textContent = hiddenAds.length;
  });
}

// Open settings page
document.getElementById('openSettings').addEventListener('click', () => {
  runtimeAPI.openOptionsPage();
});

// Clear hidden ads
document.getElementById('clearHidden').addEventListener('click', () => {
  if (!confirm('Möchtest du alle ausgeblendeten Anzeigen zurücksetzen?')) return;
  
  storageAPI.sync.set({ hiddenAds: [] }).then(() => {
    loadStats();
    
    // Refresh all Kleinanzeigen tabs
    tabsAPI.query({ url: 'https://www.kleinanzeigen.de/*' }).then((tabs) => {
      tabs.forEach(tab => tabsAPI.reload(tab.id));
    });
  });
});

// Load on open
loadStats();
