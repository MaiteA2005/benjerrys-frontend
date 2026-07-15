import * as THREE from "three";
import { loadModel } from "../loaders/modelLoader.js";

export const removeCurrentModel = (scene, state) => {
    if (!state.currentModel) {
        return;
    }

    scene.remove(state.currentModel);

    state.currentModel.traverse((child) => {
        if (!child.isMesh) {
        return;
        }

        child.geometry?.dispose();

        if (Array.isArray(child.material)) {
        child.material.forEach((material) => {
            material.dispose();
        });
        } else {
        child.material?.dispose();
        }
    });

    state.currentModel = null;
};

const centerAndScaleModel = (model, baseType) => {
    const initialBox = new THREE.Box3().setFromObject(model);
    const initialSize = initialBox.getSize(new THREE.Vector3());

    const maxDimension = Math.max(
        initialSize.x,
        initialSize.y,
        initialSize.z
    );

    if (maxDimension === 0) {
        console.warn("Het model heeft geen geldige afmetingen.");
        return;
    }

    const settings = {
        cone: {
        targetSize: 2.8,
        offsetY: 0
        },
        cup: {
        targetSize: 1.8,
        offsetY: 0.15
        }
    };

    const currentSettings = settings[baseType] || {
        targetSize: 2.5,
        offsetY: 0
    };

    const scale = currentSettings.targetSize / maxDimension;

    model.scale.setScalar(scale);
    model.updateMatrixWorld(true);

    const scaledBox = new THREE.Box3().setFromObject(model);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

    model.position.set(
        -scaledCenter.x,
        -scaledCenter.y + currentSettings.offsetY,
        -scaledCenter.z
    );

    model.updateMatrixWorld(true);
};

export const showBaseModel = async ({
    scene,
    state,
    base
    }) => {
    try {
        console.log("Gekozen basis:", base);
        console.log("Model laden vanaf:", base.modelUrl);

        removeCurrentModel(scene, state);

        const model = await loadModel(base.modelUrl);

        model.traverse((child) => {
            if (child.isMesh) {
                console.log({
                name: child.name,
                material: child.material?.name,
                position: child.position
                });
            }
        });

        centerAndScaleModel(model, base.type);

        model.traverse((child) => {
        if (!child.isMesh) {
            return;
        }

        child.castShadow = true;
        child.receiveShadow = true;
        });

        scene.add(model);

        state.currentModel = model;
        state.selectedBase = base;

        console.log("Model succesvol toegevoegd:", model);

        return model;
    } catch (error) {
        console.error(
        `Model laden mislukt: ${base.modelUrl}`,
        error
        );

        throw error;
    }
};