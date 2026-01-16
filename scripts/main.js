import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const colorMap = new Map([
    [0, '#07222f'],
    [1, '#E82C2C'],
    [2, '#219827'],
    [3, '#3FDCFB'],
    [4, '#bbbbbb']
]);

function drawCube( coords, color ) {
    const [ x_l, x_r, y_t, y_b, z_f, z_b ] = coords

    const l = x_r - x_l;
    const b = y_t - y_b;
    const h = z_b - z_f;

    const geometry = new THREE.BoxGeometry( l,b,h );
    const edges = new THREE.EdgesGeometry( geometry );
    const line = new THREE.LineSegments( edges, new THREE.MeshBasicMaterial({
        color : color
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

const ot = makeOctree( 0,8,8,0,0,8,5 )

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#262837");
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(40,10,25);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.enablePan = true;
controls.minDistance=1;
controls.maxDistance=20;
controls.minPolarAngle=0.5;
controls.maxPolarAngle=1.5;
controls.autoRotate=false;
controls.target = new THREE.Vector3(0,0,0);
controls.update()

const light_2 = new THREE.HemisphereLight(0xffffff, 0.25);
light_2.position.set(10,10,10)
scene.add(light_2);

const gridHelper = new THREE.GridHelper( 100, 50 ); // ( size, divisions )
// scene.add( gridHelper );

// for (let i=0; i<8; i++){
//     for (let j=0; j<8; j++){
//         for (let k=0; k<8; k++){
//             for (let l=0; l<8; l++){
//                 drawCube( ot.get(i).get(j).get(k).get(l).get("bounds"), "#C2C2C2");
//             }
//         }
//     }
// }

for (let i=0; i<8; i++){
    for (let j=0; j<8; j++){
        for (let k=0; k<8; k++){
            drawCube( ot.get(i).get(j).get(k).get("bounds"), "#3FDCFB");
        }
    }
}

for (let i=0; i<8; i++){
    for (let j=0; j<8; j++){
        drawCube( ot.get(i).get(j).get("bounds"), "#2AEA33");
    }
}

for (let i=0; i<8; i++){
    drawCube( ot.get(i).get("bounds"), "#E82C2C");
}

drawCube( ot.get("bounds"), "#1A78A2")

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();