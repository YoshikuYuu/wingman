document.getElementById('closeButton').addEventListener('click', function() {
    console.log('Close button clicked');
    chrome.runtime.sendMessage({ action: "removeIframe" });
});

document.getElementById('readButton').addEventListener('click', function() {
    console.log('Read button clicked');
    chrome.runtime.sendMessage({ action: "readText" });
});