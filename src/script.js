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

// Fog
const fog = new THREE.Fog("#262837", 1, 20);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

//walls
const bricksColor = textureLoader.load("/textures/bricks/color.jpg");
const bricksTexturAmbientOcclusion = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksTextureNormal = textureLoader.load("/textures/bricks/normal.jpg");
const bricksTextureRoughness = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

//grass
const grass = textureLoader.load("/textures/grass/color.jpg");
const grassNormal = textureLoader.load("/textures/grass/normal.jpg");
const grassAmbientOcclusion = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassRoughness = textureLoader.load("/textures/grass/roughness.jpg");

//grass repeat
grass.repeat.set(8, 8);
grassNormal.repeat.set(8, 8);
grassAmbientOcclusion.repeat.set(8, 8);
grassRoughness.repeat.set(8, 8);

//grass wrap
grass.wrapS = THREE.RepeatWrapping;
grassNormal.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping;
grassRoughness.wrapS = THREE.RepeatWrapping;

grass.wrapT = THREE.RepeatWrapping;
grassNormal.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping;
grassRoughness.wrapT = THREE.RepeatWrapping;

//door
const doorTextureColor = textureLoader.load("/textures/door/color.jpg");
const doorTextureAlpha = textureLoader.load("/textures/door/alpha.jpg");
const doorTexturAmbientOcclusion = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorTextureNormal = textureLoader.load("/textures/door/normal.jpg");
const doorTextureHeight = textureLoader.load("/textures/door/height.jpg");
const doorTextureMetalness = textureLoader.load("/textures/door/metalness.jpg");
const doorTextureRoughness = textureLoader.load("/textures/door/roughness.jpg");

doorTextureColor.colorSpace = THREE.SRGBColorSpace;

const grassMaterial = new THREE.MeshStandardMaterial();
grassMaterial.map = grass;
grassMaterial.normalMap = grassNormal;
grassMaterial.aoMap = grassAmbientOcclusion;
grassMaterial.roughness = grassRoughness;
grassMaterial.displacementBias = 0.2;
grassMaterial.displacementScale = 0.1;

/**
 * Moon
 */

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.4),
  new THREE.MeshStandardMaterial({
    color: "#8eeeee",
    metalness: 0.8,
  })
);
moon.position.set(5, 8, -2);
scene.add(moon);

/**
 * House
 */

// Group house
const houseGroup = new THREE.Group();
scene.add(houseGroup);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(6, 4, 6),
  new THREE.MeshStandardMaterial({
    map: bricksColor,
    normalMap: bricksTextureNormal,
    aoMap: bricksTexturAmbientOcclusion,
    roughnessMap: bricksTextureRoughness,
  })
);
walls.position.y = 4 / 2;
console.log(walls);

houseGroup.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(5, 1.6, 4),
  new THREE.MeshStandardMaterial({
    color: "#b35f45",
    map: bricksColor,
    normalMap: bricksTextureNormal,
    aoMap: bricksTexturAmbientOcclusion,
    roughnessMap: bricksTextureRoughness,
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
doorMaterial.roughnessMap = doorTextureRoughness;
doorMaterial.displacementMap = doorTextureHeight;
doorMaterial.displacementScale = 0.1;
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.5, 2.5, 100, 100),
  doorMaterial
);
door.position.z = walls.geometry.parameters.depth * 0.5 + 0.01;
door.position.y = door.geometry.parameters.height * 0.5 - 0.12;

houseGroup.add(door);

// Bush

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = grassMaterial;

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.8, 0.8, 0.5);
bush1.position.set(1.8, 0.4, 3.5);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.6, 0.6, 0.6);
bush2.position.set(-1.8, 0.4, 3.5);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.35, 0.35, 0.35);
bush3.position.set(-2.3, 0.12, 3.5);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.2, 0.2, 0.25);
bush4.position.set(2.3, 0.1, 3.8);

bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

scene.add(bush1, bush2, bush3, bush4);

// Tree
const treeGroup = new THREE.Group();
scene.add(treeGroup);
// const leavesMaterial = new THREE.MeshStandardMaterial({
//   color: "#89c854",
//   map: grassMaterial,
// });
const baseTreeMaterial = new THREE.MeshStandardMaterial({ color: "#aa0011" });

const leaves = new THREE.Mesh(new THREE.SphereGeometry(1), grassMaterial);
const baseTree = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.8, 4.5),
  baseTreeMaterial
);

baseTree.position.set(-5, 2.25, 8);
leaves.position.x = baseTree.position.x;
leaves.position.y =
  baseTree.position.y + baseTree.geometry.parameters.height - 1.4;
leaves.position.z = baseTree.position.z;

treeGroup.add(leaves, baseTree);

// Graves

const graves = new THREE.Group();
scene.add(graves);
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const angle = Math.PI * 2 * Math.random();
  const radius = 5 + Math.random() * 5;

  const x = radius * Math.sin(angle);
  const y = Math.random() * 0.4;
  const z = radius * Math.cos(angle);

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.position.set(x, y, z);
  grave.rotation.y = (Math.random() - 0.1) * 0.3;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  grave.castShadow = true;

  scene.add(grave);
}
const bigGraveGeometry = new THREE.BoxGeometry(2, 1.5, 0.4);

for (let i = 0; i < 3; i++) {
  const angle = Math.PI * 2 * Math.random();
  const radius = 6 + Math.random() * 6;
  const bigGrave = new THREE.Mesh(bigGraveGeometry, graveMaterial);
  bigGrave.position.set(
    radius * Math.sin(angle),
    0.75,
    radius * Math.cos(angle)
  );
  bigGrave.rotation.y = Math.random() * 0.5;
  bigGrave.castShadow = true;
  scene.add(bigGrave);
}
// Coffin
const lengthCoffin = 2.6,
  widthCoffin = 1;

const shapeCoffin = new THREE.Shape();
shapeCoffin.moveTo(0, 0);
shapeCoffin.lineTo(0, widthCoffin);
shapeCoffin.lineTo(lengthCoffin, widthCoffin);
shapeCoffin.lineTo(lengthCoffin, 0);
shapeCoffin.lineTo(0, 0);

const extrudeSettingsCoffin = {
  steps: 3,
  depth: 0.7,
  bevelEnabled: true,
  bevelThickness: 0.25,
  bevelSize: 0.25,
  bevelOffset: 0,
  bevelSegments: 4,
};

const coffinGeometry = new THREE.ExtrudeGeometry(
  shapeCoffin,
  extrudeSettingsCoffin
);
const materialCoffin = new THREE.MeshStandardMaterial({
  color: 0xafaaaf,
  metalness: 1,
  roughness: 0,
});
const coffin = new THREE.Mesh(coffinGeometry, materialCoffin);
coffin.position.set(6, 0.7, 10);
coffin.rotation.x = Math.PI * 0.5;
coffin.rotation.z = Math.PI * 0.3;
scene.add(coffin);
//Windows

const window1 = new THREE.Group();

const length = 1,
  width = 1;

const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(0, width);
shape.lineTo(length, width);
shape.lineTo(length, 0);
shape.lineTo(0, 0);

const extrudeSettings = {
  steps: 3,
  depth: 0.05,
  bevelEnabled: true,
  bevelThickness: 0.025,
  bevelSize: 0.05,
  bevelOffset: 0,
  bevelSegments: 2,
};

const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material = new THREE.MeshStandardMaterial({
  metalness: 1,
  roughness: 0,
});
const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry, material);
const mesh3 = new THREE.Mesh(geometry, material);
const mesh4 = new THREE.Mesh(geometry, material);
mesh.position.set(2.95, 2, 2);
mesh2.position.set(2.95, 2, -1);
mesh3.position.set(-3.05, 2, 2);
mesh4.position.set(-3.05, 2, -1);
mesh.rotation.y = Math.PI * 0.5;
mesh2.rotation.y = Math.PI * 0.5;
mesh3.rotation.y = Math.PI * 0.5;
mesh4.rotation.y = Math.PI * 0.5;
window1.add(mesh, mesh2, mesh3, mesh4);

scene.add(window1);

//Spider web
const spiderWeb = new THREE.Mesh(
  new THREE.RingGeometry(0.1, 0.6, 15, 20, 1, 15),
  new THREE.MeshBasicMaterial({ wireframe: true, color: "#ffffff" })
);
const spiderWeb2 = new THREE.Mesh(
  new THREE.RingGeometry(0.01, 0.6, 15, 20, 1, 18),
  new THREE.MeshBasicMaterial({ wireframe: true, color: "#ffffff" })
);
const spiderWeb3 = new THREE.Mesh(
  new THREE.RingGeometry(0.01, 0.4, 8, 5, 1, 3.5),
  new THREE.MeshBasicMaterial({ wireframe: true, color: "#ffffff" })
);
spiderWeb.position.set(-2.2, 3, 3.01);
spiderWeb2.position.set(3.01, 3.5, -2);
spiderWeb3.position.set(-3.01, 3.5, -2);
spiderWeb2.rotation.y = Math.PI * 0.5;
spiderWeb3.rotation.y = Math.PI * 0.5;
spiderWeb3.rotation.x = Math.PI * 0.5;

gui.add(spiderWeb.rotation, "x", 0, 5, 0.005);
gui.add(spiderWeb.rotation, "z", 0, 5, 0.005);

scene.add(spiderWeb, spiderWeb2, spiderWeb3);

// Floor

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  grassMaterial
  //   new THREE.MeshStandardMaterial({ color: "#a9c388" })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.06);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 1);
moonLight.position.set(6, 5, 2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// DoorLight
const doorLight = new THREE.PointLight("#ff7d46", 15, 10, 1);
doorLight.position.set(0, 3.7, 3.5);

scene.add(doorLight);

// Ghosts

const ghost1 = new THREE.PointLight("#ffd0ff", 6, 3);
const ghost2 = new THREE.PointLight("#1f0dff", 6, 3);
const ghost3 = new THREE.PointLight("#00ffff", 6, 3);
const ghost4 = new THREE.PointLight("#f1ff10", 6, 3);

scene.add(ghost1, ghost2, ghost3, ghost4);

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
camera.position.x = 4.5;
camera.position.y = 4;
camera.position.z = 15;
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
renderer.setClearColor("#262837");

/**
 * Shadow
 */

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
ghost4.castShadow = true;
walls.castShadow = true;
baseTree.castShadow = true;
leaves.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

//Optimising shadow
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;
ghost4.shadow.mapSize.width = 256;
ghost4.shadow.mapSize.height = 256;
ghost4.shadow.camera.far = 7;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update ghosts
  const ghost1angle = elapsedTime * 0.3;
  ghost1.position.x = Math.cos(ghost1angle) * 5;
  ghost1.position.y = Math.sin(ghost1angle * 4);
  ghost1.position.z = Math.sin(ghost1angle) * 5;
  const ghost2angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2angle) * 6;
  ghost2.position.y = Math.sin(ghost2angle * 2) + Math.sin(ghost2angle * 2.5);
  ghost2.position.z = Math.sin(ghost2angle) * 6;
  const ghost3angle = elapsedTime * 0.4;
  ghost3.position.x = Math.cos(ghost3angle) * 7;
  ghost3.position.y = Math.sin(ghost3angle * 2);
  ghost3.position.z = Math.sin(ghost3angle) * 7;
  const ghost4angle = -elapsedTime * 0.45;
  ghost4.position.x =
    Math.cos(ghost4angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost4.position.y = Math.sin(ghost4angle) * (2 + Math.sin(elapsedTime * 0.5));
  ghost4.position.z = Math.sin(ghost4angle) * (7 + Math.sin(elapsedTime * 2));

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
