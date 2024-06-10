document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const totalAmount = urlParams.get('total');
    document.getElementById('total-amount').textContent = `Total: ${totalAmount}€`;

    document.getElementById('payment-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const cardNumber = document.getElementById('card-number').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const cvc = document.getElementById('cvc').value;

        const token = "11c7b4fc-ec78-400b-865f-a2f2d668f809";

        const bodyData = {
            card: {
                number: cardNumber,
                expiration_date: expirationDate,
                cvc: cvc
            },
            payment_intent: {
                price: parseFloat(totalAmount)
            }
        };

        try {
            const result = await fetch("https://challenge-js.ynovaix.com/payment", {
                method: "POST",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            });

            if (!result.ok) {
                const errorResponse = await result.json();
                throw new Error(errorResponse.message);
            }

            const paymentResult = await result.json();
            alert('Payment successful!');
            console.log(paymentResult);

            updateStock();

            localStorage.removeItem('cart');
            window.location.href = 'success.html';

        } catch (error) {
            console.error('Payment failed:', error.message);
            alert('Payment failed: ' + error.message);
        }
    });

    const deliveryLocationSelect = document.getElementById('delivery-location');
    const homeDeliveryDetails = document.getElementById('home-delivery-details');
    const storeDeliveryDetails = document.getElementById('store-delivery-details');
    const saveAddressBtn = document.getElementById('save-address-btn');
    const saveStoreBtn = document.getElementById('save-store-btn');

    deliveryLocationSelect.addEventListener('change', function () {
        if (deliveryLocationSelect.value === 'home') {
            homeDeliveryDetails.style.display = 'block';
            storeDeliveryDetails.style.display = 'none';
        } else if (deliveryLocationSelect.value === 'store') {
            homeDeliveryDetails.style.display = 'none';
            storeDeliveryDetails.style.display = 'block';
        } else {
            homeDeliveryDetails.style.display = 'none';
            storeDeliveryDetails.style.display = 'none';
        }
    });

    saveAddressBtn.addEventListener('click', function () {
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const address = document.getElementById('address').value;
        const postalCode = document.getElementById('postal-code').value;

        const addressData = {
            firstName,
            lastName,
            address,
            postalCode
        };

        localStorage.setItem('deliveryAddress', JSON.stringify(addressData));
        alert('Adresse enregistrée avec succès!');
    });

    saveStoreBtn.addEventListener('click', function () {
        const storeLocation = document.getElementById('store-location').value;

        localStorage.setItem('storeLocation', storeLocation);
        alert('Magasin enregistré avec succès!');
    });

    function updateStock() {
        const cart = JSON.parse(localStorage.getItem('cart'));

        for (const id in cart) {
            const item = cart[id];
            fetch(`http://localhost:3000/api/poissons/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ stock: item.stock - item.quantity })
            })
            .then(response => response.json())
            .then(data => {
                console.log(`Stock mis à jour pour l'article ${item.name}:`, data);
            })
            .catch(error => {
                console.error(`Erreur lors de la mise à jour du stock pour l'article ${item.name}:`, error);
            });
        }
    }
});
