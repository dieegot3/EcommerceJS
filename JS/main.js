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
let offcanvasHeader = document.getElementById("offcanvas-header");
let offcanvasFooter = document.getElementById("offcanvas-footer");

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
function loadCart(array) {
  btnCompleteBuy.classList.add("d-md-none");
  offcanvasHeader.innerHTML = `
<h2 style="padding-left: 2.8rem;">Carrito de Compras</h2>
<button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>`;
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
  let totalPrice = document.getElementById("totalPrice");
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
        if (array.length == 0) {
          btnBuy.classList.add("d-md-none");
        }
      });
  });
  if (array.length != 0) {
    btnBuy.classList.remove("d-md-none");
  }
  total(array); //Mostrar el total
  btnBuy.addEventListener("click", () => {
    completePurchase();
  });
}

function completePurchase() {
  offcanvasHeader.innerHTML = `
<h2 style="padding-left: 2.8rem;">Finalizar compra</h2>
<button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
`;
  modalBodyCart.innerHTML = "";
  modalBodyCart.innerHTML = `
  <form class="form__options" action="">
          <h4>Complete los siguientes campos de información</h4>
          <input class="form__options__input" type="text" name="name" id="" placeholder="Nombre" required>
          <input class="form__options__input" type="text" name="surname" id="" placeholder="Apellido" required>
          <input class="form__options__input" type="text" name="location" id="" placeholder="Localidad" required>
          <input class="form__options__input" type="email" name="mail" id="" placeholder="tu-correo@gmail.com" required>
          <br><br>
          <h4>Datos de la tarjeta</h4>
          <div style="display: flex; gap: 1rem;">          
          <select id="selectCountry" class="form__options__input select" required>
            <option value="country">País</option>
            <option value="argentina">Argentina</option>
            <option value="brasil">Brasil</option>
            <option value="chile">Chile</option>
            <option value="uruguay">Uruguay</option>
            <option value="paraguay">Paraguay</option>
            <option value="bolivia">Bolivia</option>
            <option value="colombia">Colombia</option>
            <option value="mexico">Mexico</option>
            <option value="cuba">Cuba</option>
            <option value="peru">Perú</option>
            <option value="venezuela">Venezuela</option>
            <option value="ecuador">Ecuador</option>
            <option value="guatemala">Guatemala</option>
            <option value="puertoRico">Puerto Rico</option>
            <option value="panama">Panamá</option>
            <option value="honduras">Honduras</option>
            <option value="jamaica">Jamaica</option>
          </select>
          <select id="selectCard" class="form__options__input select" required>
            <option value="card">Tarjeta</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
          </select>
          </div>
          <input class="form__options__input" inputmode="numeric" maxlength="16" name="cardNumber" id="" placeholder="xxxx xxxx xxxx xxxx" required>
          <input class="form__options__input" type="password" maxlength="3" autocomplete="off" name="cardSecurity" id="" placeholder="xxx" required>
        </form>
        <br><br>
  `;
  btnCompleteBuy.classList.remove("d-md-none");
  btnBuy.classList.add("d-md-none");
  btnCompleteBuy.addEventListener("click", () => {
    Toastify({
      text: "Compra realizada",
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
  });
}

//Funcionabilidad del boton para mostrar el carrito
showCart.addEventListener("click", () => {
  loadCart(gamesInCart);
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
