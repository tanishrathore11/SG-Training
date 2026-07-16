// =======================
// DOM Elements
// =======================
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const selectCategory = document.getElementById("category");
const formTitle = document.getElementById("formTitle");
const categoryLabel = document.getElementById("categoryLabel");
const submitForm = document.getElementById("submitForm");
const deleteCacheBtn = document.getElementById("deleteCacheBtn");
const productCount = document.getElementById("product-count");
const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const skuInput = document.getElementById("sku");


// =======================
// State
// =======================
let isAddMode = true;
let products = [];
let editingProductId = null;

// =======================
// Event Listeners
// =======================
category.addEventListener("change", (e)=>{
    const selectedProductId = Number(e.target.value);
    editingProductId = selectedProductId;
    const selectedProduct = products.find(product => product.id == selectedProductId);
    updateButtons(selectedProduct);
})

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
        if(!titleInput.value || !priceInput.value || !stockInput.value || !skuInput.value) {
            alert("Please fill in all fields before adding a product.");
            return;
        }
        const newId = products.length > 0
            ? Math.max(...products.map(product => product.id)) + 1
            : 1;
        const newProduct = {
            id: newId,
            title: titleInput.value,
            price: priceInput.value,
            stock: stockInput.value,
            sku: skuInput.value
        };
        if(products.find(product => product.sku === skuInput.value)) {
            alert("Product with this SKU already exists.");
            return;
        }
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
        clearForm();

        alert("Product added successfully!");

    } else {
        if(!titleInput.value || !priceInput.value || !stockInput.value || !skuInput.value) {
            alert("Please fill in all fields before updating a product.");
            return;
        }
        // console.log("Updating existing product...");
        const selectedProductId = selectCategory.value;
        if(products.find(product => product.sku === skuInput.value && product.id !== editingProductId)) {
            alert("Product with this SKU already exists.");
            return;
        }
        products = products.map(product => {
            if (product.id == selectedProductId) {
                return {
                    ...product,
                    title: titleInput.value,
                    price: priceInput.value,
                    stock: stockInput.value,
                    sku: skuInput.value
                };
            }
            return product;
        });
        if(category.value === "") {
            alert("Please select a product to update.");
            return;
        }
        clearForm();
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
        alert("Product updated successfully!");
    }
});

// =======================
// Helper Functions
// =======================
const clearForm = () => {
    titleInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
    skuInput.value = "";
    selectCategory.value = "";
}

function updateButtons(product) {
    if (isAddMode) {
        clearForm();
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
        if(product) {
            selectCategory.value = product.id;
            titleInput.value = product.title;
            priceInput.value = product.price;
            stockInput.value = product.stock;
            skuInput.value = product.sku;
        }else{
            clearForm();
        }
    }
    
}

const showSkeleton = () => {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    for (let i = 0; i < 10; i++) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
        `;

        tbody.appendChild(row);
    }
};


// =======================
// Functions
// =======================

const fetchProducts = async () => {
    try {
        const savedData = localStorage.getItem("products");

        if (savedData) {
            products = JSON.parse(savedData);
            // console.log("Products fetched from localStorage:", products.length);
            if (products.length > 0) {
                renderProducts();
                return;
            }
        }

        showSkeleton();
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await fetch("https://dummyjson.com/products?limit=10&select=title,price,sku,stock");
        const data = await response.json();
        // console.log(data.products);
        products = data.products;
        localStorage.setItem("products", JSON.stringify(products));
        
        renderProducts();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

const renderProducts = () => {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";
    selectCategory.innerHTML = `<option value="">Select Product</option>`;
    
    productCount.textContent = `${products.length} Items`;
    for (const product of products) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.sku}</td>
            <td>
                <button id="updateBtn-${product.id}"> <i data-lucide="pencil"></i> </button>
                <button id="deleteBtn-${product.id}"> <i data-lucide="trash-2"></i> </button>
            </td>
        `;
        const updateBtn = row.querySelector(`#updateBtn-${product.id}`);
        const deleteBtn = row.querySelector(`#deleteBtn-${product.id}`);

        updateBtn.addEventListener("click", () => {
            isAddMode = false;
            editingProductId = product.id;
            updateButtons(product);

            // console.log(`Updating product with ID: ${product.sku}`);
            
        })
        deleteBtn.addEventListener("click", () => {
            products = products.filter(p => p.id !== product.id);
            localStorage.setItem("products", JSON.stringify(products));
            renderProducts();
        })
        // console.log("Products------>", products);
        document.querySelector("table tbody").appendChild(row);
        category.innerHTML += `<option value="${product.id}">${product.title}</option>`;
    }
    lucide.createIcons();
}

const deleteCache = (e) => {
    e.preventDefault();
    localStorage.removeItem("products");
    products = [];
    document.querySelector("table tbody").innerHTML = "";
}
deleteCacheBtn.addEventListener("click", deleteCache);


// =======================
// Function calls
// =======================
updateButtons();
lucide.createIcons();
fetchProducts();
// renderProducts();