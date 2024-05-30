document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;

    if (currentPage === '/' || currentPage === '/index.html') {
        fetch('http://localhost:3000/api/poissons')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(poissons => displayPoissons(poissons))
            .catch(error => console.error('Erreur lors de la récupération des poissons:', error));
    }

    if (currentPage === '/article.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const poissonId = urlParams.get('id');

        if (poissonId) {
            fetch(`http://localhost:3000/api/poissons/${poissonId}`)
                .then(response => response.json())
                .then(poisson => displayPoissonDetails(poisson))
                .catch(error => console.error('Erreur lors de la récupération des données du poisson:', error));
        }
    }
});

function displayPoissons(poissons) {
    const container = document.getElementById('achat-prop');
    container.innerHTML = ''; // Clear previous content
    console.log(poissons); // Affiche les données pour le débogage
    poissons.forEach(poisson => {
        console.log(poisson); // Vérifier chaque poisson
        const card = createCard(poisson);
        container.appendChild(card);
    });
}

function createCard(poisson) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <a id="lien" href="/article.html?id=${poisson.id_animals}">
            <img src="/frontend/assets/img/${poisson.image_path}" alt="${poisson.species}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${poisson.species}</h5>
                <p class="card-text">${poisson.description}</p>
                <p class="list-group-item">${poisson.price}€</p>
            </div>
        </a>
    `;
    return card;
}

function displayPoissonDetails(poisson) {
    document.getElementById('nom').textContent = poisson.species;
    document.getElementById('poisson-image').src = `frontend/assets/img/${poisson.image_path}`;
    document.getElementById('prix').textContent = `Prix : ${poisson.price}€/u`;
    document.getElementById('quantite').textContent = `Stock : ${poisson.stock}`;
    document.getElementById('desc').textContent = poisson.description;
    // Ajoutez d'autres champs si nécessaire
}
