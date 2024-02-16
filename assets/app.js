import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const NUM_PARTICLES = 500;
let camera, controls, scene, renderer, axesHelper, line;
let cube, particles;

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

const canvas = document.getElementById("canvas");
const debug = false;
const useOrbitControls = true;

function init() {
  //*SCENE (1)
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1b1b1b);
  scene.fog = new THREE.FogExp2(0x1b1b1b, 0.001);

  //* RENDERER (2)
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //* CAMERA (3)
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 3, 8);

  //* CONTROLS (4)
  if (useOrbitControls) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 2;
    controls.maxDistance = 10;

    // controls.minAzimuthAngle = Math.PI/2;
    controls.maxPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = Math.PI;

    controls.enabled = true;
  }

  //* CREATE LINE
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const points = [];
  points.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  console.log(lineGeometry);

  //* CREATE CUBE
  const geometry = new THREE.CylinderGeometry(1, 1, 6, 8);

  const material = new THREE.MeshBasicMaterial({ color: 0xfdff02 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  //* HANDLE MODEL

  // const loader = new GLTFLoader();
  // loader.load(
  //   "assets/tube011223.glb",
  //   function (gltf) {
  //     console.log(gltf);
  //     scene.add(gltf.scene);
  //   },
  //   undefined,
  //   function (error) {
  //     console.error(error);
  //   }
  // );

  //* ADD LIGHTS
  // const pointLight = new THREE.PointLight(0xffffff, 1);
  // scene.add(pointLight);
  // pointLight.position.set(1, -0.5, 10);

  //* CREATE PARTICLES
  const particleGeometry = new THREE.BufferGeometry();
  const particleVertices = [];
  const sprite = new THREE.TextureLoader().load("assets/circle_03.png");
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const x = 0;
    const y = 3;
    const z = 0;
    particleVertices.push(x, y, z);
  }
  const targetVertices = [];
  for (let i = 0; i < NUM_PARTICLES * 3; i++) {
    targetVertices.push(0);
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(particleVertices, 3)
  );

  particleGeometry.setAttribute(
    "target",
    new THREE.Float32BufferAttribute(particleVertices, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    map: sprite,
    alphaTest: 0.2,
    transparent: true,
  });
  particleMaterial.color.setHSL(1, 1, 1);

  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  console.log(
    "particle targets",
    particles.geometry.attributes.position.array.length
  );

  if (debug) {
    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
  }

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("click", onMouseClicked);
}

function onMouseMove(event) {
  cursor.x = (event.clientX / sizes.width) * 2 - 1;
  cursor.y = (event.clientY / sizes.height) * 2 - 1;
  cursorQuaternion = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(cursor.y, cursor.x, 0, "XYZ")
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

function onMouseClicked(event) {
  console.log("is spraying?: ", isSpraying);
  if (isSpraying) return;
  // generateNewParticleTargets();
  startSpray();
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) {
    controls.update();
  }

  render();
}

function render() {
  cube.quaternion.slerp(cursorQuaternion, 0.1);
  if (isSpraying == true) {
    moveParticlesToTarget();
  }
  renderer.render(scene, camera);
}

function startSpray() {
  isSpraying = true;
  setTimeout(() => {
    resetParticles();
    isSpraying = false;
    emit = 3;
  }, 2000);
}

function moveParticlesToTarget(speed = 0.1) {
  const positions = particles.geometry.attributes.position.array;
  const targets = particles.geometry.attributes.target.array;
  for (let i = 0; i < emit; i += 3) {
    const px = positions[i],
      py = positions[i + 1],
      pz = positions[i + 2];
    const tx = targets[i],
      ty = targets[i + 1],
      tz = targets[i + 2];
    let dir = new THREE.Vector3(tx, ty, tz);
    // console.log('dir', dir);
    let particlePos = new THREE.Vector3(px, py, pz);
    if (dir.equals(new THREE.Vector3(0, 0, 0))) {
      dir = cursorPoint
        .clone()
        .normalize()
        .add(
          new THREE.Vector3(
            0.1 * (2 * Math.random() - 1),
            0.1 * (2 * Math.random() - 1),
            0.1 * (2 * Math.random() - 1)
          )
        );
      targets[i] = dir.x;
      targets[i + 1] = dir.y;
      targets[i + 2] = dir.z;
    }
    particlePos.add(dir.multiplyScalar(speed));
    positions[i] = particlePos.x;
    positions[i + 1] = particlePos.y;
    positions[i + 2] = particlePos.z;
  }
  // particles.material.opacity -= 0.011;
  particles.geometry.attributes.position.needsUpdate = true;

  emit += 3;
  console.log("emit", emit);
}

function resetParticles() {
  const positions = particles.geometry.attributes.position.array;
  const targets = particles.geometry.attributes.target.array;
  for (let i = 0; i < positions.length; i++) {
    positions[i] = 0;
    positions[i + 1] = 3;
    positions[i + 2] = 0;
    targets[i] = 0;
    targets[i + 1] = 0;
    targets[i + 2] = 0;
  }
  particles.material.opacity = 1;
  particles.geometry.attributes.position.needsUpdate = true;
}

init();
animate();

console.log("Hello World");

// function drawLineToCursor() {
//   const positions = line.geometry.attributes.position.array;
//   positions[3] = cursorPoint.x;
//   positions[4] = cursorPoint.y;
//   positions[5] = cursorPoint.z;

//   line.geometry.attributes.position.needsUpdate = true;
// }

// function drawLineFromObject() {
//   const positions = line.geometry.attributes.position.array;
//   const direction = cursorPoint.sub(cube.position);
//   const normalizedDirection = direction.normalize();
//   const speed = 0.01;
//   const newPosition = new Vector3(positions[3], positions[4], positions[5]).add(
//     normalizedDirection.multiplyScalar(speed)
//   );
//   positions[3] = newPosition.x;
//   positions[4] = newPosition.y;
//   positions[5] = newPosition.z;

//   line.geometry.attributes.position.needsUpdate = true;
// }
