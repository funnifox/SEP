function renderFurnitureHotspots(showroom) {
    console.log(showroom)
    const container = document.getElementById("showroom-image");


    // get image width and height (for coord normalization)
    const rect = container.getBoundingClientRect();

    showroom.furnitures.forEach(f => {
        // create a dot for every furniture item
        const dot = document.createElement("div");
        dot.className = "furniture-dot"; // Give css class to design the dot

        /**
         * FOLLOW OUTPUT. position.x or position.y
         * We convert to percentage positioning, so we x by 100%
         * 
                "position": {
                    "x": 1,
                    "y": 1
                }
         */
        dot.style.left = `${(f.position.x * 100)/rect.width}%`;
        dot.style.top  = `${(f.position.y * 100)/rect.width}%`;

        // store furniture id
        dot.dataset.id = f.ID

        // get function from another js file
        dot.addEventListener("click", (e) => {
            showFurniturePanel(e, f.id);
        })

        container.appendChild(dot);
    });
}