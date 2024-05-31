document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    const cartItems = document.getElementById('cart-items');

    // Gestion du retrait du panier
    cartItems.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-from-cart-btn')) {
            const poissonId = event.target.getAttribute('data-id');
            removeFromCart(poissonId);
            event.target.parentElement.remove(); // Retire l'élément de l'interface utilisateur
            updateTotal();
        }
    });
});

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    cartItems.innerHTML = ''; // Nettoyer les anciens éléments

    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide.</p>';
    } else {
        Object.values(cart).forEach(item => {
            const itemElement = createCartItemElement(item);
            cartItems.appendChild(itemElement);
        });
    }
    updateTotal();
}

function createCartItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    if (item.species && !isNaN(item.quantity) && !isNaN(item.price)) {
        itemElement.innerHTML = `
            <p>${item.species} - Quantité: ${item.quantity} - Prix total: ${(item.price * item.quantity).toFixed(2)}€</p>
            <button class="remove-from-cart-btn" data-id="${item.id}">Retirer du panier</button>
        `;
    } else {
        itemElement.innerHTML = `<p>Informations sur l'article manquantes ou incorrectes.</p>`;
    }
    return itemElement;
}

function removeFromCart(poissonId) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart && cart[poissonId]) {
        delete cart[poissonId];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();  // Mettre à jour l'affichage du panier après suppression
    }
}

function updateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    let totalPrice = 0;

    Object.values(cart).forEach(item => {
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity);
        if (!isNaN(price) && !isNaN(quantity)) {
            totalPrice += price * quantity;
        }
    });

    document.getElementById('total-price').textContent = `Total: ${totalPrice.toFixed(2)}€`;
}
