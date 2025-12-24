document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const showroomId = params.get("id");

    if (!showroomId) {
        console.error("No showroom ID in URL");
        return;
    }

    // by query of showroom id 
    fetch(`/api/getShowroomDetails?id=${showroomId}`)
        .then(res => res.json())
        .then(result => {
            if (!result.success) {
                throw new Error("Failed to load showroom");
            }

            renderShowroom(result.data);
        })
        .catch(err => {
            console.error("Error loading showroom:", err);
        });
});

function renderShowroom(showroom) {
    // Showroom name
    document.getElementById("showroomName").textContent = showroom.name;

    // Main showroom image
    const showroomImage = document.getElementById("showroom-image");
    showroomImage.innerHTML = "";

    if (showroom.furnitures.length > 0) {
        showroomImage.innerHTML = `
            <img src="${showroom.coverImage}" alt="${showroom.name}" class="img-fluid">
        `;
    }

    // Furniture list
    const furnitureList = document.getElementById("furniture-list");
    furnitureList.innerHTML = "";

    showroom.furnitures.forEach(f => {
        const div = document.createElement("div");
        div.classList.add("furniture-item");

        div.innerHTML = `
            <img src="${f.image}" alt="${f.name}">
            <p>${f.name}</p>
        `;

        furnitureList.appendChild(div);
    });
}
