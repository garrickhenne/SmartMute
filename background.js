console.log("background running");

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

//JS forgets currentMutedTab and currentPlayingTab, find a way to get info
chrome.tabs.onUpdated.addListener((tabId, change, playingTab) => {
  if (isWaitingToUnmute) {
    chrome.tabs.get(currentPlayingTab, function(currentPlayingTabTab) {
      if (playingTab.id === currentPlayingTabTab.id && !currentPlayingTabTab.audible) {
        chrome.tabs.update(currentMutedTab, {muted: false});
        console.log(`Successfully UNMUTED: ${currentMutedTab}`);
        isWaitingToUnmute = false;
        return;
      }
    });
  }
})


function muteInactiveTabs(firstTab,change) {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      if (tab.audible && tab.id !== firstTab.id && !isWaitingToUnmute) {
        chrome.tabs.update(tab.id, { muted: true });
        console.log(`TAB MUTED: ${tab.url}`);
        console.log(`TAB PLAYING: ${firstTab.url}`);
        currentMutedTab   = tab.id;
        currentPlayingTab = firstTab.id;
        isWaitingToUnmute = true;
        console.log(`Current Muted Tab: ${currentMutedTab}`);
        console.log(`isWaitingToUnMute is currently: ${isWaitingToUnmute}`);
        return;
      }
    });
  });
}


// const { audible, mutedInfo } = change;
//           if (audible || mutedInfo && !mutedInfo.muted) {
//           chrome.tabs.update(tabs[i].id, {muted: true});