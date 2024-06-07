document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/others')
        .then(response => response.json())
        .then(data => displayOthers(data))
        .catch(err => console.error('Erreur lors de la récupération des données:', err));
});

function displayOthers(items) {
    const container = document.getElementById('other-container');
    container.innerHTML = '';

    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
            <div class="item-header">
                <h2>${item.plant_name} - $${item.price}</h2>
            </div>
            <div class="item-details">
                <p><strong>Stock:</strong> ${item.stock}</p>
                <p><strong>Location:</strong> ${item.location}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <p><strong>Color:</strong> ${item.color}</p>
                <p><strong>PH:</strong> ${item.ph}</p>
            </div>
        `;
        container.appendChild(itemCard);
    });
}
