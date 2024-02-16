const tempDiscountData = [
  {
    count: 0,
    reward: null,
    message: "",
  },
  {
    count: 1,
    reward: null,
    message: "Add one more and receive a collectable mesh bag and sticker sheet.",
  },
  {
    count: 2,
    reward: "Free Shipping",
    message: "Add three more tubes for free shipping and a limited edition fanny pack ($43 value).",
  },
  {
    count: 3,
    reward: "20% off",
    message: "Add two more tubes for free shipping and a limited edition fanny pack ($43 value).",
  },
  {
    count: 4,
    reward: null,
    message: "Add one more tube for free shipping and a limited edition fanny pack ($43 value).",
  },
  {
    count: 5,
    reward: null,
    message:
      "You've unlocked free shipping and free gifts. Subscribe to save an additional 50%.",
  },
];

// const cart = document.querySelector(".zazzy-cart");
// const overlayClass = ".cart-overlay";
// const cartClass = ".cart";
// const cartToggleClass = ".cart-toggle";
// const closeButtonClass = ".cart__close";
const cartSquareIds = [
  "card-icon-tl",
  "cart-icon-tc",
  "cart-icon-tr",
  "cart-icon-bl",
  "cart-icon-bc",
  "cart-icon-br",
];

function ArrayFromIds(ids) {
  return ids.map((id) => document.getElementById(id));
}
let cartSquares = ArrayFromIds(cartSquareIds);
console.log(cartSquares);

[...document.querySelectorAll(".cart-addon__input")].forEach((input) =>
  input.addEventListener("change", function (event) {
    let checked = event.target.checked;
    if (checked) {
      event.target.parentNode.classList.add("active");
      event.target.parentNode.querySelector(
        ".cart-addon__button-text"
      ).innerText = "remove";
    } else {
      event.target.parentNode.classList.remove("active");
      event.target.parentNode.querySelector(
        ".cart-addon__button-text"
      ).innerText = "add";
    }
  })
);
document.querySelectorAll(".cart-product-btn").forEach((item) => {
  item.addEventListener("click", function () {
    let id = item.getAttribute("data-id");
    addToCart(id);
    openCart();
    refreshCart();
  });
});

// document.querySelector(cartToggleClass).addEventListener('click', function () {
//   openCart();
// });
// document.querySelector(closeButtonClass).addEventListener('click', function () {
//   closeCart();
// });
// document.querySelector(overlayClass).addEventListener('click', function () {
//   closeCart();
//   document.querySelector('.menu-drawer').classList.remove('active');
// });

document.querySelectorAll(".quick-add").forEach((item) => {
  item.addEventListener("click", function () {
    let id = item.getAttribute("data-id");
    addToCart(id);
    openCart();
    refreshCart();
  });
});

// function openCart() {
//   document.querySelector(cartClass).classList.add('active');
//   document.querySelector(overlayClass).classList.add('active');
//   document.body.classList.add('no-scroll');
//   console.log('cart opened');
// }

// function closeCart() {
//   document.querySelector(cartClass).classList.remove('active');
//   document.querySelector(overlayClass).classList.remove('active');
//   document.body.classList.remove('no-scroll');
// }

function refreshCart() {
  console.log("refresh");
  liquidAjaxCart.cartRequestUpdate();
}

class PzazCart extends HTMLElement {
  constructor() {
    super();
    this.querySelector(".sub-toggle").addEventListener(
      "click",
      this.toggleSubscriptions.bind(this)
    );
  }

  toggleSubscriptions(event) {
    const items = liquidAjaxCart.getCartState().cart.items;
    const hasSubscriptions = items.some((item) => item.selling_plan_allocation);
    if (hasSubscriptions) {
      this.removeSellingPlan(items);
      document.querySelector(".cart-subscribe__description").innerHTML= "Save 50% on your first order and 10% on all recurring orders when you subscribe to a monthly subscription of Pzaz for two or more months.";
    } else {
      this.addSellingPlan(items);
      document.querySelector(".cart-subscribe__description").innerHTML= "You're saving 50% on your order today by selecting a 2+ month subscription.";
    }
    event.target.classList.toggle("active");
  }

  addSellingPlan(items) {
    window.SUBSCRIBED = true;
    console.log("attempting to add a selling plan");
    this.querySelector(".sub-toggle").classList.add("active");
    const plan = 4053336307;
    const data = items.map((item, index) => {
      return {
        line: index + 1,
        quantity: item.quantity,
        selling_plan: plan,
      };
    });
    data.forEach((item, index) => {
      liquidAjaxCart.cartRequestChange(
        {
          line: item.line,
          quantity: item.quantity,
          selling_plan: item.selling_plan,
        },
        {
          newQueue: index == 0 ? true : false,
          lastComplete: (requestState) => {
            // if (index >= data.length - 1)
            //   this.querySelector(".sub-toggle").classList.add("active");

            // if (window.SUBSCRIBED) {
            //   document.querySelector('.cart-discount-message').innerHTML =
            //     'You are subscribed and will recieve 50% on this order and 10% on all future orders!';
            //   return;
            // }
          },
        }
      );
    });
    // console.log('data', data);
  }

  removeSellingPlan(items) {
    window.SUBSCRIBED = false;
    console.log("attempting to remove all items from selling plan");
    this.querySelector(".sub-toggle").classList.remove("active");
    const data = items.map((item, index) => {
      return {
        line: index + 1,
        quantity: item.quantity,
        selling_plan: "",
      };
    });
    data.forEach((item, index) => {
      liquidAjaxCart.cartRequestChange(
        {
          line: item.line,
          quantity: item.quantity,
          selling_plan: item.selling_plan,
        },
        {
          newQueue: index == 0 ? true : false,
          lastComplete: (requestState) => {
            // if (index >= data.length - 1)
            //   this.querySelector(".sub-toggle").classList.remove("active");

            // if (window.SUBSCRIBED) {
            //   document.querySelector('.cart-discount-message').innerHTML =
            //     'You are subscribed and will recieve 50% on this order and 10% on all future orders!';
            //   return;
            // }
          },
        }
      );
    });
    console.log("data", data);
  }
}
customElements.define("pzaz-cart", PzazCart);

document.getElementById("cart-close").addEventListener("click", function () {
  // if (templateName == 'product') {
  //   closeCart();
  // } else {
  //   window.location.href = '/products/pzaz-four-pack';
  // }
});

window.addEventListener("load", () => {
  if ("liquidAjaxCart" in window) {
    liquidAjaxCart.subscribeToCartAjaxRequests((data, resultFunction) => {
      resultFunction(handleAjaxResults);
    });
  } else {
    console.log("no liquidAjaxCart");
  }
  handleAjaxResults();
});

function handleAjaxResults() {
  const items = liquidAjaxCart.getCartState().cart.items;
  console.log("cart items", items);
  const item_count = liquidAjaxCart.getCartState().cart.item_count;
  if(item_count == 5){
    var free_gift = false;
    items.forEach((item) => {
      if (item.id == "43740474704115") {
        free_gift= true;
      }
    });
    if(free_gift == false ){
      addToCartItem(43740474704115, 1);
    }else{
      updateCartItem('43740474704115', 0);
    }
  }else if(item_count > 5){
    var free_gift = false;
    items.forEach((item) => {
      if (item.id == "43740474704115") {
        free_gift= true;
      }
    });
    if(free_gift == false ){
      console.log("item is more than 5 and there is no gift yet")
      addToCartItem(43740474704115, 1);
    }else{
      console.log("get here correctly")
    }
  }else{
    var free_gift = false;
    items.forEach((item) => {
      if (item.id == "43740474704115") {
        free_gift= true;
      }
    });
    if(free_gift == true ){
      updateCartItem('43740474704115', 0);
    }else{
      console.log("no gift here")
    }
  }
  animateCartSquares();
  updateDiscountMessage(items, tempDiscountData);
}

function updateDiscountMessage(items, data) {

  if (items.length == 0) {
    document.querySelector(".cart-discount-cta").style.display = "none";
    return;
  }
  if (window.SUBSCRIBED) {
    document.querySelector(".cart-discount-message").innerHTML =
      "You are subscribed and will recieve 50% on this order and 10% on all future orders!";
    return;
  }
  document.querySelector(".cart-discount-cta").style.display = "block";
  console.log("updating discount message");
  let count = 0;
  let message = "";
  items.forEach((item) => {
    let handle = item.handle;
    if (handle.includes("pzaz")) {
      count += item.quantity;
    }
  });
  if (count >= data.length) {
    message = data[data.length - 1].message;
  } else if (count <= 0) {
    message = data[0].message;
  } else {
    message = data.find((item) => item.count === count).message;
  }
  document.querySelector(".cart-discount-message").innerHTML = message;
  console.log("message", message);

  
 
}

function animateCartSquares() {
  if (!cartSquares) {
    let cartSquares = ArrayFromIds(cartSquareIds);
  }
  cartSquares.forEach((square) => {
    if (square.classList.contains("active")) return;
    square.classList.add("active");
    square.addEventListener("transitionend", (el) => {
      console.log("transition ended");
      el.target.classList.remove("active");
    });
  });
}
function updateCartItem(variantId, quantity){
 
  console.log("update new product here");
  let formData = {
    "id" : variantId,
    "quantity" : 0
  };
 
  console.log("update js go from here");
  fetch(window.Shopify.routes.root + "cart/change.js", {
    method: "POST",
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      refreshCart();
      //openCart();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function addToCartItem(variantId, quantity = 1) {
  console.log("additem==============");
  let formData = {
    items: [
      {
        id: variantId,
        quantity: 1
      },
    ],
  };
  fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      refreshCart();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function addToCart(variantId, quantity = 1) {
  if (!variantId) {
    variantId = this.updateSelectedVariantId();
  }

  let formData = {
    items: [
      {
        id: variantId,
        quantity: quantity,
        selling_plan: SUBSCRIBED ? 4053336307 : "",
      },
    ],
  };
  fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      refreshCart();
      openCart();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// [#card-icon-tl,
// #cart-icon-tc,
// #cart-icon-tr,
// #cart-icon-bl,
// #cart-icon-bc,
// #cart-icon-br]

// let cartToggle = document.querySelector(cartToggleClass);
// console.log(cartToggle);
// cartToggle.classList.add('cart-anim');
// cartToggle.addEventListener('transitionend', (el) => {
//   el.target.classList.remove('cart-anim');
//   // cartToggle.classList.remove('cart-anim');
//   console.log('animation ended');
// });
