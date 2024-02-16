const dcanvas = document.getElementById('diagram-canvas');
const dcontainer = document.querySelector('.diagram__content');
const dcontext = dcanvas.getContext('2d');
const dhash = '1EldeuKR_zW0oalo8ZDRdA';
const dframeName = 'diagram-frame';
let dwrh = null;
heroPadding = 20;
dcanvas.width = dcontainer.offsetWidth;

// Create a circular clipping path
// dcontext.translate(window.innerWidth / 2, window.innerHeight / 2);

// draw background
const lingrad = dcontext.createRadialGradient(
  dcanvas.width / 2,
  dcanvas.height / 2,
  0,
  dcanvas.width / 2,
  dcanvas.height / 2,
  dcanvas.width / 2
);
lingrad.addColorStop(0, 'transparent');
lingrad.addColorStop(0.75, 'rgba(16,16,16)');

dcontext.fillStyle = lingrad;
// dcontext.fillRect(-75, -75, 150, 150);

const dframeCount = 97;
const dcurrentFrame = (index) =>
  `https://imagedelivery.net/${dhash}/${dframeName}-${index}/large`;

const dimages = [];
const spray = {
  frame: 0,
};

for (let i = 0; i < dframeCount; i++) {
  const img = new Image();
  img.src = dcurrentFrame(i);
  dimages.push(img);
}

// Get first image and set canvas height using image aspect (WORKS BC ALL IMAGES ARE SAME SIZE)

dimages[0].onload = (event) => {
  // console.log("first image loaded", event.target.width, event.target.height);
  dwrh = event.target.width / event.target.height;
  // dcanvas.height = (dcanvas.width/2) / dwrh;
  initDiagramCanvas();
};

//Once the first image is loaded, set the canvas size to the image size and get the width/height ratio

function initDiagramCanvas() {
  let diagramTimeline = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: '.dtest',
      start: 'top top',
      end: '+=2000',
      pinSpacing: true,
      scrub: 1,
      pin: true,
      // markers: true,
    },
  });

  diagramTimeline
    .to(spray, {
      frame: dframeCount - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: renderd,
    })
    .from(
      '.diagram__card',
      {
        opacity: 0,
        scale: 0.1,
        duration: 0.2,
        stagger: {
          amount: 0.5,
        },
      },
      '<0.2'
    );
}

function renderd() {
  console.log('renderd');
  let curImage = dimages[spray.frame];
  // dcontext.clearRect(0, 0, dcanvas.width, dcanvas.height);
  dcontext.beginPath();
  dcontext.arc(
    dcanvas.width / 2,
    dcanvas.height / 2,
    window.innerWidth / 2 - 100,
    0,
    Math.PI * 2,
    true
  );
  dcontext.clip();
  dcontext.fillRect(0, 0, dcanvas.width, dcanvas.height);
  dcontext.drawImage(
    curImage,
    0,
    -(dcanvas.width / dwrh) / 2 + dcanvas.height / 2,
    dcanvas.width,
    dcanvas.width / dwrh
  );
}

window.addEventListener('resize', () => {
  dcanvas.width = dcontainer.offsetWidth;
  const lingrad = dcontext.createRadialGradient(
    dcanvas.width / 2,
    dcanvas.height / 2,
    0,
    dcanvas.width / 2,
    dcanvas.height / 2,
    dcanvas.width / 2
  );
  lingrad.addColorStop(0, 'transparent');
  lingrad.addColorStop(1, 'rgba(16,16,16,1)');

  dcontext.fillStyle = lingrad;
  renderd();
  // dcanvas.height = dcontainer.offsetHeight;
});

// function renderd() {
//   console.log('renderd');
//   let curImage = dimages[spray.frame];
//   // dcontext.clearRect(0, 0, dcanvas.width, dcanvas.height);
//   dcontext.drawImage(
//     curImage,
//     0,
//     -(dcanvas.width / dwrh) / 2 + dcanvas.height / 2,
//     dcanvas.width,
//     dcanvas.width / dwrh
//   );
// }

// window.addEventListener('resize', () => {
//   dcanvas.width = dcontainer.offsetWidth;
//   renderd();
//   // dcanvas.height = dcontainer.offsetHeight;
// });
