document.addEventListener("DOMContentLoaded", function () {
    var selectElement = document.getElementById("relationships");
    var inputField = document.getElementById("relationship_other");

    selectElement.addEventListener("change", function () {
        if (this.value === "Other") {
            inputField.style.display = "block"; // Show input field
        } else {
            inputField.style.display = "none"; // Hide input field
        }
    });
});