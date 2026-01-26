export function makeOctree( x_l, x_r, y_t, y_b, z_f, z_b, depth ) {
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

