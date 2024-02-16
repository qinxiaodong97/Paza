function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

let addButtons = [...document.querySelectorAll("[data-action=add]")];
let removeButtons = [...document.querySelectorAll("[data-action=subtract]")];

if (addButtons) {
  addButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      AddToCart(event.currentTarget.dataset.id);
    });
  });
}
if (removeButtons) {
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      SubtractFromCart(event.currentTarget.dataset.id);
    });
  });
}

function AddToCart(id) {
  liquidAjaxCart.cartRequestAdd(
    {
      items: [
        {
          id: id,
          quantity: 1,
          selling_plan: SUBSCRIBED ? 3532390643 : "",
        },
      ],
    },
    { newQueue: true }
  );
}

function SubtractFromCart(id) {
  let items = liquidAjaxCart.getCartState().cart.items;
  let line_item = items.find((item) => {
    return item.id == event.currentTarget.dataset.id;
  });

  let quantity = line_item ? line_item.quantity - 1 : 0;
  liquidAjaxCart.cartRequestChange(
    {
      id: id,
      quantity: quantity,
    },
    { newQueue: true }
  );
}

function updateVariantCount(items) {
  const variants = [...document.querySelectorAll(".variant")];
  if (!variants) {
    console.log("cant access product variant selectors");
    return;
  }
  let data = items.map((item) => {
    return {
      id: item.id,
      quantity: item.quantity,
    };
  });
  variants.forEach((variant) => {
    let match = data.find((item) => {
      return item.id == variant.dataset.id;
    });

    if (match) {
      variant.querySelector(".variant__quantity").innerText = match.quantity;
      variant.dataset.quantity = match.quantity;
      return;
    }

    variant.querySelector(".variant__quantity").innerText = 0;
    variant.dataset.quantity = 0;
  });
}

function updateDiscountMessage(items, data) {
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
  document.querySelector(".discount-message__text").innerText = message;
  console.log("message", message);
}

//Submit button goes to cart (were not actually adding to cart here)
document.getElementById("product-submit").addEventListener("click", () => {
  openCart();
});

function handleAjaxResults() {
  const cart = liquidAjaxCart.getCartState().cart;
  console.log("cart", cart);
  console.log("cart items", cart.items);

  cart.items.forEach((item) => {
    console.log("product", item.variant);
  });

  updateVariantCount(cart.items);
  updateDiscountMessage(cart.items, window.DISCOUNT_DATA);
}

document.querySelectorAll(".accordion-item").forEach((item) => {
  item.addEventListener("click", (event) => {
    document.querySelectorAll(".accordion-item").forEach((item) => {
      if (item !== event.currentTarget) {
        item.classList.remove("active");
      }
    });
    event.currentTarget.classList.toggle("active");
  });
});

const emblaNode = document.querySelector(".product .embla__viewport");
const emblaoptions = {
  align: "center",
  inViewThreshold: 1,
  loop: false,
};

const productEmbla = EmblaCarousel(emblaNode, emblaoptions);
function initEmblaVariantToggles() {
  [...document.querySelectorAll(".variant")].forEach((variant, index) => {
    variant.addEventListener("click", () => {
      productEmbla.scrollTo(index);
    });
  });
}

window.addEventListener("load", () => {
  if ("liquidAjaxCart" in window) {
    liquidAjaxCart.subscribeToCartAjaxRequests((data, resultFunction) => {
      resultFunction(handleAjaxResults);
    });
  } else {
    console.log("no liquidAjaxCart");
  }
  initEmblaVariantToggles();
  const cart = liquidAjaxCart.getCartState().cart;
  updateDiscountMessage(cart.items, window.DISCOUNT_DATA);
});
