function renderOtherShowrooms(showrooms) {
    const container = document.getElementById('other-showrooms');
    container.innerHTML = ''; 

    showrooms.forEach(showroom => {
        const card = document.createElement('div');
        card.className = 'other-showroom-card';

        card.innerHTML = `
            <img src="${showroom.cover_image_url}" alt="${showroom.name}">
            <div class="card-info">
                <h5>${showroom.name}</h5>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `/B/SG/showroomDetail.html?id=${showroom.id}`;
        });

        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/showShowroomByCategory')
        .then(res => res.json())
        .then(data => {
            renderOtherShowrooms(data);
        })
        .catch(err => console.error('Failed to load showrooms', err));
});
