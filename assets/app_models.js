import * as THREE from 'three';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const NUM_PARTICLES = 500;
let camera, scene, renderer, axesHelper, line;
let cube, particles;
let tube;

let isSpraying = false;
let emit = 3;

const cursor = {
  x: 0,
  y: 0,
};
let cursorQuaternion = new THREE.Quaternion();
let cursorPoint = new THREE.Vector3();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.getElementById('canvas');
const debug = false;

function init() {
  //*SCENE (1)
  scene = new THREE.Scene();

  //* RENDERER (2)
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //* CAMERA (3)
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 8);

  //* HANDLE MODEL

  const loader = new GLTFLoader();
  loader.load(
    'assets/tube012323.glb',
    function (gltf) {
      console.log(gltf);
      const children = gltf.scene.children;
      const mesh = children[0];
      mesh.material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
      });

      tube = gltf.scene;
      scene.add(gltf.scene);
      console.log(scene);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  //* ADD LIGHTS
  const pointLight = new THREE.PointLight(0xffffff, 1);
  scene.add(pointLight);
  pointLight.position.set(1, -0.5, 10);

  const light = new THREE.AmbientLight(0xffffff); // soft white light
  scene.add(light);

  if (debug) {
    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
  }

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onMouseClicked);
}

function onMouseMove(event) {
  cursor.x = (event.clientX / sizes.width) * 2 - 1;
  cursor.y = (event.clientY / sizes.height) * 2 - 1;
  cursorQuaternion = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(cursor.y, cursor.x, 0, 'XYZ')
  );
  cursorPoint = new THREE.Vector3(cursor.x, -cursor.y, -1).unproject(camera);
}

function onWindowResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
}

function onMouseClicked(event) {}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  tube.quaternion.slerp(cursorQuaternion, 0.1);
  renderer.render(scene, camera);
}

init();
animate();
