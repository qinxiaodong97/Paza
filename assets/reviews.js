let reviewsEmbla;

function InitReviewsEmbla() {
  const emblaNode = document.querySelector(".reviews__carousel.embla");
  const plugins = [EmblaCarouselAutoplay(), EmblaCarouselClassNames()];
  const options = {
    align: "center",
    inViewThreshold: 1,
    loop: true,
  };
  reviewsEmbla = EmblaCarousel(emblaNode, options, plugins);
}

window.addEventListener("load", InitReviewsEmbla);

// window.addEventListener('load', () => {
//   gsap.to('.locator-cta img', {
//     scrollTrigger: {
//       trigger: '.locator-cta',
//       start: 'top bottom',
//       scrub: 0.5,
//       onEnter: () => console.log('onEnter'),
//       onLeave: () => console.log('onLeave'),
//     },
//     y: '-200px',
//     ease: 'none',
//   });
// });
