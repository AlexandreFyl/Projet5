// variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartAffichage = document.querySelector(".cart-total");

const cartContent = document.querySelector(".cart-content");

// ajouter var pour panier

const productsDOM = document.querySelector(".products-center");
// buttons
let buttonsDOM = [];
let cart = []; // surement a supprimer
// fin variables




// Recuperer products json

class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;
            // on remodele un objet a notre image afin de pas avoir un tableau pour les lenses (les fichiers data sont normalement plus complexes a mapper)
            products = products.map(item => {
                const name = item.name;
                const price = item.price;
                const id = item._id;
                const description = item.description;
                const imageUrl = item.imageUrl;
                const lense1 = item.lenses[0];// parcourir le tableau 
                const lense2 = item.lenses[1];
                const lense3 = item.lenses[2];
                return { name, price, description, lense1, lense2, lense3, imageUrl, id };
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

// Class methodes statiques localStorage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products)); // on stringify le array car on le stock dans le local storage
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);// on stringify le array car on le stock dans le local storage // on trouve le produit associé a l'id et on retourne l'objet correspondant
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart)); // on stringify le array car on le stock dans le local storage 
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []; // Equivalent d'un if else le ? est exécuté si le test retourne vrai sinon c'est le ':' // permet de check si le cart esst vide dans le LS
    }
    static updateTotalPrice(totalPrice) {
        localStorage.setItem("totalPrice", totalPrice); // on stocke le prix total dans le localStorage car on ne peut pas ecrire directement sur la page panier
    }
    static updateNumberItems(cartItems) {
        localStorage.setItem("numberItems", cartItems); // on stocke le prix total dans le localStorage car on ne peut pas ecrire directement sur la page panier
    }
    static showNumberItems() {
        return JSON.parse(localStorage.getItem("numberItems"));

    }
    static showTotalPrice() {
        return JSON.parse(localStorage.getItem("totalPrice"));

    }
    static getCart() {
        return localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart"))
            : [];
    }

}

// nombre articles panier
cartItems.innerText = Storage.showNumberItems();

// Affichage products

class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += ` 
            <article class="product">
            <div class="img-container">
                <img src=${product.imageUrl} alt="A COMPLETER" class="product-img">
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart">
                        add to bag
                    </i>
                </button>
            </div>
            <h3>${product.name}</h3>
            <h4>${product.price}€</h4>
            </article>
            `;
            // ATTENTION les petits trema au dessus permettent d'ecrire sur plusieurs lignes et c'est la touche 7 pas la 4 ca t'evitera de re perdre 30 min ;) 

        });
        productsDOM.innerHTML = result; // on met le resultat de la boucle dans la balise html ayant la classe products-center ( et on met bien le js perso en fin de page pour eviter de reperdre 30 min)
    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")]; // renvoie un array plutot qu'une node list -> [...]
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id; // on récupere l'id que l'on a renseigné en dynamique dans le dataset du form html
            let inCart = cart.find(item => item.id == id); // on crée une var inCart qui check si l'item actuel de la boucle a le meme id 
            if (inCart) { // avant tout on check si l'item est dans le panier
                button.innerText = "In Cart"; // on change le txt "ajouter au panier" en "dans le panier"
                button.disabled = true; // on desactive le button
            } // test button 
            else {
                button.addEventListener("click", event => {
                    event.target.innerText = "In cart";
                    event.target.disabled = true;
                    // get product from products
                    let cartItem = { ...Storage.getProduct(id), amount: 1 }; // renvoie l'objet du produit dont on a choisi ( plutot cliqué mais pas en phase de test) // + {...} on ré-ecrit l'objet en rajoutant la valeur nb d'itérations de cet appareil dans le panier

                    // add product to the cart
                    cart = [...cart, cartItem]; // on ajouter l'objet sur lequel on vient de cliquer puis on l'ajoute a l'array cart
                    // save cart in LS
                    Storage.saveCart(cart); //on stocke cart dans le LS
                    // set cart values
                    this.setCartValues(cart);
                    // display cart items
                    this.addCartItem(cartItem);
                });
            }
        })
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => { // "on remape le panier avec seulement les valeurs dont on a besoin"
            tempTotal += item.price * item.amount; // on ajoute au tempTotal le prix de l'appareil multiplié par la quantité
            itemsTotal += item.amount // on ajoute le nombre d'appareil au nombre d'appareils total
        })
        //cartTotal.innerText = parseFloat(tempTotal.toFixed(2)); // on evite les problemes de 2*2 = 4.00000000002 commun a JS et d'autre langages
        Storage.updateTotalPrice(tempTotal); // on stocke dans le localStorage pour pas perde la valeur lorsqu'on change de page
        Storage.updateNumberItems(itemsTotal); // on stocke dans le localStorage pour pas perde la valeur lorsqu'on change de page
        cartItems.innerText = itemsTotal;
        cartAffichage.innerText = parseFloat(tempTotal.toFixed(2)); // comment faire pour ne pas charger cette ligne sur index ??



    }
    addCartItem(item) {
        const div = document.createElement('div'); // on crée une div dans le html
        div.classList.add('cart-item') // on l'ecrit dans le div ayant cette classe
        // ensuite on crée dynamiquement chaque produit ajouté au panier on crée la div en JS car on peut pas juste ecrire un "placeholder" en html car le nombre d'items varie
        div.innerHTML = `<img src=${item.imageUrl} alt="product" /> 
        <div>
            <h4>${item.name}</h4>
            <h5>${item.price}€</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">
                ${item.amount}
            </p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`
        // le data permet de "relier" le html a l'objet entre gros guillemets
        cartContent.appendChild(div); // si une div a été crée pour le 1 er objet au lieu de l'overwrite cela en creera une autre
        console.log(cartContent);
    }
    setupApp() { // init de l'app
        cart = Storage.getCart(); // on ajust notre variable cart a notre LS qu'il soit vide ou non
        this.setCartValues(cart); // si il y en a on calcule la valeur du panier ou elle est egale a 0
        this.populateCart(cart); 
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item)); // on boucle sur notre resultat de la var cart afin d'écrire tous les items dans le panier en HTML
    }
    cartLogic(){
        // vider le panier
        clearCartBtn.addEventListener('click',()=>{
            this.clearCart(); // si on met seulement this.clearCart sans le reste cela ressort la balise tel quel en Html alors que la ca renvoie la classe UI
        }); 
        // fonctionnalités panier
        cartContent.addEventListener('click', event => {
            //console.log(event.target); // Renvoie la balise sur laquelle on clique
            if(event.target.classList.contains('remove-item')){ // si je clique sur un element qui a la classe remove-item
                let removeItem = event.target;
                let id = removeItem.dataset.id; // on recupere le dataset it html qui correspond a celui de nos objets
                cartContent.removeChild(removeItem.parentElement.parentElement); // on a acces a la div html contenant la classe remove-item on "remonte" au "grand-pere" pour selectionner la div contenant tout l'appareil et ses infos // qui est elle meme un enfant de cart-content
                this.removeItem(id); // retire du LS
                location = location;
            } 
            else if(event.target.classList.contains('fa-chevron-up')){ // si je clique sur le chevron du haut
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id); // on cible l'objet du tableau cart qui correspond a l'id qu'on ressort du dataset
                tempItem.amount = tempItem.amount + 1; // on incremente
                Storage.saveCart(cart); // on update le nombre d'items dans le LS
                this.setCartValues(cart); // on recalcule le total
                addAmount.nextElementSibling.innerText = tempItem.amount; // on ecrit le total mis a jour dans la div qui suit celle du chevron up donc la div correspondant a amount
                Storage.updateTotalPrice(cart);
                //location = location;
            }
            else if(event.target.classList.contains('fa-chevron-down')){ // si je clique sur le chevron du bas
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id); // on cible l'objet du tableau cart qui correspond a l'id qu'on ressort du dataset
                tempItem.amount = tempItem.amount -1;
                if(tempItem.amount > 0){ // si le nombre d'item atteint 0 on supprime l'element du panier
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount; // on ecrit le total mis a jour dans la div qui precede celle du chevron down donc la div correspondant a amount
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement); // comme dans le premier if
                    this.removeItem(id);
                }
                //location = location;
            }
        })
    }
    clearCart(){
        let cartItems = cart.map(item => item.id); // on extrait l'id des objets qui sont renvoyés et qui correspondent au appareil en ce moment dans le panier
        cartItems.forEach(id => this.removeItem(id)); // on boucle sur le tab d'id renvoyé au dessus et on leur applique la methode remove
        while(cartContent.children.length > 0){ // tant que le panier contient un article la boucle continue et supprime le premier element du tableau ( contenant les div html) a chaque iteration
            cartContent.removeChild(cartContent.children[0]);
        }
        location = location; // recharge la page afin de re ecrire le total a partir du JS
    }
    removeItem(id){ // on l'ecrit en dehors de clearCart pour pouvoir s'en servir ailleurs
        cart = cart.filter(item => item.id !== id); // on garde que les items qui on un id different alors qu'on boucle sur ces items doit donc renvoyer un tab vide
        this.setCartValues(cart); // on met a jour la variable de panier
        Storage.saveCart(cart); // on met a jour le panier dans le LS
    }

}



