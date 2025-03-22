// Function to send the data to Flask
function sendDataToFlask() {
    // Get the values from the input fields
    const currentMessage = document.getElementById("current_message").value;
    const meId = document.getElementById("me_id").value;

    // The history can be dynamically built, for example as an array of previous messages
    // This is just an example of how you might define the conversation history
    const history = {
        conversation: [
            "Hi, how are you?",
            "I'm doing well, thanks for asking!"
        ]
    };

    // Sending data to Flask via a POST request
    fetch('/apply_rizz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            history: history,
            current_message: currentMessage,
            me_id: meId
        })
    })
    .then(response => response.json())
    .then(data => {
        // Display the response from Flask in the response element
        document.getElementById("response").textContent = "Response from Flask: " + data.msg;
    })
    .catch(error => console.error('Error:', error));
}

function downloadImage(imageUrl) {
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'image.jpg';  // Customize the filename
            link.click();
        })
        .catch(error => console.error('Error downloading image:', error));
}