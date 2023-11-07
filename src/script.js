import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const grass = textureLoader.load("/textures/grass/color.jpg");
const grassNormal = textureLoader.load("/textures/grass/normal.jpg");
const grassAmbientOcclusion = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const doorTextureColor = textureLoader.load("/textures/door/color.jpg");
const doorTextureAlpha = textureLoader.load("/textures/door/alpha.jpg");
const doorTextureHeight = textureLoader.load("/textures/door/height.jpg");
const doorTexturAmbientOcclusion = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorTextureMetalness = textureLoader.load("/textures/door/metalness.jpg");
const doorTextureNormal = textureLoader.load("/textures/door/normal.jpg");
const doorTextureRoughness = textureLoader.load("/textures/door/roughness.jpg");

/**
 * House
 */

// Group house
const houseGroup = new THREE.Group();
scene.add(houseGroup);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(6, 6, 6),
  new THREE.MeshStandardMaterial({
    color: "#ac8e82",
  })
);
walls.position.y = 6 / 2;
console.log(walls);

houseGroup.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(5, 1.6, 4),
  new THREE.MeshStandardMaterial({
    color: "#b35f45",
  })
);
roof.rotation.y = 0.25 * Math.PI;
roof.position.y =
  walls.geometry.parameters.height + roof.geometry.parameters.height * 0.5;
houseGroup.add(roof);

// Door
const doorMaterial = new THREE.MeshStandardMaterial();
doorMaterial.transparent = true;
doorMaterial.map = doorTextureColor;
doorMaterial.normalMap = doorTextureNormal;
doorMaterial.aoMap = doorTexturAmbientOcclusion;
doorMaterial.alphaMap = doorTextureAlpha;
doorMaterial.metalnessMap = doorTextureMetalness;
const door = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), doorMaterial);
door.position.z = walls.geometry.parameters.depth * 0.5 + 0.01;
door.position.y = door.geometry.parameters.height * 0.5 - 0.12;

houseGroup.add(door);
// Floor

const grassMaterial = new THREE.MeshStandardMaterial();
grassMaterial.map = grass;
grassMaterial.normalMap = grassNormal;
grassMaterial.aoMap = grassAmbientOcclusion;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  grassMaterial
  //   new THREE.MeshStandardMaterial({ color: "#a9c388" })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#ffffff", 1.5);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
