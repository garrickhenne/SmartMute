console.log("background running");

chrome.browserAction.onClicked.addListener(buttonClicked);



//TODO: use tabs.query to get list of tabs?
chrome.tabs.onUpdated.addEventListener((tabId, change, tab) => {
  /*
  "Destructuring assignment", same as:
    const audible = change.audible
    const mutedInfo = change.mutedInfo
  */
  const { audible, mutedInfo } = change;
  if (audible || mutedInfo && !mutedInfo.muted) {
    chrome.tabs.update(tabId, {muted: true});
  }
});

function buttonClicked(tab) {
  console.log(tab);
}
