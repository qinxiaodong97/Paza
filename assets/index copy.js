gsap.registerPlugin(ScrollTrigger);

function AnimateHero() {
  //here we change the background color on scroll
  gsap.to(".hero-section", {
    scrollTrigger: {
      trigger: ".power",
      start: "start bottom",
      toggleActions: "play none none reverse",
      pin: false,
      onEnter: () => {
        document.getElementById("background").dataset.color = "dark";
        document.querySelector(".cart-toggle").dataset.color = "dark";
      },
      onLeaveBack: () => {
        document.getElementById("background").dataset.color = "primary";
        document.querySelector(".cart-toggle").dataset.color = "primary";
      },
    },
    duration: 0.3,
  });
}

function initLightSectionAnimations() {
  const light = document.getElementById("light-section");
  const tl = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: light,
      start: "top bottom",
      end: "center top",
      scrub: true,
      toggleActions: "play none none reverse",
    },
  });
  ScrollTrigger.create({
    trigger: light,
    start: "top 20%",
    end: "bottom top",
    toggleActions: "play none none reverse",
    onEnter: () => {
      document.querySelector(".cart-toggle").dataset.color = "primary";
    },
    onLeaveBack: () => {
      document.querySelector(".cart-toggle").dataset.color = "dark";
    },
    onLeave: () => {
      document.querySelector(".cart-toggle").dataset.color = "dark";
    },
    onEnterBack: () => {
      document.querySelector(".cart-toggle").dataset.color = "primary";
    },
  });
  tl.from(light, {
    y: -50,
    transform: "scale(0.9)",
    ease: "power2.out",
  });

  gsap.from("#flavor-cards", {
    opacity: 0,
    duration: 0.3,
    scrollTrigger: {
      trigger: "#flavor-cards",
      start: "center 80%",
      end: "bottom 80%",
    },
    onStart: () => {
      cardsEmbla.reInit();
      reviewsEmbla.reInit();
    },
  });
}

function initPowerAnimations() {
  const powerItems = gsap.utils.toArray(".power__item");
  let powerTl;

  // create
  let mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    powerTl = gsap.timeline({
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: ".power__col--left",
        endTrigger: ".power__col--right",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: true,
        // markers: true,
        pinSpacing: true,
        toggleActions: "play none none reverse",
      },
    });

    powerItems.forEach((item, index) => {
      gsap.from(item, {
        y: 100,
        x: 200,
        opacity: 0,
        scale: 0.6,
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
          scrub: 1.5,
        },
      });
    });
  });

  mm.add("(max-width: 767px)", () => {
    powerTl = gsap.timeline({
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: ".power",
        start: "top top",
        end: "bottom+=2000 center",
        scrub: true,
        pin: true,
        // markers: true,
        toggleActions: "play none none reverse",
      },
    });

    powerItems.forEach((item, index) => {
      powerTl
        .fromTo(
          item,
          {
            y: 100,
            opacity: 0,
            scale: 0.6,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
          }
        )
        .to(item, {
          y: -100,
          opacity: 0,
          scale: 0.6,
        });
    });
  });

  // later, if we need to revert all the animations/ScrollTriggers...
  // mm.revert();
}

function initPressAnimations() {
  let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter(".press__item", "skewY", "deg"), // fast
    clamp = gsap.utils.clamp(-20, 20); // don't let the skew go beyond 20 degrees.

  ScrollTrigger.create({
    onUpdate: (self) => {
      let skew = clamp(self.getVelocity() / -300);
      // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: "power3",
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew),
        });
      }
    },
  });

  // make the right edge "stick" to the scroll bar. force3D: true improves performance
  gsap.set(".press__item", {
    transformOrigin: "center center",
    force3D: true,
  });
}

function initFocusAnimations() {
  const content = document.querySelector(".focus__container");

  const tl = gsap
    .timeline({
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: content,
        start: "center center",
        end: "+=1000 center",
        pin: true,
        scrub: true,
        anticipatePin: 0.7,
        pinSpacing: true,
        toggleActions: "play none none reverse",
      },
    })
    .to(
      ".focus__image:last-child",
      {
        y: "-100%",
      },
      "<"
    )
    .fromTo(
      ".focus__image:first-child",
      {
        y: "100%",
      },
      {
        y: 0,
      },
      "<"
    )
    .to(".focus__text:first-child", {
      opacity: 0,

      y: "-100%",
    })
    .fromTo(
      ".focus__text:last-child",
      {
        opacity: 0,
        y: "100%",
      },
      {
        opacity: 1,
        y: 0,
      },
      "<"
    );
}

function initPhrasesAnimations() {
  const phrasesLeft = document.querySelectorAll(".phrases__no");
  const phrasesRight = document.querySelectorAll(".phrases__subject");

  tl = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: ".phrases",
      start: "center bottom",
      end: "center center",
      scrub: true,
      toggleActions: "play none none reverse",
    },
  });

  tl.from(phrasesLeft, {
    x: -200,
    stagger: 0.5,
    opacity: 0,
    ease: "power2.out",
  });
  tl.from(
    phrasesRight,
    {
      x: 300,
      stagger: 0.5,
      opacity: 0,
      ease: "power2.out",
    },
    "<+=0.5"
  );
}

function initMapAnimations() {
  const markers = gsap.utils.toArray(".map-marker");
  const map = document.querySelector(".map-cta__image");

  tl = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: ".map-cta__image",
      start: "top bottom",
      toggleActions: "play none none reverse",
      // markers: true,
    },
  });

  tl.from(markers, {
    y: 20,
    stagger: 1 / 50,
    opacity: 0,
    ease: "power2.out",
  });
}

AnimateHero();
initPowerAnimations();
// initPressAnimations();
initFocusAnimations();
initPhrasesAnimations();
initLightSectionAnimations();
initMapAnimations();
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
  console.log("refreshed");
});
