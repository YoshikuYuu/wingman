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

document.addEventListener("DOMContentLoaded", function () {
    var inputField = document.getElementById("relationship_other");

    inputField.addEventListener("change", function () {
        var specification = inputField.value;

        console.log("Relationship specification: " + specification);

        // add logic to send to backend
    });

});
