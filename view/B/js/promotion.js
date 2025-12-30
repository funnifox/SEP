let currentSlide = 0;
let carouselTimer = null;

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadPromotionProducts();
});

/* ---------- FILTER TOGGLE ---------- */
function toggleFilters() {
  const content = document.getElementById('filterContent');
  const arrow = document.getElementById('filterArrow');
  content.classList.toggle('open');
  arrow.textContent = content.classList.contains('open') ? '▲' : '▼';
}

/* ---------- LOAD FROM BACKEND ---------- */
async function loadPromotionProducts(filters = {}) {
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();

    params.append('countryId', filters.countryId || 25);
    if (filters.category) params.append('category', filters.category);
    if (filters.minDiscount) params.append('minDiscount', filters.minDiscount);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);

    const res = await fetch(`/api/getPromotionProducts?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('API Error');

    const products = await res.json();
    renderCarousel(products);
    renderProducts(products);

  } catch (err) {
    console.error(err);
    document.getElementById('productsGrid').innerHTML =
      `<p>Failed to load promotions.</p>`;
  }
}

/* ---------- APPLY / CLEAR FILTERS ---------- */
function applyFilters() {
  loadPromotionProducts({
    category: categoryFilter.value,
    minDiscount: minDiscountFilter.value,
    maxPrice: maxPriceFilter.value,
    sort: sortFilter.value
  });
}

function clearFilters() {
  categoryFilter.value = '';
  minDiscountFilter.value = '';
  maxPriceFilter.value = '';
  sortFilter.value = 'discount';
  loadPromotionProducts();
}

/* ---------- PRODUCTS GRID ---------- */
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  const count = document.getElementById('productCount');

  count.textContent = `Showing ${products.length} products`;

  grid.innerHTML = products.map(p => {
    const discount = Math.round(p.discountRate * 100);

    return `
      <div class="product-card">
        <div class="product-image" style="background-image:url('${p.imageURL}')">
          <div class="discount-badge">${discount}% OFF</div>
        </div>
        <div class="product-content">
          <div class="product-category">${p.category}</div>
          <h3>${p.name}</h3>
          <div class="product-prices">
            <span class="product-current">$${p.discountedPrice.toFixed(0)}</span>
            <span class="product-original">$${p.price}</span>
          </div>
          <button class="product-btn"
            onclick="location.href='productDetail.html?id=${p.id}'">
            Shop Now
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/* ---------- CAROUSEL ---------- */
function renderCarousel(products) {
  const hotDeals = products.filter(p => p.discountRate >= 0.3).slice(0, 4);
  const track = document.getElementById('carouselTrack');
  const dots = document.getElementById('carouselDots');

  currentSlide = 0;
  if (carouselTimer) clearInterval(carouselTimer);

  track.innerHTML = hotDeals.map(p => {
    const discount = Math.round(p.discountRate * 100);

    return `
      <div class="carousel-slide">
        <div class="carousel-card">
          <div class="carousel-image" style="background-image:url('${p.imageURL}')">
            <div class="carousel-badge">${discount}% OFF</div>
          </div>
          <div class="carousel-info">
            <h3>${p.name}</h3>
            <div class="carousel-prices">
              <span class="current-price">$${p.discountedPrice.toFixed(0)}</span>
              <span class="original-price">$${p.price}</span>
            </div>
            <button class="carousel-btn"
              onclick="location.href='productDetail.html?id=${p.id}'">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  dots.innerHTML = hotDeals.map((_, i) =>
    `<button class="carousel-dot ${i === 0 ? 'active' : ''}"
      onclick="goToSlide(${i})"></button>`
  ).join('');

  carouselTimer = setInterval(nextSlide, 5000);
}

function updateCarousel() {
  document.getElementById('carouselTrack')
    .style.transform = `translateX(-${currentSlide * 100}%)`;

  document.querySelectorAll('.carousel-dot').forEach((d, i) =>
    d.classList.toggle('active', i === currentSlide)
  );
}

function nextSlide() {
  const total = document.querySelectorAll('.carousel-slide').length;
  currentSlide = (currentSlide + 1) % total;
  updateCarousel();
}

function prevSlide() {
  const total = document.querySelectorAll('.carousel-slide').length;
  currentSlide = (currentSlide - 1 + total) % total;
  updateCarousel();
}

function goToSlide(i) {
  currentSlide = i;
  updateCarousel();
}
