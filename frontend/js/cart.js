document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    const cartItems = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart'));

    if (!cart || Object.keys(cart).length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide.</p>';
    } else {
        Object.keys(cart).forEach(poissonId => {
            const quantity = cart[poissonId];
            const item = JSON.parse(localStorage.getItem('cartItem_' + poissonId));
            const itemElement = createCartItemElement(item, quantity, poissonId);
            cartItems.appendChild(itemElement);
        });
    }

    // Gestion du retrait du panier
    cartItems.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-from-cart-btn')) {
            const poissonId = event.target.getAttribute('data-id');
            removeFromCart(poissonId);
            event.target.parentElement.remove(); // Retire l'élément de l'interface utilisateur
        }
    });
});

function createCartItemElement(item) {
    const itemElement = document.createElement('div');
    if (item && item.species && typeof item.quantity === 'number' && typeof item.price === 'number') {
        itemElement.innerHTML = `
            <p>${item.species} - Quantité: ${item.quantity} - Prix total: ${(item.price * item.quantity).toFixed(2)}€</p>
            <button class="remove-from-cart-btn" data-id="${item.id}">Retirer du panier</button>
        `;
    } else {
        console.error('Invalid item data:', item);
        itemElement.innerHTML = `<p>Informations sur l'article manquantes ou incorrectes.</p>`;
    }
    return itemElement;
}



function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    cartItems.innerHTML = '';
    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide.</p>';
    } else {
        Object.values(cart).forEach(item => {
            if (item && item.species && typeof item.quantity === 'number' && typeof item.price === 'number') {
                const itemElement = createCartItemElement(item);
                cartItems.appendChild(itemElement);
            } else {
                console.error('Données invalides dans le panier:', item);
            }
        });
    }
}

function removeFromCart(poissonId) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart && cart[poissonId]) {
        delete cart[poissonId];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();  // Mettre à jour l'affichage du panier après suppression
    }
}