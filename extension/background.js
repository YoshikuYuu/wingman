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

function injectFloatingIframe(tabId) {


    console.log("Injecting floating iframe.");
    
    
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function() {



            // Check if the iframe already exists
            var existingIframe = document.getElementById('floatingIframe');
            if (existingIframe) {
                console.log("Floating iframe already exists. Removing ");
                existingIframe.parentNode.removeChild(existingIframe);
                
            }

            console.log("Creating floating iframe.");
            // Create a floating iframe
            var floatingIframe = document.createElement('iframe');
            floatingIframe.id = 'floatingIframe';
            floatingIframe.style.position = 'fixed';
            floatingIframe.style.bottom = '10px';
            floatingIframe.style.right = '10px';
            floatingIframe.style.width = '300px';
            floatingIframe.style.height = '100px';
            floatingIframe.style.backgroundColor = 'white';
            floatingIframe.style.border = '1px solid black';
            floatingIframe.style.zIndex = '10000';
            floatingIframe.src = chrome.runtime.getURL('iframe.html');
            
            // print the src attribute to the iframe 
            console.log("iframe src: " + floatingIframe.src);

            document.body.appendChild(floatingIframe);
        }
    });
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "removeIframe") {
        console.log("removeIframe action received in background.js");
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            func: function() {
                var iframe = document.getElementById('floatingIframe');
                if (iframe) {
                    iframe.parentNode.removeChild(iframe);
                }
            }
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("tab updated: " + tabId);
    getTabUrl(tabId, (taburl) => {
        console.log("tab updated url: " + taburl);
        if (taburl) {
            const dmPattern = /https:\/\/www\.instagram\.com\/direct\/t\/\d+/;
            if (dmPattern.test(taburl)) {
                console.log("instagram DM opened: " + taburl);
                injectFloatingIframe(tabId);
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
                injectFloatingIframe(activeInfo.tabId);
            }
        }
    });
});

chrome.tabs.onHighlighted.addListener((highlightInfo) => {
    console.log("tab highlighted: " + highlightInfo.tabIds[0]);
    getTabUrl(highlightInfo.tabIds[0], (taburl) => {
        console.log("tab highlighted url: " + taburl);
        if (taburl) {
            const dmPattern = /https:\/\/www\.instagram\.com\/direct\/t\/\d+/;
            if (dmPattern.test(taburl)) {
                console.log("instagram DM opened: " + taburl);
                injectFloatingIframe(highlightInfo.tabIds[0]);
            }
        }
    });
});