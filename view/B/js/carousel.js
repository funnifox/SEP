document.addEventListener('DOMContentLoaded', () => {
    const carouselInner = document.querySelector('#hero-carousel .carousel-inner');
    const carouselIndicators = document.querySelector('#hero-carousel .carousel-indicators');

    fetch('/api/showRandomCarousel')
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                carouselInner.innerHTML = '<div class="carousel-item active">No showrooms found.</div>';
                return;
            }

            data.forEach((item, index) => {

                // Carousel item
                const activeClass = index === 0 ? 'active' : '';
                const div = document.createElement('div');
                div.className = `carousel-item ${activeClass}`;
                div.innerHTML = `
                    <a href = "/B/SG/showroomDetail.html?id=${item.id}" class = "carousel-link">
                        <img src="${item.cover_image_url}" class="d-block w-100" alt="${item.name}" style="height:60vh; object-fit:cover;">
                        <div class="carousel-caption">
                            <div class = "caption-box">
                                <h5>${item.name}</h5>
                                <small>Category: ${item.category_name}</small>
                                <p>${item.description}</p>
                            </div>
                        </div>
                    </a>
                `;
                carouselInner.appendChild(div);

                // Carousel indicators
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#hero-carousel');
                indicator.setAttribute('data-bs-slide-to', index);
                if (index === 0) indicator.classList.add('active');
                indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);
                carouselIndicators.appendChild(indicator);
            });

            // Initialize carousel manually, move to new slide every 3 seconds
            new bootstrap.Carousel('#hero-carousel', {
                interval: 3000,
                ride: 'carousel',
                wrap: true
            });
        })
        .catch(err => {
            console.error(err);
            carouselInner.innerHTML = '<div class="carousel-item active">Failed to load showrooms.</div>';
        });
});
