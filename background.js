console.log("background.js running");

function getTabUrl(tabId, callback) {
    chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
            console.error("Error getting tab:", chrome.runtime.lastError);
            callback(null); // Return null in case of an error
        } else {
            callback(tab.url); // Return the URL via the callback
        }
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("tab updated: " + tabId);
    getTabUrl(tabId, (taburl) => {
        console.log("tab updated url: " + taburl);
        if (taburl) {
            const dmPattern = /https:\/\/www\.instagram\.com\/direct\/t\/\d+/;
            if (dmPattern.test(taburl)) {
                console.log("instagram DM opened: " + taburl);
                chrome.runtime.sendMessage({ action: "instagram DM opened" }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError);
                    } else {
                        console.log("Message sent: instagram DM opened");
                    }
                });
            }
        }
    });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log("tab activated: " + activeInfo.tabId);
    getTabUrl(activeInfo.tabId, (taburl) => {
        console.log("tab activated url: " + taburl);
        if (taburl) {
            const dmPattern = /https:\/\/www\.instagram\.com\/direct\/t\/\d+/;
            if (dmPattern.test(taburl)) {
                console.log("instagram DM opened: " + taburl);
                chrome.runtime.sendMessage({ action: "instagram DM opened" }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError);
                    } else {
                        console.log("Message sent: instagram DM opened");
                    }
                });
            }
        }
    });
});

chrome.tabs.onHighlighted.addListener((activeInfo) => {
    console.log("tab highlighted: " + activeInfo.tabId);
    getTabUrl(activeInfo.tabId, (taburl) => {
        console.log("tab highlighted url: " + taburl);
        if (taburl) {
            const dmPattern = /https:\/\/www\.instagram\.com\/direct\/t\/\d+/;
            if (dmPattern.test(taburl)) {
                console.log("instagram DM opened: " + taburl);
                chrome.runtime.sendMessage({ action: "instagram DM opened" }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError);
                    } else {
                        console.log("Message sent: instagram DM opened");
                    }
                });
            }
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log("request received: " + JSON.stringify(request));
    console.log("action received: " + request.action);
    if (request.action == "getMessage") {
        if (request.message) {
            alert("User is typing: " + request.message);
        } else {
            alert("No message found.");
        }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log("request received: " + JSON.stringify(request));
    console.log("action received: " + request.action);
    if (request.action == "instagram DM opened") {
        console.log("instagram DM opened message received!!");
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: function() {
                    // Find the Instagram message input field
                    var inputField = document.querySelector('.x3jgonx');

                    if (inputField) {
                        // Extract the text inside the input field
                        var typedMessage = inputField.innerText || inputField.value || "";
                        chrome.runtime.sendMessage({ action: "getMessage", message: typedMessage });
                    } else {
                        chrome.runtime.sendMessage({ action: "getMessage", message: null });
                    }
                }
            }).then(() => console.log("Script injected"));
        });
    }
});