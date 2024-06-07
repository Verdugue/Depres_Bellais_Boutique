document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/plants')
        .then(response => response.json())
        .then(data => displayPlants(data))
        .catch(err => console.error('Erreur lors de la récupération des plantes:', err));
});

function displayPlants(plants) {
    const container = document.getElementById('achat-plant');
    container.innerHTML = ''; // Vide le conteneur avant d'ajouter du nouveau contenu

    plants.forEach(plant => {
        container.appendChild(createPlantCard(plant));
    });
}

function createPlantCard(plant) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-top">
            <img src="frontend/assets/img/${plant.image_path}" alt="${plant.plant_name}" class="card-img-top">
        </div>
        <div class="card-body">
            <div id="left-commande">
                <div class="text-commande">
                    <h5 class="card-title">${plant.plant_name}</h5>
                    <p><strong>Price:</strong> $${plant.price}</p>
                </div>
            </div>
            <div id="right-commande">
                <div class="text-commande">
                    <p class="card-text">${plant.description}</p>
                </div>
                <div class="text-commande">
                    <p class="list-group-item"><strong>Stock:</strong> ${plant.stock}</p>
                    <p class="list-group-item"><strong>PH:</strong> ${plant.ph}</p>
                </div>
            </div>
        </div>
    `;
    return card;
}
