document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('filter-category');
    const speciesSelect = document.getElementById('filter-species');
    const locationSelect = document.getElementById('filter-location');
    const colorSelect = document.getElementById('filter-color');
    const filterButton = document.getElementById('filter-button');

    categorySelect.addEventListener('change', function() {
        const category = categorySelect.value;
        fetchSpecies(category);
        fetchLocations(category);
        fetchColors(category);
    });

    filterButton.addEventListener('click', function() {
        const category = categorySelect.value;
        const species = speciesSelect.value;
        const location = locationSelect.value;
        const color = colorSelect.value;
        const minPrice = document.getElementById('filter-min-price').value;
        const maxPrice = document.getElementById('filter-max-price').value;

        const query = new URLSearchParams({
            category,
            species,
            location,
            color,
            minPrice,
            maxPrice
        }).toString();

        fetch(`http://localhost:3000/api/filter/results?${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(results => displayResults(results))
            .catch(error => console.error('Erreur lors de la récupération des résultats:', error));
    });

    function fetchSpecies(category) {
        fetch(`http://localhost:3000/api/filter/species?category=${category}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(species => {
                speciesSelect.innerHTML = '<option value="">Choisir une espèce</option>';
                species.forEach(species => {
                    const option = document.createElement('option');
                    option.value = species;
                    option.textContent = species;
                    speciesSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des espèces:', error));
    }

    function fetchLocations(category) {
        fetch(`http://localhost:3000/api/filter/locations?category=${category}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(locations => {
                locationSelect.innerHTML = '<option value="">Choisir un emplacement</option>';
                locations.forEach(location => {
                    const option = document.createElement('option');
                    option.value = location;
                    option.textContent = location;
                    locationSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des emplacements:', error));
    }

    function fetchColors(category) {
        fetch(`http://localhost:3000/api/filter/colors?category=${category}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(colors => {
                colorSelect.innerHTML = '<option value="">Choisir une couleur</option>';
                colors.forEach(color => {
                    const option = document.createElement('option');
                    option.value = color;
                    option.textContent = color;
                    colorSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des couleurs:', error));
    }

    function displayResults(results) {
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';

        results.forEach(item => {
            const card = createCard(item);
            resultsContainer.appendChild(card);
        });
    }

    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'card';
        let linkUrl, imageUrl, title, description, price;

        if (item.id_animals) {
            linkUrl = `/article.html?id=${item.id_animals}`;
            imageUrl = `frontend/assets/img/${item.image_path}`;
            title = item.species;
            description = item.location;
            price = item.price;
        } else if (item.id_plant) {
            linkUrl = `/article.html?id=${item.id_plant}`;
            imageUrl = `frontend/assets/img/${item.image_path}`;
            title = item.plant_name;
            description = item.description;
            price = item.price;
        } else if (item.id_other) {
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
});
