document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/getShowroom', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    })
    .then(res => res.json())
    .then(data => {
        const showrooms = data; 
        const container = document.getElementById('showroomList');

        container.innerHTML = '';

        if (!showrooms || showrooms.length === 0) {
            container.innerHTML = '<p>No showrooms found.</p>';
            return;
        }

        showrooms.forEach(showroom => {
            const col = document.createElement('div');
            col.className = 'col-md-4';

            col.innerHTML = `
                <div class="showroom-card" data-id="${showroom.id}">
                    <img src="${showroom.cover_image_url}" alt="${showroom.name}">
                    <div class="showroom-card-body">
                        <h4>${showroom.name}</h4>
                        <p>Description: ${showroom.description}</p>
                    </div>
                </div>
            `;

            container.appendChild(col);
        });
    })
    .catch(err => {
        console.error(err);
        alert('Failed to load showrooms');
    });
});
