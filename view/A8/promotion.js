document.addEventListener('DOMContentLoaded', () => loadPromotionProducts());

async function loadPromotionProducts(filters = {}) {
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();

        // default countryId
        params.append('countryId', filters.countryId || 25);

        if (filters.category) params.append('category', filters.category);
        if (filters.minDiscount) params.append('minDiscount', filters.minDiscount);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sort) params.append('sort', filters.sort);

        const res = await fetch(`/api/getPromotionProducts?${params.toString()}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!res.ok) throw new Error('Failed to fetch promotions');

        const data = await res.json();
        renderPromotionProducts(data);

    } catch (err) {
        console.error('Failed to load promotion products', err);
        const grid = document.getElementById('discounts');
        grid.innerHTML = '<p>Failed to load promotions.</p>';
    }
}

function renderPromotionProducts(products) {
    const grid = document.getElementById('discounts');
    grid.innerHTML = '';

    products
        .filter(p => p.discountRate !== null)
        .forEach((item, index) => {
            const discountPercent = Math.round(item.discountRate * 100); // convert 0.3 -> 30%

            grid.innerHTML += `
                <div class="card">
                    <div class="discount">${discountPercent}% OFF</div>
                    <img src="${item.imageURL}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <div class="price">
                        <span class="current">$${item.discountedPrice.toFixed(2)}</span>
                        <span class="old">$${item.price.toFixed(2)}</span>
                    </div>
                    <button 
                        class="btn"
                        onclick="location.href='productDetail.html?id=${item.id}'">
                        Shop Now
                    </button>
                </div>
            `;
        });
}

// Example: load promotions by category
function filterPromotionsByCategory(category) {
    loadPromotionProducts({ category });
}
