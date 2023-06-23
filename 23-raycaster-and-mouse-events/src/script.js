import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);
object1.updateMatrixWorld();
object2.updateMatrixWorld();
object3.updateMatrixWorld();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

/**
 * Raycaster
 */

const rayCaster = new THREE.Raycaster();

let model = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/Duck/glTF-Binary/Duck.glb", (gltf) => {
  model = gltf.scene;
  model.position.y = -1.2;
  scene.add(model);
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const cursor = {
  x: 0,
  y: 0,
};
let currentIntersect = null;
window.addEventListener("mousemove", (event) => {
  cursor.x = (event.clientX / sizes.width) * 2 - 1;
  cursor.y = -(event.clientY / sizes.height) * 2 + 1;
});
window.addEventListener("click", (event) => {
  if (currentIntersect) {
    currentIntersect.object.material.color.set("#00ff00");
  }
});
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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //    Animate Spheres
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.5) * 1.5;

  //    Cast a ray
  rayCaster.setFromCamera(cursor, camera);
  const objectsToTest = [object1, object2, object3];
  const intersects = rayCaster.intersectObjects(objectsToTest);
  for (const object of objectsToTest) {
    object.material.color.set("#ff0000");
  }
  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }
  if (intersects.length) {
    currentIntersect = intersects[0];
  } else {
    currentIntersect = null;
  }

  if (model) {
    const modelIntersects = rayCaster.intersectObject(model);
    if (modelIntersects.length) {
      model.scale.set(1.5, 1.5, 1.5);
    } else {
      model.scale.set(1, 1, 1);
    }
  }
  //   const rayOrigin = new THREE.Vector3(-3, 0, 0);
  //   const rayDirection = new THREE.Vector3(1, 0, 0);
  //   rayDirection.normalize();

  //   rayCaster.set(rayOrigin, rayDirection);

  //   const objectToTest = [object1, object2, object3];
  //   const intersects = rayCaster.intersectObjects(objectToTest);

  //   for (const object of objectToTest) {
  //     object.material.color.set("#ff0000");
  //   }

  //   for (const intersect of intersects) {
  //     intersect.object.material.color.set("#0000ff");
  //   }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
