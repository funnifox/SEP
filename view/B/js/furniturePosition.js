function renderFurnitureHotspots(showroom) {
    const container = document.getElementById("showroom-image");

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
        dot.style.left = `${f.position.x * 100}%`;
        dot.style.top  = `${f.position.y * 100}%`;

        container.appendChild(dot);
    });
}