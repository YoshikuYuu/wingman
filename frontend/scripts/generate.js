async function prepForRizz() {
    var generateButton = document.getElementById("generate");

    generateButton.addEventListener("click", function () {
        // Hide button on click
        console.log("Generate button clicked.");

        if (generateButton.style.display !== "none") {
            generateButton.style.display = "none";
        }

        // Hide suggestion box if visible
        if (document.getElementById("rizzbox").style.display !== "none") {
            document.getElementById("rizzbox").style.display = "none";
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
                    const messages = { 'current_input': '', 'relationship': '', 'chat_history': [] };

                    // Typing input field
                    var inputField = document.querySelector('span[data-slate-string="true"]');
                    console.log("inputField: " + inputField);

                    var typedMessage = inputField ? inputField.innerText : '';
                    messages['current_input'] = typedMessage;
                    console.log("Current input: " + typedMessage);
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
                        console.log("Timestamp: " + timestamp);
                        // Extract message content
                        const messageContentElement = container.querySelector('.markup__75297.messageContent_c19a55');
                        const messageContent = messageContentElement ? messageContentElement.textContent : '';
                        console.log("Message content: " + messageContent);
                        const imageContainer = container.querySelector('.loadingOverlay_af017a');
                        const imageElement = imageContainer ? imageContainer.querySelector('img') : '';
                        const imageSrc = imageElement ? imageElement.src : '';
                        console.log("Image source: " + imageSrc);
                        // Create message object
                        const messageObject = {
                            username: username,
                            timestamp: timestamp,
                            message: messageContent,
                            imageSrc: imageSrc
                        };
                        messages['chat_history'].push(messageObject);
                        messages['chat_history'].push(messageObject);
                    });

                    // Add the relationship to the messages object

                    messages['relationship'] = relationship;

                    console.log("Relationship injected: " + relationship);
                    console.log("relationship in messages object: " + messages['relationship']);
                    console.log("Messages object:", JSON.stringify(messages, null, 2));

                    // Send the messages object to the backend
                    fetch("http://127.0.0.1:8000/rizzify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(messages)
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === "success") {
                                console.log(data.msg); // Show success message
                                chrome.runtime.sendMessage({
                                    action: "updateUI",
                                    status: "success",
                                    message: data.msg
                                });

                                chrome.runtime.sendMessage({
                                    action: "unhideButton",
                                    status: "success",
                                });

                            } else {
                                console.error("Error:", data.msg); // Handle error message
                                
                                chrome.runtime.sendMessage({
                                    action: "updateUI",
                                    status: "error"
                                });
                            
                            }
                        })
                        .catch(error => {
                            console.error("Error:", error);

                            chrome.runtime.sendMessage({
                                action: "updateUI",
                                status: "error"
                            });

                        });
                },
                args: [relationship]
            });
        });
    });
}

// // GET FUNCTION:
// async function getRizz() {
//     console.log("Fetching Rizz...");
//     try {
//         const response = await fetch("http://127.0.0.1:8000/rizzify");
//         const data = await response.json();
//         return data;

//     } catch (error) {
//         console.error("Current Site couldn't be fetched.", error);
//     }
// }

// parsing
// async function displayRizz() {
//     console.log("Displaying Rizz...");
//     const data = await prepForRizz();
//     console.log("Data: " + data);
//     // hide loading text
//     if (document.getElementById("loading").style.display !== "none") {
//         document.getElementById("loading").style.display = "none";
//     }

//     // change inner text in box
//     var suggestionBox = document.getElementById("suggestion");
//     suggestionBox.innerText = data;

//     // display box
//     if (suggestionBox.style.display !== "block") {
//         suggestionBox.style.display = "block";
//     }

// }

// document.addEventListener("DOMContentLoaded", function () {
//     prepForRizz();
//     displayRizz();  
// });

document.addEventListener("DOMContentLoaded", prepForRizz);

