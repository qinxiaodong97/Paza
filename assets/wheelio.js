const wheelio = '.trigger-button-holder';
const footerContainer = document.querySelector('.footer-button-wrapper');

waitForElm('.trigger-button-holder').then((elm) => {
  addWheelio();
  document.querySelectorAll('.pz_wheelio').forEach((elm) => {
    elm.addEventListener('click', () => {
      document.querySelector('.trigger-button-holder').click();
    });
  });
});

// function initWheelioButton() {
//   ScrollTrigger.create({
//     trigger: 'footer',
//     start: 'top bottom',
//     onEnter: addWheelio,
//     onLeaveBack: removeWheelio,
//   });
// }

function addWheelio() {
  const button = document.querySelector(wheelio);
  button.setAttribute(
    'style',
    'position:static; top:0 !important; left:50% !important; display:block;'
  );
  // button.setAttribute(
  //   "style",
  //   "position:absolute; top:0 !important; left:50% !important; display:block; transform:translate(-50%,0)"
  // );
  document
    .getElementById('wlo-trigger-image')
    .setAttribute('style', 'background-size: 240px !important;');
  document
    .getElementById('wlo-trigger-button')
    .setAttribute(
      'style',
      'width: 240px !important; height: 50px !important; margin-left: 0px !important;'
    );
  footerContainer.appendChild(button);
}

function removeWheelio() {
  const button = document.querySelector(wheelio);
  button.setAttribute(
    'style',
    `position:fixed; top:""; left:""; display:""; transform: "";`
  );
  document
    .getElementById('wlo-trigger-image')
    .setAttribute('style', "background-size:''");
  document
    .getElementById('wlo-trigger-button')
    .setAttribute('style', "width: ''; height: '';");
}

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
