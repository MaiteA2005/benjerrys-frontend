import * as THREE from "three";

export const disposeObject = (object) => {
    object.traverse((child) => {
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
};

export const centerAndScaleModel = (
    model,
    {
        targetSize = 2.5,
        offsetY = 0
    } = {}
    ) => {
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

    const scale = targetSize / maxDimension;

    model.scale.setScalar(scale);
    model.updateMatrixWorld(true);

    const scaledBox = new THREE.Box3().setFromObject(model);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

    model.position.set(
        -scaledCenter.x,
        -scaledCenter.y + offsetY,
        -scaledCenter.z
    );

    model.updateMatrixWorld(true);
};