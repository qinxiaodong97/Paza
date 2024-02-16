window.addEventListener("load", function () {
  InitProductCardsEmbla();
});

let cardsEmbla;

function InitProductCardsEmbla() {
  const emblaNode = document.querySelector(".cards .embla__viewport ");
  const plugins = [EmblaCarouselClassNames()];
  const options = {
    inViewThreshold: 1,
    startIndex: 1,
    align: "center",
    // containScroll: 'trimSnaps',
  };
  cardsEmbla = EmblaCarousel(emblaNode, options, plugins);
  convertSlidesToToggles(cardsEmbla);
}

const convertSlidesToToggles = (embla) => {
  embla.slideNodes().forEach((slide, index) => {
    slide.addEventListener("click", () => {
      embla.scrollTo(index);
    });
  });
};

// window.addEventListener('resize', () => {
//   console.log(cardsEmbla);
//   cardsEmbla.scrollTo(1);
//   cardsEmbla.reInit();
// });

// createEmblaToggles(cardsEmbla, ".card__toggle");
// cardsEmbla.on("select", onSelect);
// [...document.querySelectorAll(".card__toggle")][1].dataset.active = true;

// const onSelect = (event) => {
//   let slides = [...document.querySelectorAll(".cards .embla__slide")];
//   slides.forEach((slide, index) => {
//     if (slide.classList.contains("is-selected")) {
//       [...document.querySelectorAll(`.card__toggle`)].forEach((node) => {
//         node.dataset.active = false;
//       });
//       [...document.querySelectorAll(`.card__toggle`)][
//         index
//       ].dataset.active = true;
//     }
//   });
// };

// const createEmblaToggles = (embla, selector) => {
//   [...document.querySelectorAll(`${selector}`)].forEach((node, index) => {
//     node.addEventListener("click", (event) => {
//       embla.scrollTo(index);
//       [...document.querySelectorAll(`${selector}`)].forEach((node) => {
//         node.dataset.active = false;
//       });
//       event.currentTarget.dataset.active = true;
//     });
//   });
// };
