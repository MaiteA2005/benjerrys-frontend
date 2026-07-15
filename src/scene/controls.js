import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const createControls = (camera, renderer) => {
    const controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    controls.enablePan = false;

    controls.enableZoom = true;
    controls.minDistance = 3;
    controls.maxDistance = 8;

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    controls.target.set(0, 0, 0);

    controls.addEventListener("start", () => {
        controls.autoRotate = false;
    });

    controls.addEventListener("end", () => {
        controls.autoRotate = true;
    });

    controls.update();

    return controls;
};