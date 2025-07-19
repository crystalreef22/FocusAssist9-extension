blockedSites = ["https://www.youtube.com", "https://www.reddit.com"];
blockerActive = false;

const dbName = "ExtensionSettings";
const request = indexedDB.open(dbName, 1);
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  if (!db.objectStoreNames.contains("settings")) {
    const objectStore = db.createObjectStore("settings", { keyPath: "name" });
    objectStore.createIndex("value", "value");
    objectStore.createIndex("default", "default");
    objectStore.transaction.oncomplete = (event) => {
      // Store values in the newly created objectStore.
      const settingsObjectStore = db
        .transaction("settings", "readwrite")
        .objectStore("settings");
      settingsObjectStore.add(true, "enabled");
      settingsObjectStore.add(true, "default");
    };
  }
};
request.onerror = (event) => {
  console.error(event);
};
request.onsuccess = (event) => {
  const db = event.target.result;
  const tx = db.transaction("settings", "readonly");
  const store = tx.objectStore("settings");
  blockerActive = store.get("value");

  db.close();
};

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
