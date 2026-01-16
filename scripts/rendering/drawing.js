import * as THREE from 'three';

export class OctreeRenderer {
    constructor(scene, colorMap) {
        this.scene = scene;
        this.colorMap = colorMap;
    }

    drawCube(bounds, color) {
        const [x_l, x_r, y_t, y_b, z_f, z_b] = bounds;
        const geometry = new THREE.BoxGeometry(
            x_r - x_l,
            y_t - y_b,
            z_b - z_f
        );
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color })
        );
        line.position.set(
            (x_l + x_r) / 2,
            (y_b + y_t) / 2,
            (z_f + z_b) / 2
        );
        this.scene.add(line);
    }

    render(octree, meshPos, threshold, level = 0) {
        if (this.isIntersecting(meshPos, octree.bounds, threshold)) {
            const color = this.colorMap[level % Object.keys(this.colorMap).length];
            this.drawCube(octree.bounds, color);
            
            octree.children.forEach(child => {
                this.render(child, meshPos, threshold, level + 1);
            });
        }
    }

    isIntersecting(meshPos, bounds, threshold) {
        
    }
}