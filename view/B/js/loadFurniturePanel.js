document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.querySelector(".close-btn");
    const panel = document.getElementById("furniture-panel");
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            document.getElementById("furniture-panel").classList.add("hidden");
        });
    } 

    // press anywhere to close panel
    document.addEventListener("click", (e) => {
        if (!panel.classList.contains("hidden") &&
            !panel.contains(e.target)) {
            panel.classList.add("hidden");
        }
    });

});

function showFurniturePanel(event, furnitureId) { 
    event.stopPropagation();

    fetch(`/api/getFurnitureDetailById?id=${furnitureId}`)
        .then(res => res.json())
        .then(res => {
            if (!Array.isArray(res) || res.length === 0) {
                throw new Error("No furniture data returned");
            }

            const f = res[0];
            const panel = document.getElementById("furniture-panel");

            // Fill data
            document.getElementById("panel-image").src = f.IMAGEURL;
            document.getElementById("panel-name").textContent = f.NAME;
            document.getElementById("panel-category").textContent = `TYPE: ${f.CATEGORY}`;

            document.getElementById("panel-length").textContent = `L: ${f._LENGTH} cm`;
            document.getElementById("panel-height").textContent = `H: ${f.HEIGHT} cm`;
            document.getElementById("panel-width").textContent = `W: ${f.WIDTH} cm`;

            // POSITIONING LOGIC
            // Use clientX and clientY for 'fixed' positioning
            // add 10px offset so the panel doesn't cover the dot itself
            panel.style.left = (event.clientX + 10) + "px"; 
            panel.style.top = (event.clientY + 10) + "px";


            // Buttons for buy now and add to cart
            addToCartButton = document.getElementById("add-to-cart-btn");
            buyNowButton = document.getElementById("buy-now-btn");
            moreDetailButton = document.getElementById("more-details-btn");

            // Add to cart button
            addToCartButton.onclick = null;
            addToCartButton.onclick = (e) => {
                addToCart(
                    f.SKU, f.ID, f.PRICE, f.NAME, f.IMAGEURL
                )
            }

            // Button for Buy Now page 
            buyNowButton.onclick = null;
            buyNowButton.onclick = (e) => {
                addToCart(
                    f.SKU, f.ID, f.PRICE, f.NAME, f.IMAGEURL
                )
                
                window.location.href = `/B/SG/shoppingCart.html`
            }

            moreDetailButton.addEventListener('click', () => {
                window.location.href = `/B/SG/furnitureProductDetails.html?sku=${f.SKU}`
            })

            panel.classList.remove("hidden");
        })
        .catch(err => {
            console.error("Error loading furniture panel:", err);
        });
}

