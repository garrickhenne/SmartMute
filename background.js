var isWaitingToUnmute = false;
var currentMutedTab;
var currentPlayingTab;

chrome.tabs.onUpdated.addListener((tabId, change, firstTab) => {
  /*
  "Destructuring assignment", same as:
    const audible = change.audible
    const mutedInfo = change.mutedInfo
  */
 if (change.hasOwnProperty("audible")) {
    muteInactiveTabs(firstTab,change);
  }
});

//Unmutes Audio when played audio is done
chrome.tabs.onUpdated.addListener((tabId, change, playingTab) => {
  if (isWaitingToUnmute) {
    chrome.tabs.get(currentPlayingTab, function(currentPlayingTabTab) {
      if (playingTab.id === currentPlayingTabTab.id && !currentPlayingTabTab.audible) {
        chrome.tabs.update(currentMutedTab, {muted: false});
        isWaitingToUnmute = false;
        return;
      }
    });
  }
})

//Unmutes Audio when played audio's tab is removed
chrome.tabs.onRemoved.addListener((closingTabId, removeInfo) => {
  if (isWaitingToUnmute && (currentPlayingTab != undefined)) {
    if (closingTabId === currentPlayingTab) {
      chrome.tabs.update(currentMutedTab, {muted: false});
      isWaitingToUnmute = false;
      return;
    }
  }
});


function muteInactiveTabs(firstTab,change) {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      if (tab.audible && tab.id !== firstTab.id && !isWaitingToUnmute) {
        chrome.tabs.update(tab.id, { muted: true });
        currentMutedTab   = tab.id;
        currentPlayingTab = firstTab.id;
        isWaitingToUnmute = true;
        return;
      }
    });
  });
}