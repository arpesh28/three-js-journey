import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Cursor Movement
 */
const cursor = {
  x: 0,
  y: 0,
};
//  Mouse move event listener
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
scene.add(mesh);

//  Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//  Scale
// mesh.scale.set(2, 0.5, 0.5);

// //  Rotation
// //  for half rotation use Math.Pi (3.14159)
// mesh.rotation.set(0, Math.PI / 2, 0);

/**Objects Groups */
// const group = new THREE.Group();
// scene.add(group);

// const cube1 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );
// const cube2 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// );
// cube2.position.x = -2;
// group.add(cube1, cube2);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", (event) => {
  //  Update Window resize
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //  Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //  Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", (event) => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen()) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    document.exitFullscreen
      ? document.exitFullscreen()
      : document.webkitExitFullscreen();
  }
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
camera.position.z = 3;
scene.add(camera);
// camera.position.set(2, 2, 2);
camera.lookAt(mesh.position); // Look at a particular position

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animations
 */

// gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });

const clock = new THREE.Clock();
const tick = () => {
  //   const time = clock.getElapsedTime();
  //    Update Objects
  //   mesh.rotation.x = cursor.y; //   Math.PI is used for half rotation
  //   mesh.rotation.y = cursor.x; //   Math.PI is used for half rotation
  //   mesh.position.x = cursor.x * 2;
  //   mesh.position.y = -cursor.y * 2;
  // camera.position.x = Math.cos(cursor.x * Math.PI * 2) * 2;
  // camera.position.z = Math.sin(cursor.x * Math.PI * 2) * 2;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(mesh.position);
  // mesh.position.y = Math.sin(time); //   Sin(x) is a wave starting from 0
  // mesh.position.z = Math.cos(time); //  Cos(x) is a wave starting from 1
  // mesh.position.x = Math.cos(time);

  //  Render
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
