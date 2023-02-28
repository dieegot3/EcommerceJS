// P R U E B A S
// setTimeout(() => {
//   let cartIcon = document.getElementsByClassName(`cartIcon`)[0];
//   console.log(cartIcon);
//   cartIcon.addEventListener("mouseover", () => {
//     cartIcon.style.opacity = "100%";
//   });
// }, 1100);

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

//Imprimir el catálogo en la página web
function showCatalogue(array) {
  storeSection.innerHTML = "";
  for (let game of array) {
    //Setear elementos HTML, cards con los contenidos de los juegos
    let newGroupGameDiv = document.createElement("div");
    newGroupGameDiv.setAttribute("id", `cardGame${game.id}`);
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
        <div id="click-space">
        <button id="addBtn${game.id}" class="btn cartIcon" ><iconify-icon icon="material-symbols:shopping-cart" style="color: #c427eb; margin: auto; width="32" height="32"; border-color: "none";"></iconify-icon></button>
        <div class="bg-img--opacity"></div>
        </div>
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
    Toastify({
      text: "Juego agregado con éxito",
      duration: 3000,
      newWindow: false,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #c427eb, #a21ac4)",
      },
      offset: {
        x: "1rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
        y: "3.5rem", // vertical axis - can be a number or a string indicating unity. eg: '2em'
      },
    }).showToast();
  } else {
    //Notificación para avisar al usuario que el juego ya se encontraba en el carrito
    Toastify({
      text: "Este juego ya se encuentra en el carrito",
      duration: 3000,
      newWindow: false,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #dd2c7f, #d71a72)",
      },
      offset: {
        x: "1rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
        y: "3.5rem", // vertical axis - can be a number or a string indicating unity. eg: '2em'
      },
    }).showToast();
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
      <div class="gameInCart" id="gameCart${gameCart.id}">
        <img class="cartGameImg" src="images/${gameCart.img}" alt="${gameCart.title}">
        <div class="gameInCart__info">
          <div>
            <h4 class="card-title">${gameCart.title}</h4>
            <p class="card-text" style="padding-top: 10px;">$${gameCart.price}</p>
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

//Prueba de hover tarjeta
// showCatalogue.forEach((game) => {
//   document.getElementById;
// });
// addBtn.onmouseover = () => {
//   addBtn.style.display = "flex";
// };

//EJECUCIÓN DEL CÓDIGO
//Carga de los juegos en la tienda
setTimeout(() => {
  showCatalogue(gamesStore);
}, 1000);
