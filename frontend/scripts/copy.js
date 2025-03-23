document.addEventListener("DOMContentLoaded", function () {
    function attachCopyListener() {
        const copyButton = document.getElementById("copyButton");
        if (copyButton) {
            copyButton.addEventListener("click", function () {
                const copyText = document.getElementById("suggestion");
                if (copyText) {
                    const textToCopy = copyText.textContent || copyText.innerText;

                        // Fallback to execCommand
                        const textArea = document.createElement("textarea");
                        textArea.value = textToCopy;
                        textArea.style.position = "fixed"; // Prevent scrolling to the bottom
                        textArea.style.opacity = "0"; // Make it invisible
                        document.body.appendChild(textArea);
                        textArea.select();
                        try {
                            const successful = document.execCommand("copy");
                            if (successful) {
                                console.log("Text copied using execCommand:", textToCopy);
                            } else {
                                console.error("execCommand failed to copy text.");
                            }
                        } catch (execErr) {
                            console.error("execCommand error:", execErr);
                        }
                        document.body.removeChild(textArea);
                  
                }
            });
        }
    }

    // Attach the listener initially
    attachCopyListener();

    // Re-attach the listener whenever the suggestion box is updated
    const suggestionBox = document.getElementById("suggestion");
    if (suggestionBox) {
        const observer = new MutationObserver(() => {
            attachCopyListener();
        });
        observer.observe(suggestionBox, { childList: true, subtree: true });
    }
});