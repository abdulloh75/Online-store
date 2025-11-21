const endTime = new Date().getTime() + (16 * 24 * 60 * 60 * 1000) + (21 * 60 * 60 * 1000) + (57 * 60 * 1000) + (23 * 1000);

function updateCountdown() {
  const now = new Date().getTime();
  const distance = endTime - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('countdown').innerHTML =
    `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;

  if (distance < 0) {
    document.getElementById('countdown').innerHTML = "EXPIRED";
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

async function loadProducts() {
  const res = await fetch("https://dummyjson.com/products?limit=9");
  const data = await res.json();

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

                    <button onclick='addToCart(${JSON.stringify(product)})'
                        class="flex-1 bg-orange-500 text-white py-2.5 rounded hover:bg-orange-600 
                               flex items-center justify-center gap-2 text-sm font-medium">
                        <i class="fas fa-shopping-cart"></i> ADD TO CARD
                    </button>

                    <button class="w-10 h-10 bg-[#FFE7D6] rounded flex items-center justify-center">
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
                    <div class="hover-icon-btn" onclick='addToCart(${JSON.stringify(product)})'>
                        <i class="fas fa-shopping-cart text-gray-700"></i>
                    </div>
                    <div class="hover-icon-btn">
                        <i class="far fa-heart text-gray-700"></i>
                    </div>
                    <div class="hover-icon-btn">
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




// ======== LOCAL STORAGE SAVATCHA ========

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  document.getElementById("cart-count").innerText = cart.length;
}

// ======== MAHSULOTNI SAVATCHAGA QO‘SHISH ========

function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
  updateCartCount();
}

// ======== NAVBARDAGI SAVATCHAGA O‘TISH ========

document.getElementById("shop").onclick = () => {
  window.location.href = "cart.html";
};
