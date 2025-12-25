document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const showroomId = params.get("id");

    if (!showroomId) {
        console.error("No showroom ID in URL");
        return;
    }

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
    showroomImage.innerHTML = `
        <img id="mainShowroomImg" src="${showroom.coverImage}" alt="${showroom.name}" class="img-fluid luxury-image">
    `;

    // Description
    const showroomDescription = document.getElementById("showroom-description");
    showroomDescription.innerHTML = `
        <h2 class="about-title">
            <i class="fas fa-palette"></i> About This Showroom
        </h2>

        <p class="luxury-description">
            ${showroom.description}
        </p>

        <div class="color-palette-wrapper">
            <p>Colors Used:</p>
            <div id="color-palette" class="color-palette"></div>
        </div>
    `;

    // Extract colors after image loads
    const img = document.getElementById("mainShowroomImg");
    img.onload = () => {
        const colors = extractDominantColors(img, 3);
        renderColorPalette(colors);
    };

    // Furniture list
    const furnitureList = document.getElementById("furniture-list");
    furnitureList.innerHTML = "";

    showroom.furnitures.forEach(f => {
        const div = document.createElement("div");
        div.classList.add("furniture-item");

        div.innerHTML = `
            <img src="${f.image}" alt="${f.name}">
            <div class="furniture-info">
                <p class="furniture-name">${f.name}</p>
            </div>
        `;

        furnitureList.appendChild(div);
    });
}


// COLOR EXTRACTION PATTETE
// function to extract dominant colors from the showroom image
function extractDominantColors(img, count = 3) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // set canvas dimensions to match the image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorMap = {}; // to keep track of color freq

    // loop theough pixel data
    for (let i = 0; i < imageData.length; i += 40) {
        const r = imageData[i]; // red value
        const g = imageData[i + 1]; // green value
        const b = imageData[i + 2]; // blue value

        // Ignore near-white / near-black pixels
        if (
            (r > 245 && g > 245 && b > 245) ||
            (r < 10 && g < 10 && b < 10)
        ) continue;

        // reduce color precision to group similar colors together
        const key = `${Math.round(r / 20) * 20},${Math.round(g / 20) * 20},${Math.round(b / 20) * 20}`;

        // Count how many time this color appears
        colorMap[key] = (colorMap[key] || 0) + 1;
    }

    // Sort colors by frequency, pick top 'count' colors, and convert to CSS rgb format
    return Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(c => `rgb(${c[0]})`);
}

function renderColorPalette(colors) {
    const palette = document.getElementById("color-palette");
    palette.innerHTML = ""; 

    colors.forEach(color => {
        const swatch = document.createElement("div");
        swatch.className = "color-swatch";
        swatch.style.backgroundColor = color;

        // Show RGB/HEX value on hover
        swatch.title = color; // simple tooltip

        // add overlay text on hover to show rgb info
        const tooltip = document.createElement("span");
        tooltip.className = "swatch-tooltip";
        tooltip.textContent = color;
        swatch.appendChild(tooltip);

        palette.appendChild(swatch);
    });
}
