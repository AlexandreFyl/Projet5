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

function send(){
    var request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/order");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Access-Control-Allow-Origin", "*");
    request.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    request.setRequestHeader("Access-Control-Allow-Headers", "append,delete,entries,foreach,get,has,keys,set,values,Authorization");
    request.onreadystatechange = function() {
      var res = document.getElementById("result");
        if (this.readyState == 4 && this.status == 200) {
          var json = JSON.parse(request.responseText);
            res.innerHTML = json.postData.text;
            console.log(json);
        }
    };
    request.send(JSON.stringify({
        email: document.getElementById("email").email,
        nom: document.getElementById("nom").nom,
        prenom: document.getElementById("prenom").prenom,
        adress1: document.getElementById("adress1").adress1,
        adress2: document.getElementById("adress2").adress2,
        city: document.getElementById("city").city,
        zip: document.getElementById("zip").zip

    }));
    };
    
    var form = document.getElementById("formulaire"); /* on met un id car sinon avec une classe ca renvoie une html collection plus chiant a gerer */
    console.log(form);
    form.addEventListener("click", function(event){
      event.preventDefault();
      send();                
     });
  