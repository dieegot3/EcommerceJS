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
        <button id="addBtn${game.id}" class="btn cartIcon" ><iconify-icon class="shopCartIcon" icon="material-symbols:shopping-cart" width="32" height="32"></iconify-icon></button>
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
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c427eb, #a21ac4)",
      },
      offset: {
        x: "1rem",
        y: "3.5rem",
      },
    }).showToast();
  } else {
    //Notificación para avisar al usuario que el juego ya se encontraba en el carrito
    Toastify({
      text: "Este juego ya se encuentra en el carrito",
      duration: 3000,
      newWindow: false,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #dd2c7f, #d71a72)",
      },
      offset: {
        x: "1rem",
        y: "3.5rem",
      },
    }).showToast();
  }
}

//Evaluar si existen juegos en el carrito leyendo el localStorage y si no existen, setearlo.
let gamesInCart;
if (localStorage.getItem("cart")) {
  gamesInCart = JSON.parse(localStorage.getItem("cart"));
} else {
  gamesInCart = [];
  localStorage.setItem("cart", gamesInCart);
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
<h2 class="padding-left-title">Carrito de Compras</h2>
<button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>`;
  modalBodyCart.innerHTML = "";
  //Creacion de la card con la información del juego existente en el carrito
  array.forEach((gameCart) => {
    modalBodyCart.innerHTML += `        
      <div class="gameInCart" id="gameCart${gameCart.id}">
        <img class="cartGameImg" src="images/${gameCart.img}" alt="${gameCart.title}">
        <div class="gameInCart__info">
          <div>
            <h4 class="card-title">${gameCart.title}</h4>
            <p class="card-text">$${gameCart.price}</p>
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
        total(array);
        if (array.length == 0) {
          btnBuy.classList.add("d-md-none");
        }
      });
  });
  //Ocultar btn "Finalizar compra" si no hay ningún producto en el carrito
  if (array.length != 0) {
    btnBuy.classList.remove("d-md-none");
  }
  total(array);
  btnBuy.addEventListener("click", () => {
    completePurchase();
  });
}

//Mostrar el formulario para completar la compra de los productos en el carrito
function completePurchase() {
  offcanvasHeader.innerHTML = `
<h2 class="padding-left-title">Finalizar compra</h2>
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
          <br>
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
}

//EJECUCIÓN DEL CÓDIGO
//Carga de los juegos en la tienda
setTimeout(() => {
  showCatalogue(gamesStore);
}, 2000);
