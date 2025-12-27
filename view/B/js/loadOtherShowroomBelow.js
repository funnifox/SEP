document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/showShowroomByCategory')
        .then(res => res.json())
        .then(data => {
            renderOtherShowrooms(data);
        })
        .catch(err => console.error('Failed to load showrooms', err));
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]];   // swap elements
    }
    return array;
}

function renderOtherShowrooms(showrooms) {
    const container = document.getElementById('other-showrooms');
    container.innerHTML = ''; 

    const shuffledShowrooms = shuffleArray(showrooms);

    // only take first 10 showrooms
    shuffledShowrooms.slice(0, 10).forEach(showroom => {
        const card = document.createElement('div');
        card.className = 'other-showroom-card';

        card.innerHTML = `
            <img src="${showroom.cover_image_url}" alt="${showroom.name}">
            <div class="card-info">
                <h5 class = "other-showroom-name">${showroom.name}</h5>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `/B/SG/showroomDetail.html?id=${showroom.id}`;
        });

        container.appendChild(card);
    });
}

