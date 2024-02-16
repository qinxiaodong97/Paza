import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const canvas = document.getElementById('canvas');
const NUM_PARTICLES = 500;
let camera, controls, scene, renderer;
let object, particles;

let isSpraying = false;
let spawn = 0;
let spawnLimit = 10;

const mouse = {
  x: 0,
  y: 0,
  vector: new THREE.Vector3(),
  quaternion: new THREE.Quaternion(),
};

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function init() {
  //*SCENE (1)
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1b1b1b);
  // scene.fog = new THREE.FogExp2(0x1b1b1b, 0.001);

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
  camera.position.set(0, 0, 5);

  //* CREATE MAIN OBJECT ()
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  object = new THREE.Mesh(geometry, material);
  scene.add(object);

  // //* CREATE PARTICLES

  particles = new ParticleEmitter();
  scene.add(particles.getParticles());

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onMouseClicked);
  window.addEventListener('click', () => {
    particles.spawnParticle();
  });
}

function onMouseMove(event) {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = (event.clientY / sizes.height) * 2 - 1;
  mouse.vector = new THREE.Vector3(mouse.x, -mouse.y, -1).unproject(camera);
  mouse.quaternion = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(mouse.y, mouse.x, 0, 'XYZ')
  );
}

function onWindowResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
}

function onMouseClicked(event) {
  console.log('is spraying?: ', isSpraying);
  if (isSpraying) return;
  startSpray();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  object.quaternion.slerp(mouse.quaternion, 0.1);
  if (isSpraying == true) {
    // moveParticlesToTarget(0.1, 0.2);
    particles.spawnParticle(mouse.vector);
  }

  // console.log(particles.getTarget());

  particles.update();
  renderer.render(scene, camera);
}

function startSpray() {
  isSpraying = true;
  setTimeout(() => {
    particles.resetParticles();
    isSpraying = false;
    // emit = 3;
  }, 2000);
}

function moveParticlesToTarget(speed = 0.05, spread = 0.1) {
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
      dir = mouse.vector
        .clone()
        .normalize()
        .add(
          new THREE.Vector3(
            spread * (2 * Math.random() - 1),
            spread * (2 * Math.random() - 1),
            spread * (2 * Math.random() - 1)
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
  particles.geometry.attributes.position.needsUpdate = true;

  emit += 6;
  console.log('emit', emit);
}

function resetParticles() {
  const positions = particles.geometry.attributes.position.array;
  const targets = particles.geometry.attributes.target.array;
  for (let i = 0; i < positions.length; i++) {
    positions[i] = 0;
    positions[i + 1] = 0;
    positions[i + 2] = 0;
    targets[i] = 0;
    targets[i + 1] = 0;
    targets[i + 2] = 0;
  }
  particles.material.opacity = 1;
  particles.geometry.attributes.position.needsUpdate = true;
}

class ParticleEmitter extends THREE.Object3D {
  constructor(
    count = 1000,
    speed = 0.1,
    size = 0.1,
    spread = 0.1,
    color = 0xffffff,
    sprite = null
  ) {
    super();
    this.geometry = new THREE.BufferGeometry();
    this.vertices = [];
    this.sprite = new THREE.TextureLoader().load('assets/circle_03.png');
    this.count = count;
    this.size = size;
    this.index = 0;
    this.speed = speed;
    this.spread = 0.13;

    for (let i = 0; i < this.count; i++) {
      const x = 3 * (2 * Math.random() - 1);
      const y = 3 * (2 * Math.random() - 1);
      const z = 3 * (2 * Math.random() - 1);
      this.vertices.push(x, y, z);
    }

    let colors = [];
    for (let i = 0; i < this.count; i++) {
      const r = 255 * Math.random();
      const g = 255 * Math.random();
      const b = 255 * Math.random();
      colors.push(r, g, b);
    }

    //Vec attributes
    this.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(new Float32Array(this.count * 3), 3)
    );
    this.geometry.setAttribute(
      'direction',
      new THREE.Float32BufferAttribute(new Float32Array(this.count * 3), 3)
    );
    this.geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );

    //Scalar attributes

    this.geometry.setAttribute(
      'size',
      new THREE.Float32BufferAttribute(new Float32Array(this.count), 1)
    );
    this.geometry.setAttribute(
      'lifeTime',
      new THREE.Float32BufferAttribute(new Float32Array(this.count), 1)
    );

    this.material = new THREE.PointsMaterial({
      size: this.size,
      depthWrite: false,
      sizeAttenuation: true,
      map: this.sprite,
      alphaTest: 0.2,
      transparent: true,
      vertexColors: true,
    });
    // this.material.color.setHSL(1, 1, 1);

    this.particles = new THREE.Points(this.geometry, this.material);
  }

  getParticles() {
    return this.particles;
  }

  getTarget() {
    return this.target;
  }

  spawnParticle(target, number) {
    const directions = this.geometry.attributes.direction.array;
    const targetDirection = target
      .clone()
      .normalize()
      .add(
        new THREE.Vector3(
          this.spread * (2 * Math.random() - 1),
          this.spread * (2 * Math.random() - 1),
          this.spread * (2 * Math.random() - 1)
        )
      )
      .normalize();

    directions[this.index * 3] = targetDirection.x;
    directions[this.index * 3 + 1] = targetDirection.y;
    directions[this.index * 3 + 2] = targetDirection.z;
    this.index++;
    if (this.index >= this.count) {
      // this.index = 0;
    }
  }

  resetParticles() {
    for (let i = 0; i < this.count; i++) {
      const positions = this.particles.geometry.attributes.position.array;
      const directions = this.particles.geometry.attributes.direction.array;
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      directions[i * 3] = 0;
      directions[i * 3 + 1] = 0;
      directions[i * 3 + 2] = 0;
    }
    this.index = 0;
  }

  updatePosition(i) {
    const positions = this.particles.geometry.attributes.position.array;
    const directions = this.particles.geometry.attributes.direction.array;
    const px = positions[i],
      py = positions[i + 1],
      pz = positions[i + 2];
    const dx = directions[i],
      dy = directions[i + 1],
      dz = directions[i + 2];
    let dir = new THREE.Vector3(dx, dy, dz);
    let pos = new THREE.Vector3(px, py, pz);
    pos.add(dir.multiplyScalar(this.speed));
    positions[i] = pos.x;
    positions[i + 1] = pos.y;
    positions[i + 2] = pos.z;
  }

  update() {
    for (let i = 0; i < this.index; i++) {
      this.updatePosition(i * 3);
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}

init();
animate();
