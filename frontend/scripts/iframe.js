document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('close').addEventListener('click', function() {
        console.log('Close button clicked');
        chrome.runtime.sendMessage({ action: "removeIframe" });
    });
});

document.getElementById('generate').addEventListener('click', function() {
    console.log('Read button clicked');
    chrome.runtime.sendMessage({ action: "readText" });
});

