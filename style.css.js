
"use strict";

// ==========================================
// 1. PERSONAL PORTFOLIO
// ==========================================

// Automatically show the current year in the footer.
document.getElementById("current-year").textContent =
  new Date().getFullYear();


// ==========================================
// 2. TO-DO LIST WITH LOCAL STORAGE
// ==========================================

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoEmpty = document.getElementById("todo-empty");
const todoStatus = document.getElementById("todo-status");

const STORAGE_KEY = "apexplanet-task4-todos";

let todos = [];

function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);

    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);

      if (Array.isArray(parsedTodos)) {
        todos = parsedTodos.filter((todo) =>
          todo &&
          typeof todo.id === "string" &&
          typeof todo.text === "string" &&
          typeof todo.completed === "boolean"
        );
      }
    }
  } catch (error) {
    todoStatus.textContent =
      "Saved tasks could not be loaded. You can still add tasks.";
  }

  renderTodos();
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    todoStatus.textContent = "Tasks saved in this browser.";
  } catch (error) {
    todoStatus.textContent =
      "Could not save tasks. Check your browser storage settings.";
  }
}

function renderTodos() {
  todoList.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item";

    if (todo.completed) {
      item.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", "Mark task complete");
    checkbox.dataset.id = todo.id;

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.id = todo.id;
    deleteButton.setAttribute("aria-label", "Delete " + todo.text);

    item.append(checkbox, text, deleteButton);
    todoList.appendChild(item);
  });

  todoEmpty.hidden = todos.length > 0;
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = todoInput.value.trim();

  if (!taskText) {
    todoStatus.textContent = "Please enter a task.";
    return;
  }

  const newTodo = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString() + Math.random().toString(16).slice(2),
    text: taskText,
    completed: false
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();

  todoInput.value = "";
  todoInput.focus();
});

todoList.addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") {
    return;
  }

  const todo = todos.find(
    (item) => item.id === event.target.dataset.id
  );

  if (todo) {
    todo.completed = event.target.checked;
    saveTodos();
    renderTodos();
  }
});

todoList.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-btn");

  if (!button) {
    return;
  }

  todos = todos.filter(
    (todo) => todo.id !== button.dataset.id
  );

  saveTodos();
  renderTodos();
});

loadTodos();


// ==========================================
// 3. PRODUCT LISTING WITH FILTERS AND SORTING
// ==========================================

// Sample products for this project.
// Prices and ratings are demonstration data.

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1499,
    rating: 4.7,
    icon: "🎧"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 2499,
    rating: 4.5,
    icon: "⌚"
  },
  {
    id: 3,
    name: "Laptop Stand",
    category: "Accessories",
    price: 799,
    rating: 4.3,
    icon: "💻"
  },
  {
    id: 4,
    name: "Wireless Mouse",
    category: "Accessories",
    price: 599,
    rating: 4.6,
    icon: "🖱️"
  },
  {
    id: 5,
    name: "JavaScript Guide",
    category: "Books",
    price: 499,
    rating: 4.8,
    icon: "📘"
  },
  {
    id: 6,
    name: "Data Science Basics",
    category: "Books",
    price: 699,
    rating: 4.4,
    icon: "📚"
  },
  {
    id: 7,
    name: "Desk Lamp",
    category: "Home",
    price: 899,
    rating: 4.2,
    icon: "💡"
  },
  {
    id: 8,
    name: "Water Bottle",
    category: "Home",
    price: 299,
    rating: 4.1,
    icon: "🧴"
  },
  {
    id: 9,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 1199,
    rating: 4.9,
    icon: "🔊"
  }
];

const categoryFilter = document.getElementById("category-filter");
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const sortFilter = document.getElementById("sort-filter");
const resetButton = document.getElementById("reset-filters");
const productList = document.getElementById("product-list");
const productStatus = document.getElementById("product-status");

function renderProducts() {
  const minText = minPriceInput.value.trim();
  const maxText = maxPriceInput.value.trim();

  const minPrice = minText === "" ? 0 : Number(minText);
  const maxPrice = maxText === "" ? Infinity : Number(maxText);

  if (
    (minText !== "" && (!Number.isFinite(minPrice) || minPrice < 0)) ||
    (maxText !== "" && (!Number.isFinite(maxPrice) || maxPrice < 0))
  ) {
    productList.replaceChildren();
    productStatus.textContent =
      "Enter valid non-negative prices.";
    return;
  }

  if (minPrice > maxPrice) {
    productList.replaceChildren();
    productStatus.textContent =
      "Minimum price cannot be greater than maximum price.";
    return;
  }

  let filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryFilter.value === "all" ||
      product.category === categoryFilter.value;

    const matchesPrice =
      product.price >= minPrice &&
      product.price <= maxPrice;

    return matchesCategory && matchesPrice;
  });

  // Sort the filtered results.
  switch (sortFilter.value) {
    case "rating-high":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;

    case "rating-low":
      filteredProducts.sort((a, b) => a.rating - b.rating);
      break;

    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
  }

  productList.replaceChildren();

  if (filteredProducts.length === 0) {
    const message = document.createElement("p");
    message.className = "no-products";
    message.textContent = "No products match your filters.";
    productList.appendChild(message);
  } else {
    filteredProducts.forEach((product) => {
      const card = document.createElement("article");
      card.className = "card product-card";

      const visual = document.createElement("div");
      visual.className = "product-visual";
      visual.setAttribute("aria-hidden", "true");
      visual.textContent = product.icon;

      const category = document.createElement("p");
      category.className = "product-category";
      category.textContent = product.category;

      const name = document.createElement("h3");
      name.textContent = product.name;

      const price = document.createElement("p");
      price.className = "product-price";
      price.textContent = "₹" + product.price.toLocaleString("en-IN");

      const rating = document.createElement("p");
      rating.className = "product-rating";
      rating.textContent = "★ " + product.rating.toFixed(1) + " / 5";

      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = "Sample product";

      card.append(visual, category, name, price, rating, tag);
      productList.appendChild(card);
    });
  }

  productStatus.textContent =
    "Showing " + filteredProducts.length + " of " +
    products.length + " products.";
}

// Update results whenever the user changes a filter.
categoryFilter.addEventListener("change", renderProducts);
minPriceInput.addEventListener("input", renderProducts);
maxPriceInput.addEventListener("input", renderProducts);
sortFilter.addEventListener("change", renderProducts);

// Restore the default filters.
resetButton.addEventListener("click", () => {
  categoryFilter.value = "all";
  minPriceInput.value = "";
  maxPriceInput.value = "";
  sortFilter.value = "default";
  renderProducts();
});

// Display products when the page first opens.
renderProducts();
