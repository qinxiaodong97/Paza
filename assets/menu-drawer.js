function handleMenu() {
  console.log("Menu Toggle Clicked");
}

class MenuDrawer extends HTMLElement {
  constructor() {
    super();
    console.log("Menu Drawer Constructor");
    // this.toggle = document.querySelector(".menu-toggle");
    // if (this.toggle) {
    //   this.toggle.addEventListener("click", this.toggleMenu.bind(this));
    // }
  }

  getMenuDrawer() {
    return this.menuDrawer || document.querySelector(".menu-drawer");
  }

  // toggleMenu() {
  //   console.log('Menu Toggle Clicked');
  //   this.menuDrawer = this.getMenuDrawer();
  //   if (!this.menuDrawer) {
  //     console.log('no menu drawer');
  //     return;
  //   }
  //   if (this.menuDrawer.classList.contains('active')) {
  //     this.menuDrawer.classList.remove('active');
  //     document.querySelector('.cart-overlay').classList.remove('active');
  //   } else {
  //     this.menuDrawer.classList.add('active');
  //     document.querySelector('.cart-overlay').classList.add('active');
  //   }
  // }
}

customElements.define("menu-drawer", MenuDrawer);
