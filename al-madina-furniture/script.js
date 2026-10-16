
"use strict";

// IMPORTANT: Replace this with your shop's WhatsApp number.
// Use country code and digits only. Pakistan example: 923001234567
const WHATSAPP_NUMBER = "923001234567";

const products = [
  {
    id: 1,
    name: "Royal Comfort Sofa",
    category: "Sofas",
    price: 85000,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    name: "Modern Lounge Chair",
    category: "Sofas",
    price: 28500,
    tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    name: "Luxury King Bed",
    category: "Beds",
    price: 95000,
    tag: "PREMIUM",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    name: "Minimalist Bedside Table",
    category: "Storage",
    price: 14500,
    tag: "TIMELESS",
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    name: "Classic Dining Table",
    category: "Dining",
    price: 65000,
    tag: "FAMILY PICK",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    name: "Elegant Wooden Cabinet",
    category: "Storage",
    price: 42000,
    tag: "NEW ARRIVAL",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7,
    name: "Contemporary Accent Chair",
    category: "Sofas",
    price: 22000,
    tag: "MODERN",
    image: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8,
    name: "Wooden Platform Bed",
    category: "Beds",
    price: 78000,
    tag: "CLASSIC",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=700&q=85"
  }
];

let activeCategory = "All";
let cart = [];
let toastTimer;

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartTitleCount = document.getElementById("cartTitleCount");
const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const toast = document.getElementById("toast");

const formatPrice = (price) =>
  "Rs. " + price.toLocaleString("en-PK");

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filteredProducts.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x700/f0eee7/173b2b?text=Al+Madina+Furniture'">
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-button" data-add="${product.id}">
            + Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = filteredProducts.length > 0;
}

// Filter products by category.
document.getElementById("filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach((filter) => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

// Search products by name or category.
searchInput.addEventListener("input", renderProducts);

// Add products to the shopping cart.
productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));
});

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added to your cart`);
}

function changeQuantity(productId, amount) {
  const item = cart.find((product) => product.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function renderCart() {
  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  cartCount.textContent = totalQuantity;
  cartTitleCount.textContent = `(${totalQuantity})`;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        Your cart is empty.<br><br>
        Add some beautiful furniture to get started!
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${formatPrice(item.price * item.quantity)}</p>
        <div class="quantity-controls">
          <button data-minus="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button data-plus="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-button" data-remove="${item.id}">Remove</button>
      </div>
    </div>
  `).join("");
}

// Handle quantity and remove buttons inside the cart.
cartItems.addEventListener("click", (event) => {
  const minus = event.target.closest("[data-minus]");
  const plus = event.target.closest("[data-plus]");
  const remove = event.target.closest("[data-remove]");

  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (remove) removeFromCart(Number(remove.dataset.remove));
});

// Open and close the cart drawer.
function openCart() {
  cartPanel.classList.add("open");
  cartBackdrop.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartBackdrop.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

// Build a WhatsApp order message.
function orderOnWhatsApp() {
  if (cart.length === 0) {
    showToast("Your cart is empty. Add a product first.");
    return;
  }

  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    showToast("Please set the correct WhatsApp number in script.js");
    return;
  }

  const lines = cart.map((item) =>
    `${item.name} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const message = [
    "Assalam-o-Alaikum! I want to place an order from Al Madina Furniture.",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
    "",
    "Please confirm availability, delivery charges and delivery time."
  ].join("\n");

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
}

document.getElementById("checkoutButton").addEventListener(
  "click", orderOnWhatsApp
);

document.getElementById("contactWhatsApp").addEventListener("click", (event) => {
  event.preventDefault();

  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    showToast("Please set the correct WhatsApp number in script.js");
    return;
  }

  const message = encodeURIComponent(
    "Assalam-o-Alaikum! I would like to know more about Al Madina Furniture."
  );

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
    "_blank",
    "noopener,noreferrer"
  );
});

// Mobile navigation.
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

document.getElementById("year").textContent = new Date().getFullYear();

// Initial display.
renderProducts();
renderCart();
