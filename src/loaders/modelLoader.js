import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export const loadModel = (modelUrl) =>
    new Promise((resolve, reject) => {
        loader.load(
        modelUrl,
        (gltf) => resolve(gltf.scene),
        undefined,
        (error) => reject(error)
        );
    });