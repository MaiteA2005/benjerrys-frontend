import * as THREE from "three";
import { loadModel } from "../loaders/modelLoader.js";

const SCOOP_MESH_NAME = "IceCream_3_3";

export const findScoopMesh = (model) => {
    let scoopMesh = null;

    model.traverse((child) => {
        if (
        child.isMesh &&
        child.name === SCOOP_MESH_NAME
        ) {
        scoopMesh = child;
        }
    });

    return scoopMesh;
};

const cloneMaterial = (material) => {
    if (Array.isArray(material)) {
        return material.map((item) => item.clone());
    }

    return material.clone();
};

export const createScoopFromModel = (model) => {
    model.updateMatrixWorld(true);

    const sourceMesh = findScoopMesh(model);

    if (!sourceMesh) {
        throw new Error(
        `Scoop-mesh "${SCOOP_MESH_NAME}" niet gevonden`
        );
    }

    const geometry = sourceMesh.geometry.clone();

    geometry.applyMatrix4(sourceMesh.matrixWorld);
    geometry.computeBoundingBox();

    const center = geometry.boundingBox.getCenter(
        new THREE.Vector3()
    );

    geometry.translate(
        -center.x,
        -center.y,
        -center.z
    );

    geometry.computeBoundingBox();

    const scoop = new THREE.Mesh(
        geometry,
        cloneMaterial(sourceMesh.material)
    );

    scoop.name = "configurator-scoop";
    scoop.castShadow = true;
    scoop.receiveShadow = true;

    return scoop;
};

export const createScoopFromConeFile = async () => {
    const coneModel = await loadModel("/models/cone.glb");

    return createScoopFromModel(coneModel);
};

export const hideOriginalScoop = (model) => {
    const scoopMesh = findScoopMesh(model);

    if (scoopMesh) {
        scoopMesh.visible = false;
    }
};

export const setScoopColor = (scoop, color) => {
    const materials = Array.isArray(scoop.material)
        ? scoop.material
        : [scoop.material];

    materials.forEach((material) => {
        if (material.color) {
        material.color.set(color);
        }

        material.metalness = 0;
        material.roughness = 0.9;
        material.needsUpdate = true;
    });
};

export const placeScoopOnBase = ({
    scoop,
    baseModel,
    overlap = 0.12,
    scale = 1
    }) => {
    
    scoop.scale.setScalar(scale);

    baseModel.updateMatrixWorld(true);
    scoop.updateMatrixWorld(true);

    const baseBox = new THREE.Box3().setFromObject(baseModel);
    const baseCenter = baseBox.getCenter(new THREE.Vector3());

    const scoopBox = new THREE.Box3().setFromObject(scoop);
    const scoopSize = scoopBox.getSize(new THREE.Vector3());

    scoop.position.set(
        baseCenter.x,
        baseBox.max.y + scoopSize.y / 2 - overlap,
        baseCenter.z
    );

    scoop.updateMatrixWorld(true);
};

const disposeScoop = (scoop) => {
    scoop.geometry?.dispose();

    const materials = Array.isArray(scoop.material)
        ? scoop.material
        : [scoop.material];

    materials.forEach((material) => {
        material?.dispose();
    });
};

export const removeExtraScoop = (state) => {
    if (!state.extraScoop) {
        return;
    }

    state.extraScoop.removeFromParent();
    disposeScoop(state.extraScoop);

    state.extraScoop = null;
};

export const addExtraScoop = async ({
    scene,
    state,
    flavor
    }) => {
    if (
        !state.currentBaseModel ||
        !state.currentScoop
    ) {
        console.warn(
        "Er is nog geen basis of eerste ijsbol geladen."
        );

        return null;
    }

    removeExtraScoop(state);

    const extraScoop =
        await createScoopFromConeFile();

    setScoopColor(
        extraScoop,
        flavor.color
    );

    state.currentBaseModel.updateMatrixWorld(true);
    state.currentScoop.updateMatrixWorld(true);

    const firstBox = new THREE.Box3().setFromObject(
        state.currentScoop
    );

    const firstCenter = firstBox.getCenter(
        new THREE.Vector3()
    );

    const firstSize = firstBox.getSize(
        new THREE.Vector3()
    );

    extraScoop.updateMatrixWorld(true);

    const originalExtraBox =
        new THREE.Box3().setFromObject(extraScoop);

    const originalExtraSize =
        originalExtraBox.getSize(
        new THREE.Vector3()
        );

    const targetWidth =
        firstSize.x * 0.92;

    const scale =
        targetWidth / originalExtraSize.x;

    extraScoop.scale.setScalar(scale);
    extraScoop.updateMatrixWorld(true);

    const scaledExtraBox =
        new THREE.Box3().setFromObject(extraScoop);

    const scaledExtraSize =
        scaledExtraBox.getSize(
        new THREE.Vector3()
        );

    const overlap =
        firstSize.y * 0.50;

    const worldPosition = new THREE.Vector3(
        firstCenter.x,
        firstBox.max.y +
        scaledExtraSize.y / 2 -
        overlap,
        firstCenter.z
    );

    scene.add(extraScoop);

    extraScoop.position.copy(worldPosition);
    extraScoop.updateMatrixWorld(true);

    state.currentBaseModel.attach(extraScoop);

    state.extraScoop = extraScoop;

    return extraScoop;
};