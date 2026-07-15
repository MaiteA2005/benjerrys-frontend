import * as THREE from "three";

import { loadModel } from "../loaders/modelLoader.js";

import {
    centerAndScaleModel,
    disposeObject
} from "../utils/modelUtils.js";

import {
    findScoopMesh,
    createScoopFromModel,
    createScoopFromConeFile,
    hideOriginalScoop,
    placeScoopOnBase
    } from "./scoopManager.js";

    const hideCupDecorations = (model) => {
    model.traverse((child) => {
        if (!child.isMesh) {
        return;
        }

        const name = child.name.toLowerCase();

        const isCakeTop = name.startsWith("cake");
        const isCherry = name.includes("cherry");

        if (isCakeTop || isCherry) {
        child.visible = false;
        }
    });
};

const hideConeSprinkles = (model) => {
    model.traverse((child) => {
        if (!child.isMesh) {
        return;
        }

        if (
        child.name === "IceCream_3_2" ||
        child.material?.name === "Red"
        ) {
        child.visible = false;
        }
    });
};

const adjustMaterials = (model, baseType) => {
    model.traverse((child) => {
        if (!child.isMesh || !child.material) {
        return;
        }

        const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

        materials.forEach((material) => {
        material.metalness = 0;

        if (baseType === "cone") {
            material.roughness = 0.85;

            if (material.color) {
            material.color.multiplyScalar(1.15);
            }
        }

        if (baseType === "cup") {
            material.roughness = 1;

            if (material.color) {
            material.color.multiplyScalar(0.72);
            }
        }

        material.needsUpdate = true;
        });
    });
};

export const removeCurrentBase = (scene, state) => {
    if (!state.currentBaseModel) {
        return;
    }

    scene.remove(state.currentBaseModel);
    disposeObject(state.currentBaseModel);

    state.currentBaseModel = null;
    state.currentScoop = null;
};

const createConeConfiguration = async (model, state) => {
    hideConeSprinkles(model);

    const originalScoop = findScoopMesh(model);

    if (!originalScoop) {
        throw new Error(
        "De ijsbol IceCream_3_3 werd niet gevonden."
        );
    }

    const scoop = createScoopFromModel(model);

    state.currentScoop = originalScoop;

    return model;
};

const createCupConfiguration = async (
    cupModel,
    state
    ) => {
    hideCupDecorations(cupModel);

    const configurationGroup = new THREE.Group();
    configurationGroup.name = "cup-configuration";

    configurationGroup.add(cupModel);

    const scoop = await createScoopFromConeFile();

    placeScoopOnBase({
        scoop,
        baseModel: cupModel,
        overlap: 0.287,
        scale: 0.65
    });

    configurationGroup.add(scoop);

    state.currentScoop = scoop;

    return configurationGroup;
};

export const showBaseModel = async ({
    scene,
    state,
    base
    }) => {
    try {
        console.log("Gekozen basis:", base);
        console.log("Model laden vanaf:", base.modelUrl);

        removeCurrentBase(scene, state);

        const loadedModel = await loadModel(base.modelUrl);

        adjustMaterials(loadedModel, base.type);

        let configurationModel;

        if (base.type === "cone") {
        configurationModel = await createConeConfiguration(
            loadedModel,
            state
        );
        } else if (base.type === "cup") {
        configurationModel = await createCupConfiguration(
            loadedModel,
            state
        );
        } else {
        configurationModel = loadedModel;
        }

        const settings = {
        cone: {
            targetSize: 2.8,
            offsetY: 0
        },
        cup: {
            targetSize: 2.2,
            offsetY: 0.05
        }
        };

        centerAndScaleModel(
        configurationModel,
        settings[base.type] || {
            targetSize: 2.5,
            offsetY: 0
        }
        );

        configurationModel.traverse((child) => {
        if (!child.isMesh) {
            return;
        }

        child.castShadow = true;
        child.receiveShadow = true;
        });

        scene.add(configurationModel);

        state.currentBaseModel = configurationModel;
        state.selectedBase = base;

        console.log(
        "Model succesvol toegevoegd:",
        configurationModel
        );

        return configurationModel;
    } catch (error) {
        console.error(
        `Model laden mislukt: ${base.modelUrl}`,
        error
        );

        throw error;
    }
};