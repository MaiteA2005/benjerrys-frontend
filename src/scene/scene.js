import * as THREE from "three";

export const createScene = () => {
    const scene = new THREE.Scene();

    /*
    * Geen scene.background.
    * De achtergrond wordt via CSS ingesteld,
    * zodat die met de pagina kan meescrollen.
    */
    scene.background = null;

    return scene;
};