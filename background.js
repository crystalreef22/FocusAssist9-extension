blockedSites = ["https://www.youtube.com", "https://www.reddit.com"];
blockerActive = false;

function checkAndBlockTab(tab) {
  if (!blockerActive) return;
  let url = tab.url;
  if (url === undefined) return;
  if (blockedSites.some((site) => tab.url.startsWith(site))) {
    browser.tabs.update(tab.id, {
      url: "/blocked.html?url=" + encodeURIComponent(url),
    });
  }
}
browser.tabs.onUpdated.addListener(
  (tabId, changeInfo, tab) => {
    checkAndBlockTab(tab);
  },
  { properties: ["url"] },
);

browser.tabs.onActivated.addListener((activeInfo) =>
  browser.tabs.get(activeInfo.tabId).then((tab) => {
    checkAndBlockTab(tab);
  }, console.error),
);

browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
  checkAndBlockTab(tabs[0]);
}, console.error);
