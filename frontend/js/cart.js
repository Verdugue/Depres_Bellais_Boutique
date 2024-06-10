document.addEventListener("DOMContentLoaded", function () {
  displayCart();
  const cartItems = document.getElementById("cart-items");

  if (cartItems) {
      cartItems.addEventListener("click", function (event) {
          let target = event.target;
          while (target != null && !target.classList.contains("trash")) {
              target = target.parentElement;
          }
          if (target && target.classList.contains("trash")) {
              const poissonId = target.getAttribute("data-id");
              removeFromCart(poissonId);
              target.closest(".cart-item").remove();
              updateTotal();
          }
      });
  }

  const validateOrderButton = document.getElementById('validate-order-button');
  if (validateOrderButton) {
      validateOrderButton.addEventListener('click', function () {
          const totalAmount = calculateTotalAmount();
          window.location.href = `payment.html?total=${totalAmount}`;
      });
  }
});

function calculateTotalAmount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  let totalAmount = 0;
  Object.values(cart).forEach(item => {
      totalAmount += item.price * item.quantity;
  });
  // Ajoutons les taxes de 20 euros
  totalAmount += 20;
  return totalAmount.toFixed(2);
}

function displayCart() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) return; // Sortie rapide si l'élément n'existe pas

  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  cartItems.innerHTML = ""; // Nettoyer les anciens éléments

  if (Object.keys(cart).length === 0) {
    cartItems.innerHTML = "<p>Votre panier est vide.</p>";
  } else {
    Object.values(cart).forEach((item) => {
      const itemElement = createCartItemElement(item);
      if (itemElement) {
        cartItems.appendChild(itemElement);
      }
    });
  }
  updateTotal();
}

function createCartItemElement(item) {
  const itemElement = document.createElement("div");
  itemElement.className = "cart-item";
  if (
    item.name &&
    !isNaN(item.quantity) &&
    !isNaN(item.price) &&
    item.image_path
  ) {
    itemElement.innerHTML = `
              <div id="cart-left2"> 
                  <img src="frontend/assets/img/${item.image_path}" alt="${item.name}" class="item-image">
                  <span class="item-name">${item.name}</span>
              </div>
              <div id="cart-right2">
                  <span class="item-quantity">${item.quantity}</span>
                  <button class="trash" data-id="${item.id}"><img id="trash" src="/frontend/assets/img/trash.png"></button>
                  <span class="item-total-price">${(item.price * item.quantity).toFixed(2)}€</span>
              </div>`;
    return itemElement;
  } else {
    return null; // Retourne null si les données de l'article sont manquantes
  }
}

function removeFromCart(poissonId) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  if (cart && cart[poissonId]) {
    delete cart[poissonId];
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart(); // Mettre à jour l'affichage du panier après suppression
  }
}

function updateTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  let totalPrice = 0;
  let itemCount = 0;
  Object.values(cart).forEach((item) => {
    const price = parseFloat(item.price);
    const quantity = parseInt(item.quantity);
    if (!isNaN(price) && !isNaN(quantity)) {
      totalPrice += price * quantity;
      itemCount += quantity;
    }
  });

  const totalPriceElement = document.getElementById("total-price");
  const taxMessageElement = document.getElementById("tax-message");
  const transportMessageElement = document.getElementById("transport-message");

  if (itemCount > 0) {
    // Afficher les messages de taxes et de transport
    taxMessageElement.style.display = "block";
    transportMessageElement.style.display = "block";
    // Ajouter les taxes (10 + 10 euros)
    totalPrice += 20;
    totalPriceElement.textContent = `${totalPrice.toFixed(2)}€ (Taxes inclues)`;
  } else {
    // Masquer les messages de taxes et de transport
    taxMessageElement.style.display = "none";
    transportMessageElement.style.display = "none";
    totalPriceElement.textContent = "0.00€";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const promoCodes = {
    PROMO20: 0.2, // 20% de réduction
    PROMO30:0.3,
  };

  const totalAmountElement = document.getElementById("total-price");
  const promoCodeInput = document.getElementById("promo-code");
  const applyPromoButton = document.getElementById("apply-promo");
  const discountMessageElement = document.getElementById("discount-message");

  applyPromoButton.addEventListener("click", function (event) {
    event.preventDefault(); // Empêche le comportement par défaut du bouton
    const promoCode = promoCodeInput.value.trim();
    const discount = promoCodes[promoCode];

    if (discount) {
      const originalTotal = parseFloat(totalAmountElement.textContent);
      const newTotal = originalTotal - originalTotal * discount;
      totalAmountElement.textContent = `${newTotal.toFixed(2)}€ (Taxes inclues)`;

      discountMessageElement.textContent = `Code promo appliqué: ${promoCode} - ${
        discount * 100
      }% de réduction`;
      discountMessageElement.style.color = "green";
      applyPromoButton.disabled = true;
      promoCodeInput.disabled = true;
    } else {
      discountMessageElement.textContent = "Code promo invalide.";
      discountMessageElement.style.color = "red";
    }
  });
});
