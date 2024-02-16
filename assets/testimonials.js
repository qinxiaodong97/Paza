window.onload = InitTestimonialsEmbla;

function InitTestimonialsEmbla() {
  const emblaNode = document.querySelector(".testimonial .embla__viewport");
  const plugins = [EmblaCarouselAutoplay(), EmblaCarouselClassNames()];
  const options = {
    // align: "center",
    inViewThreshold: 1,
    loop: true,
    dragFree: true,
  };
  const testimonials = EmblaCarousel(emblaNode, options, plugins);
  // convertSlidesToToggles(testimonials);
}

// const convertSlidesToToggles = (embla) => {
//   embla.slideNodes().forEach((slide, index) => {
//     slide.addEventListener("click", () => {
//       embla.scrollTo(index);
//     });
//   });
// };
