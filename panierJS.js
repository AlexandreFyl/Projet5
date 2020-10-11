const cartTotal = document.querySelector(".cart-total");
//let finalPrice = Storage.showTotalPrice();
// ecrire le total qu'on stocke dans le LS
//cartTotal.innerText = parseFloat(finalPrice.toFixed(2));

// init objet pour req post
let Contact = new Object();

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
    request.open("POST", "https://oc-p5-api.herokuapp.com/api/cameras/order");
    //request.setRequestHeader("Content-Type", "application/json");
    //request.setRequestHeader("Access-Control-Allow-Origin", "*");
   // request.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    //request.setRequestHeader("Access-Control-Allow-Headers", "append,delete,entries,foreach,get,has,keys,set,values,Authorization");
    request.onreadystatechange = function() {
      var res = document.getElementById("result");
        if (this.readyState == 4 && this.status == 200) {
          var json = JSON.parse(request.responseText);
            res.innerHTML = json.postData.text;
            console.log(json);
        }
    };
    request.send(
      Contact.firstName = document.getElementById("prenom").prenom,
      Contact.lastName = document.getElementById("nom").nom,
      Contact.adress = document.getElementById("adress1").adress1 + document.getElementById("adress2").adress2,
      Contact.city = document.getElementById("city").city,
      Contact.email = document.getElementById("email").email,


    );
    };
    
    var form = document.getElementById("formulaire"); /* on met un id car sinon avec une classe ca renvoie une html collection plus chiant a gerer */
    console.log(form);
    form.addEventListener("click", function(event){
      event.preventDefault();
      send();                
     });
  