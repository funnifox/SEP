document.addEventListener("DOMContentLoaded", async () => {
    const dropdownContainer = document.querySelector(".category-dropdown");
    if (!dropdownContainer) return;

    // Create the <select> element
    const select = document.createElement("select");
    select.id = "categorySelect";
    select.innerHTML = `<option value="all" selected>All Showroom Categories</option>`;
    dropdownContainer.appendChild(select);

    try {
        const response = await fetch("/api/getShowroomCategory"); 
        const categories = await response.json();

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.name;    
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to load categories:", error);
        dropdownContainer.innerHTML = "<p>Failed to load categories.</p>";
    }

    // Filter showrooms when dropdown is used
    select.addEventListener("change", () => {
        const selectedCategory = select.value;
        loadShowroomsByCategory(selectedCategory);
    })
});
