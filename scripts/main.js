import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const colorMap = {
    0: '#0f5071',
    1: '#E82C2C',
    2: '#219827',
    3: '#3FDCFB',
    4: '#bbbbbb'
};

const mesh_pos = [3,3,3];

const radius = 0.5;

const xSlider = document.getElementById('x-slider');
const ySlider = document.getElementById('y-slider');
const zSlider = document.getElementById('z-slider');

const xValue = document.getElementById('x-value');
const yValue = document.getElementById('y-value');
const zValue = document.getElementById('z-value');

let mesh = null;

function drawCube( bounds, color ) {
    const [ x_l, x_r, y_t, y_b, z_f, z_b ] = bounds

    const l = x_r - x_l;
    const b = y_t - y_b;
    const h = z_b - z_f;

    const geometry = new THREE.BoxGeometry( l,b,h );
    const edges = new THREE.EdgesGeometry( geometry );
    const line = new THREE.LineSegments( edges, new THREE.MeshBasicMaterial({
        color: color
    }) );
    line.position.set(  x_l + (x_r-x_l)/2, y_b + (y_t-y_b)/2, z_f + (z_b-z_f)/2 );
    scene.add( line );
};

function makeOctree( x_l, x_r, y_t, y_b, z_f, z_b, depth ) {
    const octree = new Map()

    if (depth === 0){
        return octree;

    } else {
        octree.set("bounds", [x_l, x_r, y_t, y_b, z_f, z_b]);

        octree.set(0, makeOctree(x_l, x_r - (x_r - x_l)/2, y_t - (y_t - y_b)/2, y_b, z_f, z_b - (z_b - z_f)/2, depth-1));
        octree.set(1, makeOctree(x_r - (x_r - x_l)/2, x_r, y_t - (y_t - y_b)/2, y_b, z_f, z_b - (z_b - z_f)/2, depth-1));
        octree.set(2, makeOctree(x_l, x_r - (x_r - x_l)/2, y_t, y_t - (y_t - y_b)/2, z_f, z_b - (z_b - z_f)/2, depth-1));
        octree.set(3, makeOctree(x_r - (x_r - x_l)/2, x_r, y_t, y_t - (y_t - y_b)/2, z_f, z_b - (z_b - z_f)/2, depth-1));
        octree.set(4, makeOctree(x_l, x_r - (x_r - x_l)/2, y_t - (y_t - y_b)/2, y_b, z_b - (z_b - z_f)/2, z_b, depth-1));
        octree.set(5, makeOctree(x_r - (x_r - x_l)/2, x_r, y_t - (y_t - y_b)/2, y_b, z_b - (z_b - z_f)/2, z_b, depth-1));
        octree.set(6, makeOctree(x_l, x_r - (x_r - x_l)/2, y_t, y_t - (y_t - y_b)/2, z_b - (z_b - z_f)/2, z_b, depth-1));
        octree.set(7, makeOctree(x_r - (x_r - x_l)/2, x_r, y_t, y_t - (y_t - y_b)/2, z_b - (z_b - z_f)/2, z_b, depth-1));
    }

    return octree
};

function isIntersecting( mesh_pos, bounds,threshold ){
    const [ camera_x, camera_y, camera_z ] = mesh_pos
    const [ x_l, x_r, y_t, y_b, z_f, z_b ] = bounds

    let closest_x = 0
    let closest_y = 0
    let closest_z = 0

    if ((x_l < camera_x) && (camera_x < x_r) && (y_b < camera_y) && (camera_y < y_t) && (z_b < camera_z) && (camera_z < z_b)){
        return true

    } else {
        closest_x = Math.max(x_l, Math.min(camera_x, x_r))
        closest_y = Math.max(y_b, Math.min(camera_y, y_t))
        closest_z = Math.max(z_f, Math.min(camera_z, z_b))
    }

    const curr_dist = (closest_x - camera_x)**2 + (closest_y - camera_y)**2 + (closest_z - camera_z)**2

    if (curr_dist < threshold**2){
        return true
    } else {
        return false
    }
}

function drawOctree( mesh_pos, o_tree, threshold, colorMap, level=0 ){
    
    if (isIntersecting(mesh_pos, o_tree.get("bounds"), threshold )){
        
        drawCube( o_tree.get("bounds"), colorMap[level]);
        
        if (o_tree.get(0).has("bounds")) {
            drawOctree( mesh_pos, o_tree.get(0), threshold, colorMap, level+1);
        } else {
            return
        }
        
        if (o_tree.get(1).has("bounds")) {
            drawOctree( mesh_pos, o_tree.get(1), threshold, colorMap, level+1);
        } else {
            return
        }

        if (o_tree.get(2).has("bounds")) {
            drawOctree( mesh_pos, o_tree.get(2), threshold, colorMap, level+1);
        } else {
            return
        }
        
        if (o_tree.get(3).has("bounds")) {
            drawOctree( mesh_pos, o_tree.get(3), threshold, colorMap, level+1);
        } else {
            return
        }
        if (o_tree.get(4).has("bounds")) {
            drawOctree( mesh_pos, o_tree.get(4), threshold, colorMap, level+1);
        } else {
            return
        }
        if (o_tree.get(5).has("bounds")) {
            drawOctree( mesh_pos, o_tree.get(5), threshold, colorMap, level+1);
        } else {
            return
        }
        if (o_tree.get(6).has("bounds")) {
            drawOctree( mesh_pos, o_tree.get(6), threshold, colorMap, level+1);
        } else {
            return
        }
        if (o_tree.get(7).has("bounds")) {
            drawOctree( mesh_pos, o_tree.get(7), threshold, colorMap, level+1);
        } else {
            return
        }
        
    }
}

const ot = makeOctree( 0,8,8,0,0,8,5 )

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#262837");
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(15,12,-12);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.enablePan = true;
controls.minDistance=1;
controls.maxDistance=25;
controls.minPolarAngle=0.5;
controls.maxPolarAngle=1.5;
controls.autoRotate=false;
controls.target = new THREE.Vector3(3.2,2,5.4);
controls.update()

const light_2 = new THREE.HemisphereLight(0xffffff, 0.25);
light_2.position.set(10,10,10)
scene.add(light_2);


drawOctree(mesh_pos, ot, radius, colorMap);

function clearOctreeVisuals() {
    const objectsToRemove = [];
    scene.children.forEach(child => {
        if (child instanceof THREE.LineSegments) {
            objectsToRemove.push(child);
        }
    });
    objectsToRemove.forEach(obj => {
        scene.remove(obj);
        obj.geometry.dispose();
        obj.material.dispose();
    });
}

function updateVisualization() {
    clearOctreeVisuals();

    drawOctree(mesh_pos, ot, radius, colorMap);
    
    if (mesh) {
        mesh.position.set(mesh_pos[0], mesh_pos[1], mesh_pos[2]);
    }
}

const loader = new GLTFLoader().setPath('public/models/');
loader.load('classic_roblox_rubber_duckie.glb', (gltf) => {
    mesh = gltf.scene;
    const [ mesh_x, mesh_y, mesh_z ] = mesh_pos

    mesh.position.set(mesh_x, mesh_y, mesh_z);
    scene.add(mesh);
})

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


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    console.log(camera.position)
    console.log(controls.target)
};

animate();