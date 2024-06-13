document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/poissons')
        .then(response => response.json())
        .then(data => displayAnimals(data))
        .catch(err => console.error('Erreur lors de la récupération des données:', err));
});

function displayAnimals(animals) {
    const container = document.getElementById('achat');
    if (!container) {
        console.error('Element with id "achat" not found.');
        return;
    }
    container.innerHTML = ''; // Clear previous content

    animals.forEach(animal => {
        const card = createAnimalCard(animal);
        container.appendChild(card);
    });
}

function createAnimalCard(animal) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <a id="lien" href="/article.html?id=${animal.id_animals}">
            <div class="card-top">
                <img src="frontend/assets/img/${animal.image_path}" alt="${animal.species}" class="card-img-top">
            </div>
            <div class="card-body">
                <div id="left-commande">
                    <div class="text-commande">
                        <h5 class="card-title">${animal.species}</h5>
                        <p class="card-text">${animal.origine}</p>
                    </div>
                </div>
                <div id="right-commande">
                    <div class="text-commande">
                        <p><strong>Price:</strong> $${animal.price}</p>
                    </div>
                </div>
            </div>
        </a>
    `;
    return card;
}
