class VariantSelector extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange.bind(this));
    [...this.querySelectorAll('[type="submit"]')].forEach((button) =>
      button.addEventListener("click", this.onSubmit.bind(this))
    );
    [...this.querySelectorAll("[data-type]")].forEach((el) =>
      el.addEventListener("click", this.changeQuantity.bind(this))
    );
    // console.log('Variant Selector Initialized');
  }

  onVariantChange() {
    // console.log('variant changed!!!');
    this.getVariantData();
    this.updateSelectedVariantId();
    this.updateVariantDescription();
    this.updateQuantityInput();
    this.updateVariantMedia();
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    // console.log('1) variant data retrieved: ', this.variantData);
    return this.variantData;
  }

  getSelectedVariant() {
    let selectedVariant = [...this.querySelectorAll("[type ='radio']")].find(
      (input) => {
        return input.checked === true;
      }
    );
    // console.log('2) get the currently selected variant: ', selectedVariant);
    return selectedVariant;
  }

  updateSelectedVariantId() {
    this.selectedVariantId = this.getSelectedVariant().value;
    // console.log('3) updated selected variant id: ', this.selectedVariantId);
    return this.selectedVariantId;
  }

  updateVariantDescription() {
    let variantDescription = this.querySelector(".variant-description");
    let descriptions = window.variantDescriptions;

    if (!variantDescription) {
      console.log('no element with class "variant-description" found');
      return;
    } else if (!descriptions) {
      console.log("no descriptions array set to window: check product.liquid");
      return;
    }
    let description = descriptions[this.selectedVariantId];
    variantDescription.innerHTML = description;
    // console.log('4) update variant description: ', description);
  }

  updateVariantQuantities(items) {
    let variants = [...this.querySelectorAll("[type ='radio']")];
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
        variant.dataset.quantity = match.quantity;
        return;
      }
      variant.dataset.quantity = 0;
    });
  }

  updateQuantityInput() {
    let quantity = this.getSelectedVariant().dataset.quantity;
    let elem = document.querySelector(".product-quantity-text");
    if (!elem) {
      console.log("cant access product quantity");
      return;
    }
    document.querySelectorAll(".product-quantity-text").forEach((elem) => {
      elem.innerText = quantity;
    });
    this.disableInputs(quantity);
  }

  disableInputs(quantity) {
    let inputs = [...this.querySelectorAll("[data-type]")];
    let container = document.querySelector(".product-quantity");
    if (!inputs) {
      console.log("cant access product quantity");
      return;
    }

    if (quantity == 0) {
      inputs.forEach((input) => {
        input.disabled = true;
        input.closest(".product-quantity").classList.add("hidden");
      });
    } else {
      inputs.forEach((input) => {
        input.disabled = false;
        input.closest(".product-quantity").classList.remove("hidden");
      });
    }

    let submitButtons = [...this.querySelectorAll('[type="submit"]')];
    if (submitButtons.length < 1) {
      console.log("cant access product quantity");
      return;
    }

    if (quantity > 0) {
      submitButtons.forEach((button) => {
        button.disabled = true;
        button.classList.add("hidden");
        // console.log('submit button disabled');
      });
    } else {
      submitButtons.forEach((button) => {
        button.disabled = false;
        button.classList.remove("hidden");
        // console.log('submit button enabled');
      });
    }
  }

  updateVariantMedia() {
    // console.log('attempting to update variant media');
    let variantId = this.updateSelectedVariantId();
    let data = this.getVariantData();
    let elements = [...document.querySelectorAll(".product-image")];
    if (!elements) {
      console.log("cant access product images");
      return;
    }
    elements.forEach((element) => {
      if (variantId == element.dataset.id) {
        // console.log('showing element', element);
        element.dataset.shown = true;
        // element.classList.remove('hidden');
        // element.classList.add('active');
      } else {
        element.dataset.shown = false;
      }
    });

    let stickyVariant = document.querySelector(".sticky-variant-title");
    if (!stickyVariant) {
      console.log("cant access product sticky header variant text");
      return;
    }

    let variant = data.find((variant) => {
      return variant.id == variantId;
    });
    stickyVariant.innerText = variant.title;
    [...document.querySelectorAll("[data-variant]")].forEach((el) => {
      el.dataset.variant = variant.title.toLowerCase().replace(" ", "-");
      console.log(el.dataset.variant);
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.getVariantData();
    this.addToCart(this.selectedVariantId);

    // console.log(' 5) Handled submit: added item to cart + opened drawer ');
  }

  addToCart(variantId, quantity = 1) {
    if (!variantId) {
      variantId = this.updateSelectedVariantId();
    }

    // console.log('6) VARIANT TO ADD TO CART', variantId, quantity);

    let formData = {
      items: [
        {
          id: variantId,
          quantity: quantity,
          selling_plan: SUBSCRIBED ? 3532390643 : "",
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
        this.updateVariantQuantities(data.items);
        this.updateQuantityInput();
        refreshCart();
        openCart();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  changeQuantity = (event) => {
    let currentQuantity = parseInt(this.getSelectedVariant().dataset.quantity);
    let variantId = this.updateSelectedVariantId();
    let action = event.currentTarget.dataset.type;
    console.log(action);
    let formData = {
      id: variantId,
      quantity: action === "add" ? currentQuantity + 1 : currentQuantity - 1,
    };
    fetch(window.Shopify.routes.root + "cart/change.js", {
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
  };
}

customElements.define("variant-selector", VariantSelector);

//Create intersection onbserver to check if we scrolled past the checkout button
const submitButton = document.querySelector(".submit-wrapper");
const checkoutObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document.querySelector(".header").classList.remove("hide");
      document
        .querySelector(".sticky-submit-wrapper")
        .classList.remove("active");
    } else {
      let elementBottom = entry.boundingClientRect.bottom;
      if (window.scrollY > elementBottom) {
        document.querySelector(".header").classList.add("hide");
        // console.log('scrolled past element');
        let el = document.querySelector(".sticky-submit-wrapper");
        setTimeout(() => {
          el.classList.add("active");
        }, 50);
      }
    }
  });
});

checkoutObserver.observe(submitButton);
let StickyVariantButton = document.querySelector(".sticky-variant-title");
if (!StickyVariantButton) {
  ("cant access sticky variant button");
} else {
  StickyVariantButton.addEventListener("click", function () {
    window.scrollTo(0, 0);
  });
}
