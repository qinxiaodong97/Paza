window.addEventListener("load", init);
// document.addEventListener('DOMContentLoaded', init);
gsap.registerPlugin(ScrollTrigger);
function init() {
  AnimateHero();
  AnimateCartButton();
}

function AnimateHero() {
  // const introSequence = gsap.timeline({
  //   defaults: { duration: 1 },
  // });
  // introSequence.from('.header__logo', {
  //   y: 100,
  //   autoAlpha: 0,
  //   ease: 'power4.out',
  //   stagger: 0.2,
  //   onStart() {
  //     document.querySelectorAll('.hero').classList.add('hero--active');
  //   },
  // });

  [
    ...document.querySelectorAll(".hero__content, .header__logo, .cart-toggle"),
  ].forEach((item) => item.classList.add("active"));
}

function AnimateCartButton() {
  const cartTimeline = gsap.timeline({
    defaults: { duration: 0.5 },
    scrollTrigger: {
      trigger: [".power"],
      start: "top bottom",
      toggleActions: "play none play reverse",
    },
  });
  cartTimeline
    .to(".cart-toggle", {
      fill: "white",
    })
    .to(
      ".cart-toggle__quantity",
      {
        css: {
          backgroundColor: "black",
          borderColor: "white",
          color: "white",
          filter: "drop-shadow(2px 1px 0px white)",
        },
      },
      "<"
    )
    .to(
      ".cart-icon-secondary",
      {
        css: {
          fill: "black",
        },
      },
      "<"
    );
}
