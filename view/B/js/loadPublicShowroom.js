document.addEventListener('DOMContentLoaded', loadAllShowrooms);

    function loadAllShowrooms() {
        fetch('/api/showShowroomByCategory')
            .then(res => res.json())
            .then(data => {
                renderShowrooms(data);
            })
            .catch(err => {
                console.error('Failed to load showrooms', err);
            });
    }

    // Load showrooms filtered by category
    function loadShowroomsByCategory(category) {
        let url = '/api/showShowroomByCategory';
        if (category && category !== 'all') {
            url += `?category=${encodeURIComponent(category)}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => renderShowrooms(data))
            .catch(err => console.error('Failed to filter showrooms', err));
    }

    function renderShowrooms(showrooms) {
        // select grid container by id
        const grid = document.getElementById('showroomGrid');
        grid.innerHTML = '';

        // loop through showrooms
        showrooms.forEach((showroom, index) => {

            // every 5th card is made larger to make it interesting instead of boring card layouts
            const isLarge = index % 5 === 0;

            // limit description length to prevent breaking thru the card, and replace the long text with '...'
            const shortDesc = showroom.description
                ? showroom.description.substring(0, 90) + '...'
                : '';

            grid.innerHTML += `
                <div class="${isLarge ? 'col-md-8' : 'col-md-4'}">
                    <div class="card showroom-card h-100 border-0 shadow-sm ${isLarge ? 'large-card' : ''}">

                        <div class="image-wrapper">
                            <img src="${showroom.cover_image_url}" alt="${showroom.name}">
                            <span class="category-badge">${showroom.category_name}</span>
                        </div>

                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${showroom.name}</h5>

                            ${!isLarge ? `<p class="card-text text-muted small-desc">${shortDesc}</p>` : ''}

                            <a 
                                href="showroomDetail.html?id=${showroom.id}" 
                                class="btn btn-dark view-btn mt-auto">
                                View Showroom
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    );
}
