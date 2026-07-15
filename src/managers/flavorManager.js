import { setScoopColor } from "./scoopManager.js";

export const applyPresetFlavor = ({
    state,
    flavor
    }) => {
    if (!state.currentScoop) {
        throw new Error(
        "Er is geen ijsbol beschikbaar om te kleuren."
        );
    }

    setScoopColor(
        state.currentScoop,
        flavor.color
    );

    state.selectedFlavor = flavor;
    state.customFlavorName = "";
    state.customFlavorColor = flavor.color;
};

export const applyCustomFlavor = ({
    state,
    name,
    color
    }) => {
    if (!state.currentScoop) {
        throw new Error(
        "Er is geen ijsbol beschikbaar om te kleuren."
        );
    }

    setScoopColor(
        state.currentScoop,
        color
    );

    state.selectedFlavor = null;
    state.customFlavorName = name.trim();
    state.customFlavorColor = color;
};

export const getCurrentFlavor = (state) => {
    if (state.selectedFlavor) {
        return {
        type: "preset",
        id: state.selectedFlavor._id,
        name: state.selectedFlavor.name,
        color: state.selectedFlavor.color,
        price: state.selectedFlavor.price
        };
    }

    return {
        type: "custom",
        id: null,
        name: state.customFlavorName || "Eigen smaak",
        color: state.customFlavorColor,
        price: 0
    };
};