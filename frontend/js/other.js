document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;

    if (currentPage.endsWith('other.html')) {
        fetch('http://localhost:3000/api/others')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(others => displayOthers(others))
            .catch(error => console.error('Erreur lors de la récupération des données:', error));
    }

    if (currentPage.endsWith('article.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const otherId = urlParams.get('id');

        if (otherId) {
            fetch(`http://localhost:3000/api/others/${otherId}`)
                .then(response => response.json())
                .then(other => displayOtherDetails(other))
                .catch(error => console.error('Erreur lors de la récupération des données:', error));
        }
    }
});

function displayOthers(others) {
    const container = document.getElementById('other-container');
    if (!container) {
        console.error('Element with id "achat-other" not found.');
        return;
    }
    container.innerHTML = ''; // Clear previous content
    others.forEach(other => {
        const card = createOtherCard(other);
        container.appendChild(card);
    });
}

function createOtherCard(other) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <a id="lien" href="/article.html?id=${other.id_other}">
            <div class="card-top">
                <img src="frontend/assets/img/${other.image_path}" alt="${other.species}" class="card-img-top">
            </div>
            <div class="card-body">
                <div id="left-commande">
                    <div class="text-commande">
                        <h5 class="card-title">${other.species}</h5>
                        <p class="card-text">${other.description}</p>
                    </div>
                </div>
                <div id="right-commande">
                    <div class="text-commande">
                        <p><strong>Price:</strong> $${other.price}</p>
                    </div>
                </div>
            </div>
        </a>
    `;
    return card;
}

function displayOtherDetails(other) {
    document.getElementById('nom').textContent = other.species;
    document.getElementById('poisson-image').src = `frontend/assets/img/${other.image_path}`;
    document.getElementById('prix').textContent = `Prix : ${other.price}€`;
    document.getElementById('prix').setAttribute('data-price', other.price);
    document.getElementById('quantite').textContent = `En Stock : ${other.stock}`;
    document.getElementById('location').textContent = `Emplacement : ${other.location}`;
    document.getElementById('desc').textContent = other.description;
}
