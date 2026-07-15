import * as THREE from "three";

export const addLights = (scene) => {
    const ambientLight = new THREE.AmbientLight("#ffffff", 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
    directionalLight.position.set(3, 5, 4);
    directionalLight.castShadow = true;

    scene.add(directionalLight);
};