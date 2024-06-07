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

    if (currentPage.endsWith('plant.html')) {
        fetch('http://localhost:3000/api/plants')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(plants => displayPlants(plants))
            .catch(error => console.error('Erreur lors de la récupération des plantes:', error));
    }

    if (currentPage === '/article.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const poissonId = urlParams.get('id');

        if (poissonId) {
            fetch(`http://localhost:3000/api/poissons/${poissonId}`)
                .then(response => response.json())
                .then(poisson => {
                    displayPoissonDetails(poisson);
                    document.getElementById('add-to-cart-btn').setAttribute('data-id', poissonId);
                })
                .catch(error => console.error('Erreur lors de la récupération des données du poisson:', error));
        }

        document.getElementById('selecteur').addEventListener('change', function() {
            const quantity = parseInt(this.value);
            const price = parseFloat(document.getElementById('prix').getAttribute('data-price'));
            const totalPrice = (price * quantity).toFixed(2);
            document.getElementById('prix').textContent = `Prix total : ${totalPrice}€`;
        });

        document.getElementById('add-to-cart-btn').addEventListener('click', function(event) {
            event.preventDefault();
            const poissonId = event.target.getAttribute('data-id');
            const quantity = parseInt(document.getElementById('selecteur').value);

            fetch(`http://localhost:3000/api/poissons/${poissonId}`)
                .then(response => response.json())
                .then(poisson => addToCart(poisson, quantity))
                .catch(error => console.error('Erreur lors de la récupération des données du poisson:', error));
        });
    }
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
            <div class="card-top">
                <img src="frontend/assets/img/${poisson.image_path}" alt="${poisson.species}" class="card-img-top">
            </div>
            <div class="card-body">
                <div id="left-commande">
                    <div class="text-commande">
                        <h5 class="card-title">${poisson.species}</h5>
                    </div>
                </div>
                <div id="right-commande">
      a              <div class="text-commande">
                        <p class="card-text">${poisson.description}</p>
                    </div>
                    <div class="text-commande">
                        <p class="list-group-item">${poisson.price}€</p>
                    </div>
                </div>
            </div>
        </a>
    `;
    return card;
}


function addToCart(poisson, quantity) {
    if (!poisson.id_animals || !poisson.species || isNaN(parseFloat(poisson.price)) || isNaN(parseInt(poisson.stock)) || !poisson.image_path) {
        console.error('Données de poisson incomplètes lors de l\'ajout au panier:', poisson);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    const price = parseFloat(poisson.price); // Convertir le prix en nombre

    if (cart[poisson.id_animals]) {
        if ((cart[poisson.id_animals].quantity + quantity) <= poisson.stock) {
            cart[poisson.id_animals].quantity += quantity;
        } else {
            alert("Stock insuffisant pour cet article.");
            return;
        }
    } else {
        cart[poisson.id_animals] = {
            id: poisson.id_animals,
            species: poisson.species,
            price: price,
            quantity: quantity,
            stock: poisson.stock,
            image_path: poisson.image_path // Assurez-vous de passer cette propriété
        };
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Article ajouté au panier :", cart[poisson.id_animals]);
}


function displayPoissonDetails(poisson) {
    document.getElementById('nom').textContent = poisson.species;
    document.getElementById('poisson-image').src = `frontend/assets/img/${poisson.image_path}`;
    document.getElementById('prix').textContent = `Prix : ${poisson.price}€/u`;
    document.getElementById('prix').setAttribute('data-price', poisson.price);
    document.getElementById('quantite').textContent = `En Stock : ${poisson.stock}`;
    document.getElementById('elevage').textContent = ` ${poisson.elevage}`;
    document.getElementById('origine').textContent = ` ${poisson.origine}`;
    document.getElementById('desc').textContent = poisson.description;
}
