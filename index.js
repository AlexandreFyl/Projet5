document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products); // qd on a recupéré nos produits avec la methode getProducts on les envoie dans notre methode de display
        Storage.saveProducts(products); // on envoie les products dans le localStorage

    }).then(() => { // se lance UNIQUEMENT une fois que les deux lignes de commandes au dessus n'est retourné un résultat;
        ui.getBagButtons();
    });
});