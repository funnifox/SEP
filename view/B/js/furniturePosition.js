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
                {"x": 779.836219234275, "y": 582.5728585915099}
         */
        const OFFSET_X_PERCENT = 7; // right
        const OFFSET_Y_PERCENT = 7; // down

        dot.style.left = `${(f.position.x * 100)/(rect.width*(170/100)) + OFFSET_X_PERCENT}%`;
        dot.style.top  = `${(f.position.y * 100)/rect.height*(60/100) + OFFSET_Y_PERCENT}%`;

        // store furniture id
        dot.dataset.id = f.ID

        // get function from another js file
        dot.addEventListener("click", (e) => {
            showFurniturePanel(e, f.id);
        })

        container.appendChild(dot);
    });
}