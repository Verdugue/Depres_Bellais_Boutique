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

    if (currentPage.endsWith('other.html')) {
        fetch('http://localhost:3000/api/others')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(others => displayOthers(others))
            .catch(error => console.error('Erreur lors de la récupération des autres:', error));
    }

    if (currentPage.endsWith('article.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');

        if (!itemId) {
            console.error('ID manquant dans l\'URL');
            return;
        }

        fetch(`http://localhost:3000/api/poissons/${itemId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Poisson not found');
                }
                return response.json();
            })
            .then(poisson => {
                displayPoissonDetails(poisson);
                document.getElementById('add-to-cart-btn').setAttribute('data-id', itemId);
            })
            .catch(error => {
                console.log('Poisson:', error.message);
                fetch(`http://localhost:3000/api/plants/${itemId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Plant not found');
                        }
                        return response.json();
                    })
                    .then(plant => {
                        displayPlantDetails(plant);
                        document.getElementById('add-to-cart-btn').setAttribute('data-id', itemId);
                    })
                    .catch(error => {
                        console.log('Plant:', error.message);
                        fetch(`http://localhost:3000/api/others/${itemId}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Other not found');
                                }
                                return response.json();
                            })
                            .then(other => {
                                displayOtherDetails(other);
                                document.getElementById('add-to-cart-btn').setAttribute('data-id', itemId);
                            })
                            .catch(error => {
                                console.log('Other:', error.message);
                            });
                    });
            });

        document.getElementById('selecteur').addEventListener('change', function() {
            const quantity = parseInt(this.value);
            const price = parseFloat(document.getElementById('prix').getAttribute('data-price'));
            const totalPrice = (price * quantity).toFixed(2);
            document.getElementById('prix').textContent = `Prix total : ${totalPrice}€`;
        });

        document.getElementById('add-to-cart-btn').addEventListener('click', function(event) {
            event.preventDefault();
            const itemId = event.target.getAttribute('data-id');
            const quantity = parseInt(document.getElementById('selecteur').value);

            if (!itemId) {
                console.error('ID manquant lors de l\'ajout au panier');
                return;
            }

            fetch(`http://localhost:3000/api/poissons/${itemId}`)
                .then(response => response.json())
                .then(poisson => addToCart(poisson, quantity))
                .catch(() => {
                    fetch(`http://localhost:3000/api/plants/${itemId}`)
                        .then(response => response.json())
                        .then(plant => addToCart(plant, quantity))
                        .catch(() => {
                            fetch(`http://localhost:3000/api/others/${itemId}`)
                                .then(response => response.json())
                                .then(other => addToCart(other, quantity))
                                .catch(error => console.error('Erreur lors de l\'ajout au panier:', error));
                        });
                });
        });
    }
});

function displayPoissons(poissons) {
    const container = document.getElementById('achat-prop');
    container.innerHTML = ''; // Clear previous content
    poissons.forEach(poisson => {
        const card = createCard(poisson, 'poisson');
        container.appendChild(card);
    });
}

function displayPlants(plants) {
    const container = document.getElementById('achat-plant');
    container.innerHTML = ''; // Clear previous content
    plants.forEach(plant => {
        const card = createCard(plant, 'plant');
        container.appendChild(card);
    });
}

function displayOthers(others) {
    const container = document.getElementById('achat-other');
    container.innerHTML = ''; // Clear previous content
    others.forEach(other => {
        const card = createCard(other, 'other');
        container.appendChild(card);
    });
}

function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';
    let linkUrl, imageUrl, title, description, price;

    if (type === 'poisson') {
        linkUrl = `/article.html?id=${item.id_animals}`;
        imageUrl = `frontend/assets/img/${item.image_path}`;
        title = item.species;
        description = item.description;
        price = item.price;
    } else if (type === 'plant') {
        linkUrl = `/article.html?id=${item.id_plant}`;
        imageUrl = `frontend/assets/img/${item.image_path}`;
        title = item.plant_name;
        description = item.description;
        price = item.price;
    } else if (type === 'other') {
        linkUrl = `/article.html?id=${item.id_other}`;
        imageUrl = `frontend/assets/img/${item.image_path}`;
        title = item.species;
        description = item.description;
        price = item.price;
    }

    card.innerHTML = `
        <a id="lien" href="${linkUrl}">
            <div class="card-top">
                <img src="${imageUrl}" alt="${title}" class="card-img-top">
            </div>
            <div class="card-body">
                <div id="left-commande">
                    <div class="text-commande">
                        <h5 class="card-title">${title}</h5>
                        <p><strong>Price:</strong> $${price}</p>
                    </div>
                </div>
                <div id="right-commande">
                    <div class="text-commande">
                        <p class="card-text">${description}</p>
                    </div>
                </div>
            </div>
        </a>
    `;
    return card;
}

function addToCart(item, quantity) {
    const { id_animals, id_plant, id_other, species, plant_name, price, stock, image_path } = item;
    const id = id_animals || id_plant || id_other;
    const name = species || plant_name;

    if (!id || !name || isNaN(parseFloat(price)) || isNaN(parseInt(stock)) || !image_path) {
        console.error('Données incomplètes lors de l\'ajout au panier:', item);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    const itemPrice = parseFloat(price);

    if (cart[id]) {
        if ((cart[id].quantity + quantity) <= stock) {
            cart[id].quantity += quantity;
        } else {
            alert("Stock insuffisant pour cet article.");
            return;
        }
    } else {
        cart[id] = {
            id: id,
            name: name,
            price: itemPrice,
            quantity: quantity,
            stock: stock,
            image_path: image_path
        };
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Article ajouté au panier :", cart[id]);
}

function displayPoissonDetails(poisson) {
    document.getElementById('nom').textContent = poisson.species;
    document.getElementById('poisson-image').src = `frontend/assets/img/${poisson.image_path}`;
    document.getElementById('prix').textContent = `Prix : ${poisson.price}€/u`;
    document.getElementById('prix').setAttribute('data-price', poisson.price);
    document.getElementById('quantite').textContent = `En Stock : ${poisson.stock}`;
    document.getElementById('elevage').textContent = ` ${poisson.elevage}`;
    document.getElementById('location').textContent = ` ${poisson.location}`;
    document.getElementById('desc').textContent = poisson.description;
}

function displayPlantDetails(plant) {
    document.getElementById('nom').textContent = plant.plant_name;
    document.getElementById('poisson-image').src = `frontend/assets/img/${plant.image_path}`;
    document.getElementById('prix').textContent = `Prix : ${plant.price}€/u`;
    document.getElementById('prix').setAttribute('data-price', plant.price);
    document.getElementById('quantite').textContent = `En Stock : ${plant.stock}`;
    document.getElementById('location').textContent = `Emplacement : ${plant.location}`;
    document.getElementById('elevage').textContent = `PH : ${plant.ph}`;
    document.getElementById('desc').textContent = plant.description;
}

function displayOtherDetails(other) {
    document.getElementById('nom').textContent = other.species;
    document.getElementById('poisson-image').src = `frontend/assets/img/${other.image_path}`;
    document.getElementById('prix').textContent = `Prix : ${other.price}€/u`;
    document.getElementById('prix').setAttribute('data-price', other.price);
    document.getElementById('quantite').textContent = `En Stock : ${other.stock}`;
    document.getElementById('location').textContent = `Emplacement : ${other.location}`;
    document.getElementById('elevage').textContent = `PH : ${other.ph}`;
    document.getElementById('desc').textContent = other.description;
}
