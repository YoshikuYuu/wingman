async function prepForRizz() {
    var generateButton = document.getElementById("generate");

    generateButton.addEventListener("click", function () {
        // Hide button on click
        console.log("Generate button clicked.");

        if (generateButton.style.display !== "none") {
            generateButton.style.display = "none";
        }

        // Hide suggestion box if visible
        if (document.getElementById("suggestion").style.display !== "none") {
            document.getElementById("suggestion").style.display = "none";
        }

        // Make loading text visible
        var loadingText = document.getElementById("loading");
        loadingText.style.display = "block";

        // Get the relationship value
        var relationship = document.getElementById("relationships").value;

        console.log("Relationship: " + relationship);

        // Pass the relationship value to the injected script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: function (relationship) {

                    // Select all chat message containers
                    const messageContainers = document.querySelectorAll('li.messageListItem__5126c');
                    const messages = { 'current-input': '', 'relationship': '', 'chat-history': [] };

                    // Typing input field
                    var inputField = document.querySelector('span[data-slate-string="true"]');
                    console.log("inputField: " + inputField);

                    var typedMessage = inputField ? inputField.innerText : '';
                    messages['current-input'] = typedMessage;

                    // Process chat history
                    var last_username = "";
                    messageContainers.forEach(container => {
                        // Extract username
                        const usernameElement = container.querySelector('.username_c19a55');
                        var username = usernameElement ? usernameElement.textContent : 'Unknown';
                        if (username !== 'Unknown') {
                            last_username = username;
                        } else {
                            username = last_username;
                        }

                        // Extract timestamp
                        const timestampElement = container.querySelector('.timestamp_c19a55 time');
                        const timestamp = timestampElement ? timestampElement.getAttribute('datetime') : '';

                        // Extract message content
                        const messageContentElement = container.querySelector('.markup__75297.messageContent_c19a55');
                        const messageContent = messageContentElement ? messageContentElement.textContent : '';

                        const imageContainer = container.querySelector('.loadingOverlay_af017a');
                        const imageElement = imageContainer ? imageContainer.querySelector('img') : '';
                        const imageSrc = imageElement ? imageElement.src : '';

                        // Create message object
                        const messageObject = {
                            username: username,
                            timestamp: timestamp,
                            message: messageContent,
                            imageSrc: imageSrc
                        };
                        messages['chat-history'].push(messageObject);
                    });

                    // Add the relationship to the messages object
                    console.log("Relationship injected: " + relationship);
                    messages['relationship'] = relationship;
                    console.log("relationship in messages object: " + messages['relationship']);
                    console.log("Messages object:", JSON.stringify(messages, null, 2));

                    // Send the messages object to the backend
                    fetch("http://127.0.0.1:5000/rizzify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(messages)
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === "success") {
                                console.log(data.message); // Show success message
                            } else {
                                console.error("Error:", data.message); // Handle error message
                            }
                        })
                        .catch(error => {
                            console.error("Error:", error);
                        });
                },
                args: [relationship]
            });
        });
    });
}

// GET FUNCTION:
async function getRizz() {
    try {
        const response = await fetch();
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Current Site couldn't be fetched.", error);
    }
}

// parsing
async function displayRizz() {
    const data = await getRizz();

    // hide loading text
    if (document.getElementById("loading").style.display !== "none") {
        document.getElementById("loading").style.display = "none";
    }

    // change inner text in box
    var suggestionBox = document.getElementById("suggestion");
    suggestionBox.innerText = data;

    // display box
    if (suggestionBox.style.display !== "block") {
        suggestionBox.style.display = "block";
    }

}

document.addEventListener("DOMContentLoaded", prepForRizz);