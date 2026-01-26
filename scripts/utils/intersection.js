export function isIntersecting( mesh_pos, bounds, threshold ){
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