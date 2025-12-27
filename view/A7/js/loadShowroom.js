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
                    <div class="showroom-image">
                        <img src="${showroom.cover_image_url}" alt="${showroom.name}">
                        <span class="category-badge">${showroom.category_name}</span>
                    </div>

                    <div class="showroom-card-body">
                        <h4>${showroom.name}</h4>
                        <p class="description">${showroom.description}</p>

                        <div class="admin-actions">
                            <button class="btn-edit" onclick="window.location.href='showroomEditFurniture.html?showroomId=${showroom.id}'">
                                <i class="icon icon-edit"></i>
                                Edit
                            </button>

                            <button class="btn-delete" data-id="${showroom.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>
                        </div>
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




// newly added delete and edit, do not remove
// accept incoming in git merge

// delete showroom
function del(showroomId){
    staff = JSON.parse(sessionStorage.getItem("staff"))

    const data = {
        showroomId: showroomId,
        staffId: parseInt(staff.id)
    }

    console.log(data);
    return fetch(`/api/delShowroom`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(function (response) {
        window.location.reload();
    })
    .then(function (body) {
        if (body.error) throw new Error(body.error);
    })
    .catch(function (error) {
        console.error(error);
    });
}
















// assign btns
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.dataset.id;
        del(id);
    }
});

