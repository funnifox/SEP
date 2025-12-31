document.addEventListener('DOMContentLoaded', () => {
    // first, we load the showrooms
    loadAllShowrooms();

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const applyFilter = document.getElementById("apply-filter");

    // Filter 
    applyFilter.addEventListener("click", () => {
        const filters = collectFilters();
        filterShowrooms(filters);
    })

    // target for search button click
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        search(query);
    });

    // press enter to search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            search(query);
        }
    });
});

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

// Load showroom by search name
function search(q) {
    // If query is empty, revert to showing all
    if (!q || q === '') {
        loadAllShowrooms();
        return;
    }

    let url = `/api/showShowroomBySearch`;
    if (q && q !== '') {
        url += `?q=${encodeURIComponent(q)}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => renderShowrooms(data))
        .catch(err => console.error('Failed to search', err));
}

// Filter showrooms that have those furnitures
function filterShowrooms(filters) {

    console.log("Filter payload: ", filters);

    fetch(`/api/filterShowroom`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
    })

    .then(res => {

        // If search got no result
        if (res.status === 404) {
            return res.json().then(r => {
                renderShowrooms([]); // Show "No Showrooms Found" 
                console.warn(r.message);
            });
        }

        // if have result, show it
        return res.json();
    })

    .then(result => {
        if (!result) return;
        renderShowrooms(result.data);
    })
    .catch(err => {
        console.error('Failed to filter showrooms', err);
    });
}

function collectFilters() {
    return {
        // We use ID to detect which inputs are filled in for the filtering condition
        name: document.getElementById('searchInput').value.trim() || null,

        categories: getSelectedCategories(),

        // dimensions
        /* old code
        length: Number(document.getElementById('lengthInput')?.value) || null,
        width: Number(document.getElementById('widthInput')?.value) || null,
        height: Number(document.getElementById('heightInput')?.value) || null
        */

        lengthMin: Number(document.getElementById('lengthMinInput')?.value) || null,
        lengthMax: Number(document.getElementById('lengthMaxInput')?.value) || null,
        widthMin: Number(document.getElementById('widthMinInput')?.value) || null,
        widthMax: Number(document.getElementById('widthMaxInput')?.value) || null,
        heightMin: Number(document.getElementById('heightMinInput')?.value) || null,
        heightMax: Number(document.getElementById('heightMaxInput')?.value) || null,
    };
}

// Get furniture checkboxes that are checked for the filtering condition
function getSelectedCategories() {

    // Select all checked checkboxes
    const checked = document.querySelectorAll(
        '#furniture-list input[type="checkbox"]:checked'
    );

    // Get the array of the selected category values
    return Array.from(checked).map(cb => cb.value);
}

function renderShowrooms(showrooms) {
    const grid = document.getElementById('showroomGrid');
    grid.innerHTML = '';

    // If no result
    if (!showrooms || showrooms.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center text-muted mt-5">
                No showrooms found
            </div>
        `
        return;
    }

    // loop through showrooms
    showrooms.forEach((showroom, index) => {

        // every 5th card is made larger, to provide visual interest instead of same card layout
        const isLarge = index % 5 === 0;

        // limit description length, replace words with '...' if exceeds 90 letters
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
                        <a href="showroomDetail.html?id=${showroom.id}" class="btn view-btn mt-auto">View Showroom</a>
                    </div>
                </div>
            </div>
        `;
    });
}