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
    // Find the discord message input field
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: function() {
                // Select all chat message containers
                const messageContainers = document.querySelectorAll('li.messageListItem__5126c');
                const messages = [];
                
                var last_username = "";
                messageContainers.forEach(container => {
                    // Extract username
                    const usernameElement = container.querySelector('.username_c19a55');
                    var username = usernameElement ? usernameElement.textContent : 'Unknown';
                    if (username != 'Unknown') {
                        last_username = username;
                    } else {
                        username = last_username;
                    }

                    // Extract timestamp
                    const timestampElement = container.querySelector('.timestamp_c19a55 time');
                    const timestamp = timestampElement ? timestampElement.getAttribute('datetime') : null;

                    // Extract message content
                    const messageContentElement = container.querySelector('.markup__75297.messageContent_c19a55');
                    const messageContent = messageContentElement ? messageContentElement.textContent : null;

                    const imageContainer = container.querySelector('.loadingOverlay_af017a');
                    const imageElement = imageContainer ? imageContainer.querySelector('img') : null;
                    const imageSrc = imageElement ? imageElement.src : null;
                    // Create message object
                    const messageObject = {
                        username: username,
                        timestamp: timestamp,
                        message: messageContent,
                        imageSrc: imageSrc
                    };
                    messages.push(messageObject);
                    


                });
                // Log the messages JSON object
                 console.log(JSON.stringify(messages, null, 2));
                 

                // typing input field
                var inputField = document.querySelector('span[data-slate-string="true"]');
                console.log("inputField: " + inputField);
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