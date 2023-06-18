import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";

/**
 * Debug
 */
const gui = new lil.GUI();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matCapTexture = textureLoader.load("/textures/matcaps/2.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

/**
 * ==>>End of Textures
 */

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

// const material = new THREE.MeshBasicMaterial();
// material.wireframe = true;
// material.map = doorColorTexture;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.FrontSide;

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matCapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 50;
// material.specular.set(0x00ff00);

// const material = new THREE.MeshStandardMaterial();
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 2;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.06;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.7, 1);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;
// gui.add(material, "roughness").min(0).max(1).step(0.001);
// gui.add(material, "metalness").min(0).max(1).step(0.001);
// gui.add(material, "aoMapIntensity").min(0).max(5).step(0.01);
// gui.add(material, "displacementScale").min(0).max(1).step(0.001);

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;

gui.add(material, "roughness").min(0).max(1).step(0.001);
gui.add(material, "metalness").min(0).max(1).step(0.001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), material);
sphere.position.x = -1.5;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.position.x = 0;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.2, 64, 128),
  material
);
torus.position.y = -1.5;
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
scene.add(sphere, plane, torus);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 1;
pointLight.position.y = 2;
pointLight.position.z = 2;
scene.add(ambientLight, pointLight);

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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Objects
  sphere.rotation.y = elapsedTime * 0.3;
  // plane.rotation.y = elapsedTime * 0.3;
  // plane.rotation.x = elapsedTime * 0.3;
  torus.rotation.x = elapsedTime * 0.3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
