import * as THREE from "three";

export const createScene = () => {
    const scene = new THREE.Scene();

    scene.background = new THREE.Color("#dff3ff");

    return scene;
};