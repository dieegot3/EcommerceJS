/* DECLARACION DE VARIABLES */

let storeSection = document.getElementById("store");
let btnCart = document.getElementById("btnCart");
let modalBodyCart = document.getElementById("modal-bodyCart");
let showCart = document.getElementById("showCart");
let totalPrice = document.getElementById("totalPrice");
//Juego en carrito
let gamesInCart;
if (localStorage.getItem("cart")) {
  gamesInCart = JSON.parse(localStorage.getItem("cart"));
} else {
  gamesInCart = [];
  localStorage.setItem("cart", gamesInCart);
}

//Class constructora de juegos
class Game {
  constructor(id, title, price, genre, launch, img) {
    (this.id = id),
      (this.title = title),
      (this.price = price),
      (this.genre = genre),
      (this.launch = launch),
      (this.img = img);
  }
  showId() {
    console.log(`El id de este juego es ${this.Id}`);
  }
  showName() {
    console.log(`El nombre de este juego es ${this.title}`);
  }
  showPrice() {
    console.log(`El precio del juego ${this.title} es $${this.price}`);
  }
  showGenre() {
    console.log(`El género del juego ${this.title} es ${this.genre}`);
  }
  showLaunch() {
    console.log(`El juego ${this.title} fue lanzado en el año ${this.launch}`);
  }
  showAll() {
    console.log(
      `${this.title} es un juego de ${this.genre} lanzado en el año ${this.launch} y tiene un precio de $${this.price}`
    );
  }
}

//Creacion de los juegos disponibles como CONSTANTES
const game1 = new Game(
  1,
  "Age of Empires II",
  2480,
  "Estrategia",
  2019,
  "AgeOfEmpiresII.jpg"
);
const game2 = new Game(
  2,
  "Ark Survival Evolved",
  1420,
  "Supervivencia",
  2017,
  "ArkSurvivalEvolved.jpg"
);
const game3 = new Game(
  3,
  "Battlefield 2042",
  4530,
  "Disparos",
  2021,
  "Battlefield2042.jpg"
);
const game4 = new Game(
  4,
  "Dark Souls Remastered",
  1600,
  "Rol",
  2018,
  "DarkSoulsRemastered.jpg"
);
const game5 = new Game(
  5,
  "Dead by Daylight",
  1040,
  "Supervivencia",
  2016,
  "DeadByDaylight.jpg"
);
const game6 = new Game(
  6,
  "Elite Dangerous",
  2400,
  "Simulacion",
  2015,
  "EliteDangerous.jpg"
);

//Creacion del array de los juegos disponibles en la tienda y almacenamiento en local storage
let gamesStore = [];
if (localStorage.getItem("gamesStore")) {
  gamesStore = JSON.parse(localStorage.getItem("gamesStore"));
} else {
  gamesStore.push(game1, game2, game3, game4, game5, game6);
  localStorage.setItem("gamesStore", JSON.stringify(gamesStore));
}

//Imprimir el catálogo en la página web
function showCatalogue(array) {
  storeSection.innerHTML = "";
  for (let game of array) {
    //Setear elementos HTML, cards con los contenidos de los juegos
    let newGroupGameDiv = document.createElement("div");
    newGroupGameDiv.className = "group__game";
    newGroupGameDiv.innerHTML = `
        <div id="${game.id}" class="group__game">
        <img class="group__game__img" src="images/${game.img}" alt="Miniatura del juego "${game.title}">
        <div class="group__game__info">
          <h4>${game.title}</h4>
          <p class="group__game__info__time">$${game.price}</p>
          <div class="group__game__info__other">
            <p>${game.genre}</p>
            <p>Lanzamiento: ${game.launch}</p>
          </div>
        </div>
        <button id="addBtn${game.id}" class="btn btn-outline-success" style="margin-left: 4rem;"><iconify-icon icon="material-symbols:shopping-cart" style="color: #c427eb; padding-top: 6px;"></iconify-icon></button>
      </div>
        `;
    storeSection.appendChild(newGroupGameDiv);
    let addBtn = document.getElementById(`addBtn${game.id}`);
    addBtn.onclick = () => {
      addToCart(game);
    };
  }
}

//Agregar un juego al carrito y setearlo en el storage
function addToCart(game) {
  let gameAdd = gamesInCart.find((elem) => elem.id == game.id);
  if (gameAdd == undefined) {
    gamesInCart.push(game);
    localStorage.setItem("cart", JSON.stringify(gamesInCart));
    //Notificación para avisar al usuario que el juego se agregó al carrito exitosamente
    Swal.fire({
      title: "Juego agregado con éxito",
      text: `${game.title} ahora se encuentra en tu carrito`,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "green",
      timer: 3000,
      width: 350,
      imageUrl: `images/${game.img}`,
      imageHeight: 150,
    });
  } else {
    //Notificación para avisar al usuario que el juego ya se encontraba en el carrito
    Swal.fire({
      text: `El juego ${game.title} ya se encuentra en el carrito`,
      icon: "info",
      width: 400,
      timer: 1500,
      showConfirmButton: false,
    });
  }
}

//Calcular el total de los juegos sumados al carrito
function total(array) {
  let total = array.reduce((acc, gameCart) => acc + gameCart.price, 0);
  total == 0
    ? (totalPrice.innerHTML = `No hay ningún juego en el carrito`)
    : (totalPrice.innerHTML = `Total a pagar: $${total}`);
  return total;
}

//Seteo de la interfaz del carrito para mostrar los juegos sumados y el total de la compra, permitiendo al usuario eliminar los juegos que ya no quiera
function loadGamesInCart(array) {
  modalBodyCart.innerHTML = "";
  array.forEach((gameCart) => {
    //Creacion de la card con la información del juego existente en el carrito
    modalBodyCart.innerHTML += `
        <div class="card border-primary mb-3" id ="gameCart${gameCart.id}" >
            <img class="card-img-top" src="images/${gameCart.img}" alt="${gameCart.title}">
            <div class="card-body" style="display: flex; justify-content: space-between;">
                    <div>
            <h4 class="card-title" style="color: black">${gameCart.title}</h4>
                
                    <p class="card-text" style="color: black">$${gameCart.price}</p> 
                    </div>    
                    <button class= "btn" id="deleteBtn${gameCart.id}"><iconify-icon icon="fluent:delete-32-filled" style="color: #c427eb;" width="25" height="25"></iconify-icon></button>
            </div>    
        </div>
        `;
  });
  //Eliminación de los juegos agregados al carrito en el DOM y en el storage
  array.forEach((gameCart) => {
    document
      .getElementById(`deleteBtn${gameCart.id}`)
      .addEventListener("click", () => {
        let cardGame = document.getElementById(`gameCart${gameCart.id}`);
        cardGame.remove();
        let deleteGame = array.find((game) => game.id == gameCart.id);
        let position = array.indexOf(deleteGame);
        array.splice(position, 1);
        localStorage.setItem("cart", JSON.stringify(array));
        total(array); //Volver a calcular el total
      });
  });
  total(array); //Mostrar el total
}

//Funcionabilidad del boton para mostrar el carrito
showCart.addEventListener("click", () => {
  loadGamesInCart(gamesInCart);
});

//EJECUCIÓN DEL CÓDIGO
showCatalogue(gamesStore);
