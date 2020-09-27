const cartTotal = document.querySelector(".cart-total");

//let finalPrice = Storage.showTotalPrice();
// ecrire le total qu'on stocke dans le LS
//cartTotal.innerText = parseFloat(finalPrice.toFixed(2));

// nombre articles panier
cartItems.innerText =  Storage.showNumberItems(); 

//afficher panier
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();

    ui.setupApp();
    ui.cartLogic();
}); 
