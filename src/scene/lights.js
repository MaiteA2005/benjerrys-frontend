import * as THREE from "three";

export const addLights = (scene) => {
    const hemisphereLight = new THREE.HemisphereLight(
        0xffffff,
        0xb7c9d6,
        1.4
    );

    const keyLight = new THREE.DirectionalLight(
        0xffffff,
        2.2
    );

    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;

    const fillLight = new THREE.DirectionalLight(
        0xffffff,
        0.7
    );

    fillLight.position.set(-4, 3, 2);

    scene.add(
        hemisphereLight,
        keyLight,
        fillLight
    );
};