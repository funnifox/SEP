document.addEventListener('DOMContentLoaded', () => {
    loadFilterPanel();
});

const filterBtn = document.querySelector(".filter-icon");
const filterPopup = document.getElementById("filter-popup");
const closeFilter = document.getElementById("close-filter");

const clearBtn = document.getElementById("clear-filter");
clearBtn.addEventListener("click", clearFilter);

// Open filter panel 
filterBtn.addEventListener("click", () => {
    filterPopup.classList.add("active"); 
})

// Close popup when clicking close button
closeFilter.addEventListener("click", () => {
    filterPopup.classList.remove("active"); // <-- remove active class
});

// Close popup when clicking outside the content box
filterPopup.addEventListener("click", (e) => {
    if (e.target === filterPopup) {
        filterPopup.classList.remove("active"); // <-- remove active class
    }
});

// load filter panel
function loadFilterPanel() {
    const furnitureList = document.getElementById("furniture-list");

    fetch('/api/getFurnitureCategory')
        .then(res => res.json())
        .then(furnitures => {
            furnitureList.innerHTML = ""; 

            furnitures.forEach(furniture => {
                const label = document.createElement("label");
                label.innerHTML = `<input type="checkbox" value="${furniture.CATEGORY}"> ${furniture.CATEGORY}`;
                furnitureList.appendChild(label);
            });
        })
        .catch(err => {
            console.error("Failed to load furniture categories:", err);
            furnitureList.innerHTML = "<p>Unable to load categories.</p>";
        });
}

// Clear filter
function clearFilter() {
    const filterForm = document.querySelector(".filter-form");

    filterForm.querySelectorAll("input[type='text'], input[type='number']").forEach(input => {
        input.value = "";
    });
    filterForm.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false;
    });

    loadAllShowrooms();
}