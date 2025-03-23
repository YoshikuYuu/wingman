console.log("window.js loaded");

chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log("request received: " + JSON.stringify(request));
    console.log("action received: " + request.action);
    if (request.action == "getMessage") {
        const typedMessageDiv = document.getElementById("typedMessage");
        if (request.message) {
            console.log("User is typing request: " + request.message);
            typedMessageDiv.textContent = "User is typing: " + request.message;
        } else {
            console.log("No message found.");
            typedMessageDiv.textContent = "No message found.";
        }
    } 
});

document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.getElementById('closeButton');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            console.log("Close button clicked message received in window.js.");
            chrome.runtime.sendMessage({ action: "removeIframe" });
        });
    }

    const readButton = document.getElementById('readButton');
    if (readButton) {
        readButton.addEventListener('click', function() {
            console.log("Read button clicked message received in window.js.");
            readTextField();
        });
    }
});

function readTextField() {
    // Find the Instagram message input field
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: function() {
                        var inputField = document.querySelector('.x3jgonx');

                        if (inputField) {
                            // Extract the text inside the input field
                            var typedMessage = inputField.innerText || inputField.value || "";
                            chrome.runtime.sendMessage({ action: "getMessage", message: typedMessage });
                        } else {
                            chrome.runtime.sendMessage({ action: "getMessage", message: null });
                        }
                }  
            });
    });

}