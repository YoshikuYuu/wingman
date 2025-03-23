
document.getElementById("copyButton").addEventListener("click", function() {

    var copyText = document.getElementById("suggestion");
    var textToCopy = copyText.textContent || copyText.innerText;
  
    // Copy the text inside the text field
    navigator.clipboard.writeText(textToCopy);

  });