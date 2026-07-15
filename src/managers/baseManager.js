import { loadModel } from "../loaders/modelLoader.js";
import {
    centerAndScaleModel,
    disposeObject
} from "../utils/modelUtils.js";

const hideCupCherry = (model) => {
    model.traverse((child) => {
        if (!child.isMesh) return;

        const name = child.name.toLowerCase();

        // Cherry verwijderen
        if (name.includes("cherry")) {
            child.visible = false;
        }
    });
};

const hideConeSprinkles = (model) => {
    model.traverse((child) => {
        if (!child.isMesh) return;

        // Rode sprinkles verbergen
        if (
            child.name === "IceCream_3_2" ||
            child.material?.name === "Red"
        ) {
            child.visible = false;
        }
    });
};

export const removeCurrentBase = (scene, state) => {
    if (!state.currentBaseModel) {
        return;
    }

    scene.remove(state.currentBaseModel);
    disposeObject(state.currentBaseModel);

    state.currentBaseModel = null;
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

export const showBaseModel = async ({
    scene,
    state,
    base
}) => {
    try {
        console.log("Gekozen basis:", base);
        console.log("Model laden vanaf:", base.modelUrl);

        removeCurrentBase(scene, state);

        const model = await loadModel(base.modelUrl);

        adjustMaterials(model, base.type);

        if (base.type === "cone") {
            hideConeSprinkles(model);
        }

        if (base.type === "cup") {
            hideCupCherry(model);
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

        centerAndScaleModel(
            model,
            settings[base.type] || {
                targetSize: 2.5,
                offsetY: 0
            }
        );

        model.traverse((child) => {
            if (!child.isMesh) return;

            child.castShadow = true;
            child.receiveShadow = true;
        });

        scene.add(model);

        state.currentBaseModel = model;
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