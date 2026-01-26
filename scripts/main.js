import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { isIntersecting } from './utils/intersection.js';
import { makeOctree } from './octree/octree.js';

const colorMap = {
    0: '#ffffff',
    1: '#E82C2C',
    2: '#42dc35',
    3: '#3FDCFB',
    4: '#8f8c8c'
};

const mesh_pos = [3,3,3];
let input_bounds = [0,8,8,0,0,8];

const ot = makeOctree(input_bounds, 5);

let radius = 0.5;

let mesh = null;

const xSlider = document.getElementById('x-slider');
const ySlider = document.getElementById('y-slider');
const zSlider = document.getElementById('z-slider');
const rSlider = document.getElementById('r-slider')

const xValue = document.getElementById('x-value');
const yValue = document.getElementById('y-value');
const zValue = document.getElementById('z-value');
const rValue = document.getElementById('r-value')

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#262837");
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(15,12,-12);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.enablePan = false;
controls.minDistance=10;
controls.maxDistance=25;
controls.minPolarAngle=0.5;
controls.maxPolarAngle=1.5;
controls.autoRotate=false;
controls.target = new THREE.Vector3(3.2,2,5.4);
controls.update()

const light_1 = new THREE.HemisphereLight(0xffffff, 0.25);
light_1.position.set(10,10,10)
scene.add(light_1);

const loader = new GLTFLoader().setPath('public/models/');
loader.load('classic_roblox_rubber_duckie.glb', (gltf) => {
    mesh = gltf.scene;
    mesh.position.set(3, 3, 3);
    scene.add(mesh);
})

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const unitEdges = new THREE.EdgesGeometry(unitBox);
const sharedMaterials = Object.keys(colorMap).reduce((acc, level) => {
    acc[level] = new THREE.LineBasicMaterial({ color: colorMap[level] });
    return acc;
}, {});

const octreeGroup = new THREE.Group();

function drawCube(bounds, level) {
    const [x_l, x_r, y_t, y_b, z_f, z_b] = bounds;
    const width = x_r - x_l;
    const height = y_t - y_b;
    const depth = z_b - z_f;

    const line = new THREE.LineSegments(unitEdges, sharedMaterials[level]);
    line.scale.set(width, height, depth);
    line.position.set(x_l + width / 2, y_b + height / 2, z_f + depth / 2);
    
    octreeGroup.add(line);
}

function drawOctreeRecursive(pos, node, threshold, level = 0) {
    if (!node || !isIntersecting(pos, node.bounds, threshold)) return;

    drawCube(node.bounds, level);

    for (const child of node.children) {
        drawOctreeRecursive(pos, child, threshold, level + 1);
    }
}
scene.add(octreeGroup);

drawOctreeRecursive(mesh_pos, ot, radius)

function updateVisualization() {
    while (octreeGroup.children.length > 0) {
        octreeGroup.remove(octreeGroup.children[0]);
    }

    drawOctreeRecursive(mesh_pos, ot, radius);
    
    if (mesh) mesh.position.fromArray(mesh_pos);
}

xSlider.addEventListener('input', (e) => {
    mesh_pos[0] = parseFloat(e.target.value);
    xValue.textContent = mesh_pos[0].toFixed(1);
    updateVisualization();
});

ySlider.addEventListener('input', (e) => {
    mesh_pos[2] = parseFloat(e.target.value);
    yValue.textContent = mesh_pos[2].toFixed(1);
    updateVisualization();
});

zSlider.addEventListener('input', (e) => {
    mesh_pos[1] = parseFloat(e.target.value);
    zValue.textContent = mesh_pos[1].toFixed(1);
    updateVisualization();
});

rSlider.addEventListener('input', (e) => {
    radius = parseFloat(e.target.value);
    rValue.textContent = radius;
    updateVisualization();
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();