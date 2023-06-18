import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();
const clock = new THREE.Clock();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load("/textures/matcaps/9.png");
/**
 * Fonts
 */
const fontLoader = new FontLoader();

/**
 * Object
 */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 30;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableRotate = false;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setClearColor("#14181f");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const cursor = { x: 0, y: 0 };
window.addEventListener(
  "mousemove",
  (event) => {
    if (camera.position.z <= 5) {
      cursor.x = event.clientX / sizes.width;
      cursor.y = -(event.clientY / sizes.height);
    } else {
      event.stopPropagation();
      event.preventDefault();
    }
  },
  false
);

/**
 * Animate
 */
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const zoomInAnimation = () => {
    if (camera.position.z > 5) {
      camera.position.z -= 0.4;
    }
    camera.position.z > 5 && window.requestAnimationFrame(zoomInAnimation);
  };
  if (camera.position.z > 5) {
    zoomInAnimation();
  }
  const textGeometry = new TextGeometry("Arpesh Gadekar\nSoftware Engineer", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.03,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  //   );
  textGeometry.center();
  //    Material
  const material = new THREE.MeshMatcapMaterial();
  material.matcap = matCapTexture;

  //    Text
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
  //   camera.lookAt(text);

  //    Donuts
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const donutGroup = new THREE.Group();
  for (let i = 0; i < 500; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);

    donut.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30
    );

    donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    donutGroup.add(donut);
  }
  for (let i = 0; i < 1000; i++) {
    const cube = new THREE.Mesh(cubeGeometry, material);

    cube.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30
    );

    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    const scale = Math.random();
    cube.scale.set(scale, scale, scale);
    donutGroup.add(cube);
  }
  scene.add(donutGroup);
  const rotationAnimation = () => {
    const time = clock.getElapsedTime();
    text.rotation.x = Math.sin(time) * 0.2;
    text.rotation.y = Math.cos(time) * 0.2;
    text.rotation.z = Math.cos(time) * 0.2;
    donutGroup.rotation.x = Math.cos(time * Math.PI * 0.1);
    donutGroup.rotation.y = Math.sin(time * Math.PI * 0.2);
    donutGroup.rotation.z = Math.cos(time * 0.01) * 3;
    window.requestAnimationFrame(rotationAnimation);
  };
  rotationAnimation();
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  //    Update Rotation
  camera.position.x = Math.cos(cursor.x * Math.PI) * 5;
  camera.position.y = Math.cos(cursor.y * Math.PI) * 5;
  if (camera <= 5) camera.position.z = Math.cos(cursor.x * Math.PI * 0.1) * 5;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
