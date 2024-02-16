const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');
const hash = '1EldeuKR_zW0oalo8ZDRdA';
const frameName = 'hero-frame';
let wrh = 4.24223602484472;
let canvasWidth, canvasHeight;
let heroFrameAnimationTimeline;
let frameAvailable = false;
let isMobile = false;
heroPadding = 36;
context.translate(0.5, 0.5);
context.fillStyle = 'white';

function setHeroCanvasSize() {
  if (isMobile) {
    canvasHeight = document.getElementById('hero-canvas-wrapper').clientHeight;
    canvasWidth = canvasHeight / wrh;
  } else {
    canvasWidth = document.getElementById('hero').clientWidth;
    canvasHeight = canvasWidth / wrh;
  }
  console.log('canvas width', canvas.width);
  console.log('canvas height', canvas.height);
  console.log('mobile view active: ', isMobile);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  if (!frameAvailable) {
    console.log('frame not available');
    return;
  }

  render();
  console.log('hero canvas size set');
}

function handleHeroResize() {
  if (window.innerWidth < 768) {
    isMobile = true;
  } else {
    isMobile = false;
  }
  setHeroCanvasSize();
}

const frameCount = 70;
const currentFrame = (index) =>
  `https://imagedelivery.net/${hash}/${frameName}-${index}/public`;

const images = [];
const frameIndex = {
  frame: 0,
};

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Get first image and set canvas height using image aspect (WORKS BC ALL IMAGES ARE SAME SIZE)
//Once the first image is loaded, set the canvas size to the image size and get the width/height ratio
images[0].onload = (event) => {
  // console.log("first image loaded", event.target.width, event.target.height)
  frameAvailable = true;
  wrh = event.target.width / event.target.height;
  setHeroCanvasSize();
};

function initHeroCanvas() {
  let heroIdle = gsap
    .timeline({
      defaults: { duration: 1 },
    })
    .fromTo(
      canvas,
      {
        rotate: -5,
      },
      {
        rotate: 5,
        duration: 3.3,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      }
    )
    .fromTo(
      canvas,
      {
        scale: 0.95,
        y: 25,
      },
      {
        scale: 1,
        y: 0,
        duration: 3.7,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      },
      '<'
    );
  //UNCOMMENT TO ADD SCROLL TRIGGER
  let heroTimeline = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
      pin: true,
      pinSpacing: true,
      // markers: true,
      anticipatePin: 1,
    },
  });
  heroTimeline.to(frameIndex, {
    frame: frameCount - 1,
    snap: 'frame',
    ease: 'none',
    onUpdate: render,
  });
  // heroTimeline.to(
  //   ["#hero-canvas-wrapper", "#scroll-cta"],
  //   {
  //     y: 100,
  //   },
  //   "<"
  // );
  let mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    heroTimeline.to(
      ['#hero-canvas-wrapper', '#scroll-cta'],
      {
        y: 100,
      },
      '<'
    );
  });

  mm.add('(max-width: 767px)', () => {
    heroTimeline
      .to(
        '#hero-canvas-wrapper',
        {
          scale: 1.2,
          y: -32,
        },
        '<'
      )
      .to(
        '#scroll-cta',
        {
          scale: 1.1,
          y: 32,
        },
        '<'
      );
  });
}

function render() {
  let curImage = images[frameIndex.frame];
  context.clearRect(0, 0, canvas.width, canvas.height);
  // context.fillStyle = "white";
  // context.fillRect(0, 0, canvas.width, canvas.height);
  // context.rotate(Math.PI);

  if (isMobile) {
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((-90 * Math.PI) / 180);
    context.drawImage(
      curImage,
      -canvas.height / 2,
      -canvas.width / 2,
      canvas.height,
      canvas.width
    );
    context.restore();
    return;
  }
  context.drawImage(curImage, 0, 0, canvas.width, canvas.height);
}

// function render() {
//   context.fillStyle = "white";
//   context.fillRect(0, 0, canvas.width, canvas.height);
//   console.log("canvas rendered");
// }
handleHeroResize();
initHeroCanvas();
console.log('check if throttle is available', throttle);

window.addEventListener('resize', throttle(handleHeroResize, 100));
