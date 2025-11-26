const btn = document.getElementById("categoryBtn");
const menu = document.getElementById("dropdownMenu");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// tashqariga bosilganda yopiladi
document.addEventListener("click", (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
});


const slides = document.getElementById("slides");
const dots = document.querySelectorAll(".dot");

let index = 0;
const total = 3;

function goToSlide(i) {
  index = i;
  slides.style.transform = `translateX(-${800 * index}px)`;

  dots.forEach(d => d.classList.remove("bg-[#FA8232]"));
  dots[index].classList.add("bg-[#FA8232]");
}

dots.forEach(dot => {
  dot.addEventListener("click", () => {
    goToSlide(dot.dataset.slide);
  });
});

setInterval(() => {
  index = (index + 1) % total;
  goToSlide(index);
}, 3000);

goToSlide(0);

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
    <div
      class="product-card bg-white p-5 relative
             border-r border-b border-gray-200
             h-auto
             lg:row-span-2 lg:col-span-2
             flex flex-col
             overflow-hidden group">

        <!-- Badge'lar -->
        <div class="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span class="bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded">32% OFF</span>
          <span class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 w-11 rounded">HOT</span>
        </div>

        <!-- Tepasi: rasm + rating -->
        <div class="flex-1 flex flex-col items-center justify-center mb-4">
          <img
            src="${product.thumbnail}"
            class="w-full max-w-xs md:max-w-sm lg:max-w-md
                   h-52 md:h-64 lg:h-72
                   object-contain mb-3
                   transition-transform duration-200 group-hover:scale-105">

          <div class="flex items-center text-yellow-400 text-xs">
            <i class="fas fa-star"></i><i class="fas fa-star"></i>
            <i class="fas fa-star"></i><i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <span class="text-gray-500 ml-1.5">(${product.stock})</span>
          </div>
        </div>

        <!-- Pastki qismi: matn va tugmalar -->
        <div class="mt-auto">
          <h3 class="text-base md:text-lg text-gray-800 mb-3 leading-snug">
            ${product.title}
          </h3>

          <div class="flex items-center gap-2 mb-3">
            <span class="text-gray-400 line-through text-sm">$${product.price + 100}</span>
            <span class="text-[#2DA5F3] font-bold text-xl">$${product.price}</span>
          </div>

          <p class="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3 md:line-clamp-none">
            ${product.description}
          </p>

          <div class="flex gap-2">
            <button
              class="w-10 h-10 bg-[#FFE7D6] rounded flex items-center justify-center">
              <i class="far fa-heart text-gray-900"></i>
            </button>

            <button
              onclick="handleAddToCart(${product.id})"
              class="flex-1 bg-orange-500 text-white py-2.5 rounded hover:bg-orange-600
                     flex items-center justify-center gap-2 text-sm font-medium">
              <i class="fas fa-shopping-cart"></i> ADD TO CART
            </button>

            <button
              class="w-10 h-10 bg-[#FFE7D6] rounded flex items-center justify-center"
              onclick="handleOpenModal(${product.id})">
              <i class="far fa-eye text-gray-900"></i>
            </button>
          </div>
        </div>
    </div>`;
    }


    // ==== KICHIK CARDLAR ====
    else {
      container.innerHTML += `
        <div class="product-card bg-white p-5 relative 
                    border-r border-b border-gray-200 
                    h-auto lg:h-74">

            <div class="absolute top-3 left-3 z-10">
                <span class="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded">SOLD OUT</span>
            </div>

            <!-- Only show on desktop -->
            <div class="hover-icons hidden lg:flex">
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
                <span class="text-[#2DA5F3] font-bold text-lg">$${product.price}</span>
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



// ====== CARD 2

async function loadProduct() {
  const res = await fetch("https://dummyjson.com/products?limit=8");
  productsData = (await res.json()).products;

  renderCategories();
  renderProducts(productsData);
}

function renderCategories() {
  const filters = document.getElementById("filters");
  filters.innerHTML = "";

  const categories = ["All", ...new Set(productsData.map(p => p.category))];

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;

    btn.className = `
      relative px-3 py-3 text-[#5F6C72] text-sm font-medium cursor-pointer
      after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#FA8232]
      after:scale-x-0 after:origin-left after:transition-transform after:duration-300
      hover:text-black hover:after:scale-x-100
    `;

    btn.addEventListener("click", () =>
      cat === "All"
        ? renderProducts(productsData)
        : renderProducts(productsData.filter(p => p.category === cat))
    );

    filters.appendChild(btn);
  });
}



function renderProducts(products) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";

  products.forEach(p => {
    grid.innerHTML += `
      <div class="product-card bg-white p-5 relative border border-gray-200 h-auto lg:h-74 xl:h-78">
        <span class="absolute top-3 left-3 bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded">SOLD OUT</span>
        <div class="hover-iconss hidden lg:flex">
          <div class="hover-icon-btnn" onclick="handleAddToCart(${p.id})"><i class="fas fa-shopping-cart text-gray-700"></i></div>
          <div class="hover-icon-btnn"><i class="far fa-heart text-gray-700"></i></div>
          <div class="hover-icon-btnn" onclick="handleOpenModal(${p.id})"><i class="far fa-eye text-gray-700"></i></div>
        </div>
        <img src="${p.thumbnail}" class="w-full h-48 object-contain mb-0">
        <h3 class="text-sm text-gray-800 mb-2">${p.title}</h3>
        <span class="text-[#2DA5F3] font-bold text-lg">$${p.price}</span>
      </div>`;
  });
}

loadProduct();
updateCartCount();




// ====== CARD 3

async function loadsProducts() {
  const res = await fetch("https://dummyjson.com/products?limit=8");
  productsData = (await res.json()).products;

  renderCategory();
  renderProductss(productsData);
}

function renderCategory() {
  const filter = document.getElementById("filter");
  filter.innerHTML = "";

  const categories = ["All", ...new Set(productsData.map(p => p.category))];

  categories.forEach(cat => {
    const btns = document.createElement("button");
    btns.textContent = cat;

    btns.className = `
      relative px-3 py-3 text-[#5F6C72] text-sm font-medium cursor-pointer
      after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#FA8232]
      after:scale-x-0 after:origin-left after:transition-transform after:duration-300
      hover:text-black hover:after:scale-x-100
    `;

    btns.addEventListener("click", () =>
      cat === "All"
        ? renderProductss(productsData)
        : renderProductss(productsData.filter(p => p.category === cat))
    );

    filter.appendChild(btns);
  });
}



function renderProductss(products) {
  const grides = document.getElementById("products-grid-card");
  grides.innerHTML = "";

  products.forEach(p => {
    grides.innerHTML += `
      <div class="product-card bg-white p-5 relative border border-gray-200 h-auto lg:h-74 xl:h-78">
        <span class="absolute top-3 left-3 bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded">SOLD OUT</span>
        <div class="hover-iconss hidden lg:flex">
          <div class="hover-icon-btnn" onclick="handleAddToCart(${p.id})"><i class="fas fa-shopping-cart text-gray-700"></i></div>
          <div class="hover-icon-btnn"><i class="far fa-heart text-gray-700"></i></div>
          <div class="hover-icon-btnn" onclick="handleOpenModal(${p.id})"><i class="far fa-eye text-gray-700"></i></div>
        </div>
        <img src="${p.thumbnail}" class="w-full h-48 object-contain mb-0">
        <h3 class="text-sm text-gray-800 mb-2">${p.title}</h3>
        <span class="text-[#2DA5F3] font-bold text-lg">$${p.price}</span>
      </div>`;
  });
}

loadsProducts();
updateCartCount();


const BOT_TOKEN = "8428968887:AAEfeWY4MqPSJ8PK59HmNEAw1_A9dCSNnkc";
const CHAT_ID = "6266620902";

function sendTelegram() {
  const text = document.getElementById("msg").value;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Xabar yuborildi!");
    })
    .catch(err => {
      alert("Xatolik: " + err);
    });
}

const readmore = document.getElementById('readmore')
const modal1 = document.getElementById('modal1')

readmore.addEventListener('click', () => {
  modal1.classList.remove("hidden");
  modal1.classList.add("flex");
})

function closeModal1() {
  modal1.classList.add("hidden");
  modal1.classList.remove("flex");
}

const readmore2 = document.getElementById('readmore2')
const modal2 = document.getElementById('modal2')

readmore2.addEventListener('click', () => {

  modal2.classList.remove("hidden");
  modal2.classList.add("flex");
})

function closeModal2() {
  modal2.classList.add("hidden");
  modal2.classList.remove("flex");
}

const readmore3 = document.getElementById('readmore3')
const modal3 = document.getElementById('modal3')

readmore3.addEventListener('click', () => {

  modal3.classList.remove("hidden");
  modal3.classList.add("flex");
})

function closeModal3() {
  modal3.classList.add("hidden");
  modal3.classList.remove("flex");
}
