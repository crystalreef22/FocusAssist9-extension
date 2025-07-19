const enabledElem = document.getElementById("enabled");
enabledElem.addEventListener("change", (event) => {
  browser.storage.local.set({ blockerActive: event.target.checked });
});

browser.storage.local.get("blockerActive", (items) => {
  enabledElem.checked = Boolean(items.blockerActive);
});
