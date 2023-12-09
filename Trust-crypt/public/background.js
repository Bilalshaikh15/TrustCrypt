// async function getCurrentTab() {
//   let queryOptions = { active: false, lastFocusedWindow: true };
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   let [tab] = await chrome.tabs.query(queryOptions);
//   return tab;
// }

// function sendWindowObjectToPopup() {
//   console.log("before timeout", window);
//   console.log("window.ether", window.ethereum);
//   console.log(chrome);
// }

try {
  // chrome.action.addListener(function () {
  // if (reason === 'install') {
  //   chrome.tabs.create({
  //     url: "onboarding.html"
  //   });
  // }
  //some other code here
  //   console.log("Installed");
  //   const tab = getCurrentTab()
  //     .then((tab) => {
  //       console.log("tab", tab);
  //       console.log("tab.id", tab.id);

  //       return tab.id;
  //     })
  //     .then((tabId) => {
  //       chrome.scripting
  //         .executeScript({
  //           target: { tabId },
  //           world: "MAIN",
  //           func: sendWindowObjectToPopup,
  //         })
  //         .then(() => console.log("script injected"));
  //     });
  // });

  // chrome.runtime.onConnect.addListener(function (port) {
  //   console.assert(port.name === "knockknock");
  //   port.onMessage.addListener(function (msg) {
  //     if (msg.joke === "Knock knock")
  //       port.postMessage({ question: "Who's there?" });
  //     else if (msg.answer === "Madame")
  //       port.postMessage({ question: "Madame who?" });
  //     else if (msg.answer === "Madame... Bovary")
  //       port.postMessage({ question: "I don't get it." });
  //   });
  // });

  // chrome.runtime.onMessageExternal.addListener(
  //   function (request, sender, sendResponse) {
  //     if (sender.id === blocklistedExtension)
  //       return;  // don't allow this extension access
  //     else if (request.getTargetData)
  //       sendResponse({ targetData: targetData });
  //     else if (request.activateLasers) {
  //       var success = activateLasers();
  //       sendResponse({ activateLasers: success });
  //     }
  //   });
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    console.log(message);
    switch (message.key) {
      case "form_submit":
        sendResponse("Submitted");
        break;
      case "YES":
        //Save Password to IPFS OR BlockChain
        sendResponse("Saved");
        break;
      case "NO":
        //DO NOthing
        sendResponse("NotSaved");
        break;
      default:
        break;
    }
  });
} catch (error) {
  console.log(error);
}
