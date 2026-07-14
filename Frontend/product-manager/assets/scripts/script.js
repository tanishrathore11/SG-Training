const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const selectCategory = document.getElementById("category");
const formTitle = document.getElementById("formTitle");
const categoryLabel = document.getElementById("categoryLabel");
const submitForm = document.getElementById("submitForm");

let isAddMode = true;

function updateButtons() {
    if (isAddMode) {
        addBtn.classList.add("active");
        updateBtn.classList.remove("active");
        selectCategory.style.display = "none";
        formTitle.textContent = "Add New Product";
        categoryLabel.style.display = "none";
        submitForm.textContent = "Add Product";
    } else {
        updateBtn.classList.add("active");
        addBtn.classList.remove("active");
        selectCategory.style.display = "block";
        formTitle.textContent = "Update Product";
        categoryLabel.style.display = "block";
        submitForm.textContent = "Update Product";
    }
}
updateButtons();

addBtn.addEventListener("click", () => {
    isAddMode = true;
    updateButtons();
});

updateBtn.addEventListener("click", () => {
    isAddMode = false;
    updateButtons();
});

submitForm.addEventListener("click", (event) => {
    event.preventDefault();
    if (isAddMode) {
        console.log("Adding new product...");
        // Add product logic here
    } else {
        console.log("Updating existing product...");
        // Update product logic here
    }
});