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
    }
  
    onVariantChange() {
      this.getVariantData();
      this.updateSelectedVariantId();
      this.updateVariantDescription();
      this.updateQuantityDisplay();
      this.updateVariantMedia();
    }
  
    getVariantData() {
      this.variantData =
        this.variantData ||
        JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
  
    getSelectedVariant() {
      let selectedVariant = [...this.querySelectorAll("[type ='radio']")].find(
        (input) => {
          return input.checked === true;
        }
      );
      return selectedVariant;
    }
  
    updateSelectedVariantId() {
      this.selectedVariantId = this.getSelectedVariant().value;
      var variant_price = "$" + this.getSelectedVariant().dataset.price / 100;
      var variant_avalible = this.getSelectedVariant().dataset.available;
      if(variant_avalible == 'false' ) {
        document.querySelector('.product-submit').innerHTML = "SOLD OUT";
        document.querySelector('.product-submit').classList.add("soldout");
      }else {
        document.querySelector('.product-submit').classList.remove("soldout");
        document.querySelector('.product-submit').innerHTML = "<p class='product-price'>"+ variant_price +"</p><p>Add to cart </p>";
      }
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
    }
  
    updateQuantityDisplay() {
      let quantity = this.getSelectedVariant().dataset.quantity;
      let elem = document.querySelector(".product-quantity-text");
      if (!elem) {
        console.log("cant access product quantity");
        return;
      }
      document.querySelectorAll(".product-quantity-text").forEach((elem) => {
        elem.innerText = quantity;
      });
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
        });
      } else {
        submitButtons.forEach((button) => {
          button.disabled = false;
          button.classList.remove("hidden");
        });
      }
    }
  
    updateVariantMedia() {
      let variantId = this.updateSelectedVariantId();
      let data = this.getVariantData();
      let elements = [...document.querySelectorAll(".product-image")];
      if (!elements) {
        console.log("cant access product images");
        return;
      }
      elements.forEach((element) => {
        if (variantId == element.dataset.id) {
          element.dataset.shown = true;
        } else {
          element.dataset.shown = false;
        }
      });

      let tryothers = [...document.querySelectorAll(".try-other-item")];
      if (!elements) {
        console.log("cant access product images");
        return;
      }else{
        tryothers.forEach((element) => {
          if (variantId == element.dataset.id) {
            element.classList.add('hidden');
          } else {
            element.classList.remove('hidden');
          }
        });
      }
      
      
      let banners = [...document.querySelectorAll(".product-image-top")];
      if (!banners) {
        console.log("cant access banner content");
        return;
      }
      banners.forEach((element) => {
        if (variantId == element.dataset.id) {
          element.dataset.shown = true;
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
      document.querySelector('.sticky-submit-wrapper').dataset.variant = variant.title.toLowerCase().replace(" ", "-");
      if(variant.available){
        document.querySelector('.sticky-submit-wrapper .sticky-product-submit').classList.remove('soldout');
        document.querySelector('.sticky-submit-wrapper .sticky-product-submit').innerHTML = 'Add to Cart'
      }else{
        document.querySelector('.sticky-submit-wrapper .sticky-product-submit').classList.add('soldout');
        document.querySelector('.sticky-submit-wrapper .sticky-product-submit').innerHTML = 'Sold Out'
      }
      stickyVariant.innerText = variant.title;
      [...document.querySelectorAll("[data-variant]")].forEach((el) => {
        el.dataset.variant = variant.title.toLowerCase().replace(" ", "-");
        console.log(el.dataset.variant);
      });
    }
  
    onSubmit(event) {
      event.preventDefault();
      let variant = this.getSelectedVariant();
      if (!variant) {
        console.log("no variant selected");
        return;
      }
  
      // this.getVariantData();
      this.addToCart(variant.dataset.id, parseInt(variant.dataset.quantity));
      // console.log(' 5) Handled submit: added item to cart + opened drawer ');
    }
    addToCart(variantId, quantity = 1) {
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
          this.updateQuantityDisplay();
          refreshCart();
          openCart();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  
    changeQuantity = (event) => {
      let currentQuantity = parseInt(this.getSelectedVariant().dataset.quantity);
      event.currentTarget.dataset.type === "add"
        ? currentQuantity++
        : currentQuantity--;
      this.getSelectedVariant().dataset.quantity =
        currentQuantity <= 1 ? 1 : currentQuantity;
      this.updateQuantityDisplay();
    };
  }
  customElements.define("variant-selector", VariantSelector);
  
  //Create intersection onbserver to check if we scrolled past the checkout button
  const submitButton = document.querySelector(".submit-wrapper");
  var stickbar = document.querySelector('.sticky-submit-wrapper');
  

  document.addEventListener("scroll", (event) => {
    lastKnownScrollPosition = window.scrollY;
    var postion = document.querySelector(".product-page").getBoundingClientRect().top;
    var height = document.querySelector(".product-page").getBoundingClientRect().height;
    if(postion < (0 - height)){
      document.querySelector(".header").classList.add("active");
            let el = document.querySelector(".sticky-submit-wrapper");
            setTimeout(() => {
              el.classList.add("active");
            }, 50);
    }else{
      document.querySelector(".header").classList.remove("active");
      let el = document.querySelector(".sticky-submit-wrapper");
      setTimeout(() => {
        el.classList.remove("active");
      }, 50);
    }
   
  });

  // if(stickbar){
  //   const checkoutObserver = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         document.querySelector(".header").classList.remove("active");
  //         document
  //           .querySelector(".sticky-submit-wrapper")
  //           .classList.remove("active");
  //       } else {
  //         var scrollBarPosition = window.pageYOffset | document.body.scrollTop;
  //         console.log(scrollBarPosition);
  //         let elementBottom = entry.boundingClientRect.bottom;
  //         console.log(elementBottom);
  //         console.log(window.scrollY);
  //         if (window.scrollY > elementBottom) {
  //           document.querySelector(".header").classList.add("active");
  //           let el = document.querySelector(".sticky-submit-wrapper");
  //           setTimeout(() => {
  //             el.classList.add("active");
  //           }, 50);
  //         }else{
  //           document.querySelector(".header").classList.remove("active");
  //           let el = document.querySelector(".sticky-submit-wrapper");
  //           setTimeout(() => {
  //             el.classList.remove("active");
  //           }, 50);
  //         }
  //       }
  //     });
  //   });
  //   checkoutObserver.observe(submitButton);
  //   let StickyVariantButton = document.querySelector(".sticky-variant-title");
  //   if (!StickyVariantButton) {
  //     ("cant access sticky variant button");
  //   } else {
  //     StickyVariantButton.addEventListener("click", function () {
  //       window.scrollTo(0, 0);
  //     });
  //   }
  // }
  
  

  document.querySelectorAll(".try-variant-btn").forEach((item) => {
    item.addEventListener("click", function () {
      let id = item.getAttribute("data-id");
      addToCart(id);
      openCart();
      refreshCart();
    });
  });
  