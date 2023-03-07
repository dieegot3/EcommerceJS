//Funcionabilidad del btn para mostrar el carrito
showCart.addEventListener("click", () => {
  loadCart(gamesInCart);
});

//Notificación de compra realizada
btnCompleteBuy.addEventListener("click", () => {
  Toastify({
    text: "Compra realizada",
    duration: 3000,
    newWindow: false,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background:
        "linear-gradient(to right, rgb(104, 179, 38), rgb(92, 181, 24))",
    },
    offset: {
      x: "1rem",
      y: "3.5rem",
    },
  }).showToast();
});

//Loader y background timeout
setTimeout(() => {
  let loader = document.getElementById("loader");
  let bg = document.getElementById("background");
  loader.classList.add("d-md-none");
  bg.classList.add("d-md-none");
}, 2000);
