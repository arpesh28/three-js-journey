import * as THREE from "three";
import gsap from "gsap";

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
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);
// camera.lookAt(mesh.position); // Look at a particular position

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Animations
 */

gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });

const clock = new THREE.Clock();
const tick = () => {
  const time = clock.getElapsedTime();
  //    Update Objects
  //   mesh.rotation.y = time * Math.PI * 2; //   Math.PI is used for half rotation
  //   mesh.position.y = Math.sin(time); //   Sin(x) is a wave starting from 0
  //   mesh.position.z = Math.cos(time); //  Cos(x) is a wave starting from 1
  //   mesh.position.x = Math.cos(time);

  //  Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
