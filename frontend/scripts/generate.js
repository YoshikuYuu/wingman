async function prepForRizz() {
    var generateButton = document.getElementById("generate");

    generateButton.addEventListener("click", function() {
        // hide button on click
        if (generateButton.style.display !== "none") {
            generateButton.style.display = "none";
        }
        // hide suggestion box on if visible
        if (document.getElementById("suggestion").style.display !== "none") {
            document.getElementById("suggestion").style.display = "none";
        }

        // make loading text visible
        var loadingText = document.getElementById("loading");
        loadingText.style.display = "block";

        // send relationship to backend
        var relationship = document.getElementById("relationships").value;
    }); 
}

// fetch function
async function getRizz() {
    try {
        const response = await fetch(API_URL);
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