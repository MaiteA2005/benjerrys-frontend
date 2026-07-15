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