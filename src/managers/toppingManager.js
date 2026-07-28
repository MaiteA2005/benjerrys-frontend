import * as THREE from "three";

import {
    createSprinklesFromConeFile
} from "./scoopManager.js";

const getMaterials = (
    object
) => {
    if (!object.material) {
        return [];
    }

    return Array.isArray(
        object.material
    )
        ? object.material
        : [object.material];
};

const setToppingColor = (
    toppingGroup,
    color
) => {
    if (!color) {
        console.warn(
            "De topping heeft geen kleur."
        );

        return;
    }

    toppingGroup.traverse(
        (child) => {
            if (!child.isMesh) {
                return;
            }

            const materials =
                getMaterials(child);

            materials.forEach(
                (material) => {
                    if (
                        material.color
                    ) {
                        material.color.set(
                            color
                        );
                    }

                    material.metalness = 0;
                    material.roughness = 0.8;
                    material.needsUpdate = true;
                }
            );
        }
    );
};

const disposeToppingGroup = (
    group
) => {
    group.traverse((child) => {
        if (!child.isMesh) {
            return;
        }

        child.geometry?.dispose();

        getMaterials(child)
            .forEach((material) => {
                material?.dispose();
            });
    });
};

export const removeTopping = (
    state
) => {
    if (
        !state.currentToppingGroup
    ) {
        return;
    }

    state.currentToppingGroup
        .removeFromParent();

    disposeToppingGroup(
        state.currentToppingGroup
    );

    state.currentToppingGroup =
        null;
};

const getTopScoop = (
    state
) => {
    return (
        state.extraScoop ||
        state.currentScoop
    );
};

export const showTopping =
    async ({
        scene,
        state,
        topping
    }) => {
        removeTopping(state);

        const topScoop =
            getTopScoop(state);

        if (
            !topScoop ||
            !state.currentBaseModel ||
            !topping
        ) {
            return null;
        }

        const toppingGroup =
            await createSprinklesFromConeFile();

        toppingGroup.visible = true;

        setToppingColor(
            toppingGroup,
            topping.color
        );

        topScoop.updateMatrixWorld(true);

        const targetBox =
            new THREE.Box3()
                .setFromObject(
                    topScoop
                );

        const targetCenter =
            targetBox.getCenter(
                new THREE.Vector3()
            );

        const targetSize =
            targetBox.getSize(
                new THREE.Vector3()
            );

        const referenceSize =
            toppingGroup.userData
                .referenceScoopSize;

        if (
            !referenceSize ||
            referenceSize.x === 0
        ) {
            throw new Error(
                "De referentiegrootte van de originele ijsbol ontbreekt."
            );
        }

        const scale =
            targetSize.x /
            referenceSize.x;

        toppingGroup.scale.setScalar(
            scale
        );

        toppingGroup.position.copy(
            targetCenter
        );

        toppingGroup.updateMatrixWorld(
            true
        );

        scene.add(toppingGroup);

        state.currentBaseModel.attach(
            toppingGroup
        );

        state.currentToppingGroup =
            toppingGroup;

        return toppingGroup;
    };

export const applyTopping =
    async ({
        scene,
        state,
        topping
    }) => {
        state.selectedTopping =
            topping;

        return showTopping({
            scene,
            state,
            topping
        });
    };

export const refreshTopping =
    async ({
        scene,
        state
    }) => {
        if (
            !state.selectedTopping
        ) {
            removeTopping(state);
            return null;
        }

        return showTopping({
            scene,
            state,
            topping:
                state.selectedTopping
        });
    };