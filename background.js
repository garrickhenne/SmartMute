console.log("background running");

chrome.browserAction.onClicked.addListener(buttonClicked);



//TODO: use tabs.query to get list of tabs?
chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
  const { audible, mutedInfo } = change;
  if (audible || mutedInfo && !mutedInfo.muted) {
    chrome.tabs.update(tabId, {muted: true});
  } 
});

function buttonClicked(tab) {
  console.log(tab);
}
