const endTime = new Date().getTime()
  + (16 * 24 * 60 * 60 * 1000)
  + (21 * 60 * 60 * 1000)
  + (57 * 60 * 1000)
  + (23 * 1000);

function updateCountdown() {
  const now = new Date().getTime();
  const distance = endTime - now;

  if (distance <= 0) {
    document.getElementById('countdown').innerHTML = "EXPIRED";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('countdown').innerHTML =
    `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ======== PRODUCTLAR ========

let productsData = []; // API dan kelgan productlar shu yerda saqlanadi

async function loadProducts() {
  const res = await fetch("https://dummyjson.com/products?limit=9");
  const data = await res.json();

  productsData = data.products; // global massivga yozdik

  const container = document.getElementById("product-grid");
  container.innerHTML = "";

  data.products.forEach((product, index) => {

    // ==== KATTA CARD ====
    if (index === 0) {
      container.innerHTML += `
        <div class="product-card bg-white p-5 relative row-span-2 border-r border-b border-gray-200 h-148">

          <div class="absolute top-3 left-3 flex flex-col gap-1 z-10">
              <span class="bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded">32% OFF</span>
              <span class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">HOT</span>
          </div>

          <img src="${product.thumbnail}" class="w-full h-68 object-contain mb-4">

          <div class="flex text-yellow-400 text-xs mb-2">
              <i class="fas fa-star"></i><i class="fas fa-star"></i>
              <i class="fas fa-star"></i><i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <span class="text-gray-500 ml-1.5">(${product.stock})</span>
          </div>

          <h3 class="text-sm text-gray-800 mb-4 leading-tight">${product.title}</h3>

          <div class="flex items-center gap-2 mb-4">
              <span class="text-gray-400 line-through text-sm">$${product.price + 100}</span>
              <span class="text-blue-600 font-bold text-xl">$${product.price}</span>
          </div>

          <p class="text-sm text-gray-500 mb-6 leading-relaxed">
              ${product.description}
          </p>

          <div class="flex gap-2">
              <button class="w-10 h-10 bg-[#FFE7D6] rounded flex items-center justify-center">
                  <i class="far fa-heart text-gray-900"></i>
              </button>

              <button onclick="handleAddToCart(${product.id})"
                  class="flex-1 bg-orange-500 text-white py-2.5 rounded hover:bg-orange-600 
                         flex items-center justify-center gap-2 text-sm font-medium">
                  <i class="fas fa-shopping-cart"></i> ADD TO CART
              </button>

              <button class="w-10 h-10 bg-[#FFE7D6] rounded flex items-center justify-center"
                      onclick="handleOpenModal(${product.id})">
                  <i class="far fa-eye text-gray-900"></i>
              </button>
          </div>
        </div>`;
    }

    // ==== KICHIK CARDLAR ====
    else {
      container.innerHTML += `
        <div class="product-card bg-white p-5 relative border-r border-b border-gray-200 h-74">

            <div class="absolute top-3 left-3 z-10">
                <span class="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded">SOLD OUT</span>
            </div>

            <div class="hover-icons">
                <div class="hover-icon-btn" onclick="handleAddToCart(${product.id})">
                    <i class="fas fa-shopping-cart text-gray-700"></i>
                </div>
                <div class="hover-icon-btn">
                    <i class="far fa-heart text-gray-700"></i>
                </div>
                <div class="hover-icon-btn" onclick="handleOpenModal(${product.id})">
                    <i class="far fa-eye text-gray-700"></i>
                </div>
            </div>

            <img src="${product.thumbnail}" class="w-full h-48 object-contain mb-0">

            <h3 class="text-sm text-gray-800 mb-2 leading-tight">${product.title}</h3>

            <div class="flex items-center gap-2">
                <span class="text-blue-600 font-bold text-lg">$${product.price}</span>
            </div>
        </div>`;
    }

  });
}

loadProducts();
updateCartCount();


// ======== MODAL LOGIKASI ========

let currentProductImages = [];
let currentImageIndex = 0;
let currentProduct = null;

function getProductById(id) {
  return productsData.find(p => p.id === id);
}

// carddan chaqiriladigan handlerlar:
function handleAddToCart(id) {
  const product = getProductById(id);
  if (!product) return;

  // oddiy carddan kelsa, quantity = 1
  addToCart({ ...product, quantity: 1 });
}

function handleOpenModal(id) {
  const product = getProductById(id);
  if (!product) return;
  openProductModal(product);
}

function openProductModal(product) {
  currentProduct = product;
  currentProductImages = product.images && product.images.length ? product.images : [product.thumbnail];
  currentImageIndex = 0;

  const modal = document.getElementById("product-modal");

  // elementlar
  const mainImg = document.getElementById("modal-main-image");
  const thumbsWrapper = document.getElementById("modal-thumbs");
  const titleEl = document.getElementById("modal-title");
  const brandEl = document.getElementById("modal-brand");
  const priceEl = document.getElementById("modal-price");
  const oldPriceEl = document.getElementById("modal-old-price");
  const discountEl = document.getElementById("modal-discount");
  const stockEl = document.getElementById("modal-stock");
  const categoryEl = document.getElementById("modal-category");
  const descEl = document.getElementById("modal-description");
  const ratingStarsEl = document.getElementById("modal-rating-stars");
  const ratingTextEl = document.getElementById("modal-rating-text");
  const qtyInput = document.getElementById("modal-qty");
  const addCartBtn = document.getElementById("modal-add-cart-btn");

  // asosiy rasm
  mainImg.src = currentProductImages[0];

  // thumbnail lar
  thumbsWrapper.innerHTML = "";
  currentProductImages.forEach((imgUrl, idx) => {
    const thumb = document.createElement("button");
    thumb.className =
      "border rounded-md w-16 h-16 flex items-center justify-center shrink-0 " +
      (idx === 0 ? "border-orange-500" : "border-gray-200");
    thumb.innerHTML = `<img src="${imgUrl}" class="max-h-12 object-contain">`;
    thumb.onclick = () => {
      currentImageIndex = idx;
      mainImg.src = imgUrl;

      // border ni yangilash
      [...thumbsWrapper.children].forEach((ch, i) => {
        ch.classList.remove("border-orange-500");
        ch.classList.add("border-gray-200");
        if (i === idx) {
          ch.classList.remove("border-gray-200");
          ch.classList.add("border-orange-500");
        }
      });
    };
    thumbsWrapper.appendChild(thumb);
  });

  // matnlar
  titleEl.textContent = product.title;
  brandEl.textContent = product.brand ? `Brand: ${product.brand}` : "";
  priceEl.textContent = `$${product.price}`;
  oldPriceEl.textContent = `$${product.price + 100}`;
  discountEl.textContent = product.discountPercentage
    ? `${Math.round(product.discountPercentage)}% OFF`
    : "";

  stockEl.textContent = product.stock > 0 ? "In Stock" : "Out of Stock";
  categoryEl.textContent = product.category || "";
  descEl.textContent = product.description;

  // reyting
  ratingStarsEl.innerHTML = "";
  const fullStars = Math.round(product.rating || 0);
  for (let i = 0; i < 5; i++) {
    ratingStarsEl.innerHTML +=
      i < fullStars ? `<i class="fas fa-star"></i>` : `<i class="far fa-star"></i>`;
  }
  ratingTextEl.textContent = `${product.rating?.toFixed(1) || "0.0"} Star Rating`;

  // quantity default 1
  qtyInput.value = "1";

  // qty +/-
  document.getElementById("qty-plus").onclick = () => {
    let val = parseInt(qtyInput.value || "1", 10);
    qtyInput.value = val + 1;
  };
  document.getElementById("qty-minus").onclick = () => {
    let val = parseInt(qtyInput.value || "1", 10);
    if (val > 1) qtyInput.value = val - 1;
  };

  // add to cart (modal ichidan)
  addCartBtn.onclick = () => {
    const qty = parseInt(qtyInput.value || "1", 10);
    const prodWithQty = { ...product, quantity: qty };
    addToCart(prodWithQty);
    closeProductModal();
  };

  // next/prev thumbnails
  document.getElementById("thumb-next").onclick = () => {
    if (!currentProductImages.length) return;
    currentImageIndex = (currentImageIndex + 1) % currentProductImages.length;
    mainImg.src = currentProductImages[currentImageIndex];
    thumbsWrapper.children[currentImageIndex].click();
  };

  document.getElementById("thumb-prev").onclick = () => {
    if (!currentProductImages.length) return;
    currentImageIndex =
      (currentImageIndex - 1 + currentProductImages.length) % currentProductImages.length;
    mainImg.src = currentProductImages[currentImageIndex];
    thumbsWrapper.children[currentImageIndex].click();
  };

  // modalni ko‘rsatish
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// fonni bosganda yopish
document.addEventListener("click", function (e) {
  const modal = document.getElementById("product-modal");
  if (!modal) return;
  if (!modal.classList.contains("hidden") && e.target === modal) {
    closeProductModal();
  }
});


// ======== LOCAL STORAGE SAVATCHA ========

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const el = document.getElementById("cart-count");
  if (el) el.innerText = totalQty;
}


// ======== MAHSULOTNI SAVATCHAGA QO‘SHISH ========

function addToCart(product) {
  const cart = getCart();

  const addQty = product.quantity ? Number(product.quantity) : 1;

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += addQty;
  } else {
    cart.push({
      ...product,
      quantity: addQty
    });
  }

  saveCart(cart);
  updateCartCount();
}


// ======== NAVBARDAGI SAVATCHAGA O‘TISH ========

const shopBtn = document.getElementById("shop");
if (shopBtn) {
  shopBtn.onclick = () => {
    window.location.href = "cart.html";
  };
}


// ======== SLIDER (agar bo‘lsa) ========

const slider = document.getElementById("slider");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if (slider && prevBtn && nextBtn) {
  prevBtn.onclick = () => {
    slider.style.animationPlayState = "paused";
    slider.scrollLeft -= 300;
    setTimeout(() => slider.style.animationPlayState = "running", 300);
  };

  nextBtn.onclick = () => {
    slider.style.animationPlayState = "paused";
    slider.scrollLeft += 300;
    setTimeout(() => slider.style.animationPlayState = "running", 300);
  };
}