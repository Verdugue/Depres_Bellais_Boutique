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

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart-btn')) {
            event.preventDefault(); // Empêche le comportement par défaut du bouton
            const poissonId = event.target.getAttribute('data-id');
            fetch(`http://localhost:3000/api/poissons/${poissonId}`)
                .then(response => response.json())
                .then(poisson => addToCart(poisson))
                .catch(error => console.error('Erreur lors de la récupération des données du poisson:', error));
        }
    });
});

function displayPoissons(poissons) {
    const container = document.getElementById('achat-prop');
    container.innerHTML = ''; // Clear previous content
    poissons.forEach(poisson => {
        const card = createCard(poisson);
        container.appendChild(card);
    });
}

function createCard(poisson) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <a id="lien" href="/article.html?id=${poisson.id_animals}">
            <img src="frontend/assets/img/${poisson.image_path}" alt="${poisson.species}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${poisson.species}</h5>
                <p class="card-text">${poisson.description}</p>
                <p class="list-group-item">${poisson.price}€</p>
                <button class="add-to-cart-btn" data-id="${poisson.id_animals}">Ajouter au panier</button>
            </div>
        </a>
    `;
    return card;
}

function addToCart(poisson) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[poisson.id_animals]) {
        cart[poisson.id_animals].quantity += 1;
    } else {
        if (poisson.id_animals && poisson.species && typeof poisson.price === 'number') {
            cart[poisson.id_animals] = {
                id: poisson.id_animals,
                species: poisson.species,
                price: poisson.price,
                quantity: 1
            };
        } else {
            console.error('Données de poisson incomplètes lors de l\'ajout au panier:', poisson);
            return;
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Article ajouté au panier :", cart[poisson.id_animals]);
}

function displayPoissonDetails(poisson) {
    document.getElementById('nom').textContent = poisson.species;
    document.getElementById('poisson-image').src = `frontend/assets/img/${poisson.image_path}`;
    document.getElementById('prix').textContent = `Prix : ${poisson.price}€/u`;
    document.getElementById('quantite').textContent = ` ${poisson.stock}`;
    document.getElementById('elevage').textContent = ` ${poisson.elevage}`;
    document.getElementById('origine').textContent = ` ${poisson.origine}`;
    document.getElementById('desc').textContent = poisson.description;
}
