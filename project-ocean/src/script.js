import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

//  Shaders
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */
let mixer = null;
let ship = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/ship/scene.gltf", (gltf) => {
  //  Animation Mixer (Player for animating the gltf model)
  mixer = new THREE.AnimationMixer(gltf.scene);
  console.log(gltf);
  gltf.scene.receiveShadow = true;
  gltf.scene.rotation.set(0, 1.5, 0);
  gltf.scene.scale.set(0.15, 0.15, 0.15);
  // gltf.scene.position.set(0, 0.1, 0);
  ship = gltf.scene;
  scene.add(ship);
});

// Texture Loader
const cubeTexture = new THREE.CubeTextureLoader().load([
  "/textures/sky/03/px.png",
  "/textures/sky/03/nx.png",
  "/textures/sky/03/py.png",
  "/textures/sky/03/ny.png",
  "/textures/sky/03/pz.png",
  "/textures/sky/03/nz.png",
]);
const skyboxMaterial = new THREE.MeshBasicMaterial({
  envMap: cubeTexture,
  side: THREE.BackSide,
});

const skyboxGeometry = new THREE.BoxGeometry(100, 100, 100);
const skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skyboxMesh);
skyboxMaterial.envMap.mapping = THREE.CubeRefractionMapping;
/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(100, 100, 1024, 1024);

//  Color
debugObject.depthColor = "#055694";
debugObject.surfaceColor = "#0b86e5";
debugObject.fogColor = "#132c3e";

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 10 },

    //  Big Waves
    uBigWavesElevation: { value: 0.37 },
    uBigWavesFrequency: { value: new THREE.Vector2(0.67, 0.975) },
    uBigWavesSpeed: { value: 0.66 },

    //  Small Waves
    uSmallWavesElevation: { value: 0.198 },
    uSmallWavesFrequency: { value: 2.1 },
    uSmallWavesSpeed: { value: 0.66 },
    uSmallWavesIterations: { value: 3 },

    //  Colors
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.1 },
    uColorMultiplier: { value: 4 },

    //  Fog
    uFogColor: { value: new THREE.Color(debugObject.fogColor) },
    uFogNear: { value: 8.9 },
    uFogFar: { value: 35.27 },

    //  Light
    uRefractionRatio: { value: 0.4 },
    uDirectionalLights: { value: new THREE.Vector3(1, 0, 2) },
  },
  side: THREE.DoubleSide,
});

//  Debug
gui
  .add(waterMaterial.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWavesElevation");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequencyX");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequency");
gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uBigWavesSpeed");

gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWavesElevation");
gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(20)
  .step(0.001)
  .name("uSmallWavesFrequency");
gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
  .min(0)
  .max(2)
  .step(0.001)
  .name("uSmallWavesSpeed");
gui
  .add(waterMaterial.uniforms.uSmallWavesIterations, "value")
  .min(1)
  .max(10)
  .step(1)
  .name("uSmallWavesIterations");

gui
  .addColor(debugObject, "depthColor")
  .name("depthColor")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
  });
gui
  .addColor(debugObject, "surfaceColor")
  .name("surfaceColor")
  .onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
  });
gui
  .add(waterMaterial.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");
gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.01)
  .name("uColorMultiplier");

gui
  .addColor(debugObject, "fogColor")
  .name("fogColor")
  .onChange(() => {
    waterMaterial.uniforms.uFogColor.value.set(debugObject.fogColor);
  });
gui
  .add(waterMaterial.uniforms.uFogNear, "value")
  .min(0)
  .max(100)
  .step(0.01)
  .name("uFogNear");
gui
  .add(waterMaterial.uniforms.uFogFar, "value")
  .min(0)
  .max(100)
  .step(0.01)
  .name("uFogFar");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0); // Adjust intensity and color as needed
directionalLight.position.set(1, 2, 0); // Set the position of the light
scene.add(directionalLight);

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
camera.position.set(1, 1, 2);
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

  // Update shaders
  water.material.uniforms.uTime.value = elapsedTime;

  // Update ship
  if (ship) {
    ship.rotation.x = Math.sin(elapsedTime) * 0.2;
    ship.rotation.x = -Math.sin(elapsedTime) * 0.15;
    ship.rotation.y = Math.cos(elapsedTime) * 0.15;
    ship.position.y = Math.sin(elapsedTime) * 0.05 + 0.1;
    // ship.rotation.x = Math.sin(elapsedTime) * 0.2;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
