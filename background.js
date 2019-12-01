console.log("background running");

//chrome.tabs.onUpdated.addListener(buttonClicked);



//TODO: use tabs.query to get list of tabs?
chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
  /*
  "Destructuring assignment", same as:
    const audible = change.audible
    const mutedInfo = change.mutedInfo
  */
  chrome.tabs.query( {} , function (tabs) {
    tabs.forEach(function(tab) {
      if ((tab.audible || tab.mutedInfo && !tab.mutedInfo.muted) && tab.id !== tabId && change.hasOwnProperty("audible")) {
        chrome.tabs.update(tab.id, {muted: true});

      }
    })
  })
});


// const { audible, mutedInfo } = change;
//           if (audible || mutedInfo && !mutedInfo.muted) {
//           chrome.tabs.update(tabs[i].id, {muted: true});