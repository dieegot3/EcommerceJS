/* Elementos del DOM */

let storeSection = document.getElementById("store");
let btnCart = document.getElementById("btnCart");
let modalBodyCart = document.getElementById("modal-bodyCart");
let showCart = document.getElementById("showCart");
let offcanvasHeader = document.getElementById("offcanvas-header");
let offcanvasFooter = document.getElementById("offcanvas-footer");
let btnCompleteBuy = document.getElementById("btnCompleteBuy");
let totalPrice = document.getElementById("totalPrice");

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
}

//Creacion del array de los juegos disponibles en la tienda y almacenamiento en local storage
let gamesStore = [];
const loadStore = async () => {
  const resp = await fetch("games.json");
  const data = await resp.json();
  for (let game of data) {
    let newGame = new Game(
      game.id,
      game.title,
      game.price,
      game.genre,
      game.launch,
      game.img
    );
    gamesStore.push(newGame);
  }
  localStorage.setItem("gamesStore", JSON.stringify(gamesStore));
};
if (localStorage.getItem("gamesStore")) {
  gamesStore = JSON.parse(localStorage.getItem("gamesStore"));
} else {
  loadStore();
}
