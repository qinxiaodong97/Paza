console.log("global.js loaded");

const overlayClass = ".cart-overlay";
const cartClass = ".cart";
const cartToggleClass = ".cart-toggle";
const cartCloseClass = ".cart__close";
const menuToggleClass = ".menu-toggle";

document.querySelector(cartToggleClass).addEventListener("click", function () {
  openCart();
});
document.querySelector(cartCloseClass).addEventListener("click", function () {
  closeCart();
});
document.querySelector(overlayClass).addEventListener("click", function () {
  closeCart();
  closeMenu();
});
document.querySelector(menuToggleClass).addEventListener("click", function () {
  toggleMenu();
});

function openCart() {
  document.querySelector(cartClass).classList.add("active");
  document.querySelector(overlayClass).classList.add("active");
  document.body.classList.add("no-scroll");
  // closeMenu();
}

function closeCart() {
  document.querySelector(cartClass).classList.remove("active");
  if (!document.querySelector(".menu-drawer").classList.contains("active")) {
    document.querySelector(overlayClass).classList.remove("active");
  }
  document.body.classList.remove("no-scroll");
}

function toggleMenu() {
  console.log("Menu Toggle Clicked");
  if (document.querySelector(".menu-drawer").classList.contains("active")) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  document.querySelector(".menu-drawer").classList.add("active");
  document.querySelector(".cart-overlay").classList.add("active");
  document.body.classList.add("no-scroll");
  closeCart();
}

function closeMenu() {
  document.querySelector(".menu-drawer").classList.remove("active");
  if (!document.querySelector(cartClass).classList.contains("active")) {
    document.querySelector(overlayClass).classList.remove("active");
  }

  document.body.classList.remove("no-scroll");
}
