document.addEventListener('DOMContentLoaded', loadPromotions);

function loadPromotions() {
    fetch('/api/getPromotionProducts')
        .then(res => res.json())
        .then(renderPromotions);
}

function renderPromotions(promos) {
    const table = document.getElementById('promoTable');
    table.innerHTML = '';

    promos.forEach(p => {
        console.log(p)
        table.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>
                    <input value="${p.discountRate*100}" 
                           onchange="updatePromotion(${p.id}, this.value)">
                </td>
                <td>${p.startDate}</td>
                <td>${p.endDate}</td>
                <td>
                    <button onclick="location.href='promotionAdminUpdate.html?promotionId=${p.promoId}'">
                    Edit
                    </button>
                </td>
                <td>
                    <button type="button" onclick="deletePromotion(${p.promoId})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function createPromotion() {
    fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            itemId: document.getElementById('itemId').value,
            discountRate: document.getElementById('discountRate').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            countryId: 25,
            description: 'Admin promotion'
        })
    }).then(() => loadPromotions());
}

function updatePromotion(id, discountRate) {
    fetch(`/api/admin/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountRate })
    });
}

function deletePromotion(id) {
    if (!confirm(`Delete promotion(${id})?`)) return;
    fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' })
        .then(() => loadPromotions());
}
