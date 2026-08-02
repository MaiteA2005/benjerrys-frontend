const formatPrice = (price) => {
    if (!price || price === 0) {
        return "Inbegrepen";
    }

    return `+ €${price.toFixed(2).replace(".", ",")}`;
};

const createFlavorSelectOption = (flavor) => {
    const option = document.createElement("option");

    option.value = flavor._id;
    option.textContent = `${flavor.name}  ${formatPrice(flavor.price)}`;

    return option;
};

export const createBaseControls = ({
    bases,
    selectedBase,
    onBaseChange
    }) => {
    const controls = document.querySelector("#baseList");

    if (!controls) {
        return;
    }

    controls.innerHTML = "";

    bases.forEach((base) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "baseOption";
        button.dataset.baseId = base._id;

        if (base._id === selectedBase?._id) {
        button.classList.add("baseOptionActive");
        }

        button.innerHTML = `
        <span class="baseOptionName">
            ${base.name}
        </span>

        <span class="baseOptionPrice">
            ${formatPrice(base.price)}
        </span>
        `;

        button.addEventListener("click", async () => {
        controls
            .querySelectorAll(".baseOption")
            .forEach((item) => {
            item.classList.remove("baseOptionActive");
            });

        button.classList.add("baseOptionActive");

        try {
            button.disabled = true;
            await onBaseChange(base);
        } catch (error) {
            console.error(error);
            button.classList.remove("baseOptionActive");
        } finally {
            button.disabled = false;
        }
        });

        controls.appendChild(button);
    });
};

export const createFlavorDropdown = ({
    flavors,
    selectedFlavor,
    onFlavorChange
    }) => {
    const select = document.querySelector("#flavor-select");
    const colorPreview = document.querySelector(
        "#selected-flavor-color-preview"
    );

    if (!select) {
        return;
    }

    select.innerHTML = "";

    flavors.forEach((flavor) => {
        select.appendChild(
        createFlavorSelectOption(flavor)
        );
    });

    if (selectedFlavor?._id) {
        select.value = selectedFlavor._id;
    }

    const updateFlavor = () => {
        const flavor = flavors.find(
        (item) => item._id === select.value
        );

        if (!flavor) {
        return;
        }

        if (colorPreview) {
        colorPreview.style.backgroundColor = flavor.color;
        }

        onFlavorChange(flavor);
    };

    const initialFlavor = flavors.find(
        (item) => item._id === select.value
    );

    if (initialFlavor && colorPreview) {
        colorPreview.style.backgroundColor =
        initialFlavor.color;
    }

    select.addEventListener("change", updateFlavor);
};

export const createCustomFlavorControls = ({
    initialName = "",
    initialColor = "#edb8cc",
    onCustomFlavorChange
    }) => {
    const nameInput = document.querySelector(
        "#custom-flavor-name"
    );

    const colorInput = document.querySelector(
        "#custom-flavor-color"
    );

    const colorValue = document.querySelector(
        "#custom-flavor-color-value"
    );

    if (!nameInput || !colorInput || !colorValue) {
        return;
    }

    nameInput.value = initialName;
    colorInput.value = initialColor;
    colorValue.textContent = initialColor.toUpperCase();

    const emitChange = () => {
        const name = nameInput.value;
        const color = colorInput.value;

        colorValue.textContent = color.toUpperCase();

        onCustomFlavorChange({
        name,
        color
        });
    };

    nameInput.addEventListener("input", emitChange);
    colorInput.addEventListener("input", emitChange);
};

const showCollapsedPrimaryFlavor = (flavor) => {
    const selectWrapper = document.querySelector(
        "#primary-flavor-select-wrapper"
    );

    const summary = document.querySelector(
        "#primary-flavor-summary"
    );

    const summaryColor = document.querySelector(
        "#primary-flavor-summary-color"
    );

    const summaryName = document.querySelector(
        "#primary-flavor-summary-name"
    );

    const summaryPrice = document.querySelector(
        "#primary-flavor-summary-price"
    );

    if (
        !selectWrapper ||
        !summary ||
        !summaryColor ||
        !summaryName ||
        !summaryPrice
    ) {
        return;
    }

    selectWrapper.hidden = true;
    summary.hidden = false;

    summaryColor.style.backgroundColor =
        flavor.color;

    summaryName.textContent =
        flavor.name;

    summaryPrice.textContent =
        formatPrice(flavor.price);
};

const showEditablePrimaryFlavor = () => {
    const selectWrapper = document.querySelector(
        "#primary-flavor-select-wrapper"
    );

    const summary = document.querySelector(
        "#primary-flavor-summary"
    );

    if (!selectWrapper || !summary) {
        return;
    }

    selectWrapper.hidden = false;
    summary.hidden = true;
};

export const createExtraFlavorControls = ({
    flavors,
    getPrimaryFlavor,
    onAddFlavor,
    onRemoveFlavor
    }) => {
    const addButton = document.querySelector(
        "#addFlavorButton"
    );

    const extraContainer = document.querySelector(
        "#extraFlavor"
    );

    const primaryFlavorLabel = document.querySelector(
        "#primary-flavor-label"
    );

    const primaryCustomFlavor = document.querySelector(
        "#primary-custom-flavor"
    );

    if (!addButton || !extraContainer) {
        return;
    }

    let isVisible = false;

    const showCollapsedPrimaryFlavor = (flavor) => {
        const selectWrapper = document.querySelector(
        "#primary-flavor-select-wrapper"
        );

        const summary = document.querySelector(
        "#primary-flavor-summary"
        );

        const summaryColor = document.querySelector(
        "#primary-flavor-summary-color"
        );

        const summaryName = document.querySelector(
        "#primary-flavor-summary-name"
        );

        const summaryPrice = document.querySelector(
        "#primary-flavor-summary-price"
        );

        if (
        !selectWrapper ||
        !summary ||
        !summaryColor ||
        !summaryName ||
        !summaryPrice
        ) {
        return;
        }

        selectWrapper.hidden = true;
        summary.hidden = false;

        summaryColor.style.backgroundColor =
        flavor.color;

        summaryName.textContent =
        flavor.name;

        summaryPrice.textContent =
        formatPrice(flavor.price);
    };

    const showEditablePrimaryFlavor = () => {
        const selectWrapper = document.querySelector(
        "#primary-flavor-select-wrapper"
        );

        const summary = document.querySelector(
        "#primary-flavor-summary"
        );

        if (!selectWrapper || !summary) {
        return;
        }

        selectWrapper.hidden = false;
        summary.hidden = true;
    };

    const getFlavorById = (id) => {
        return flavors.find(
        (flavor) => flavor._id === id
        );
    };

    const emitCustomFlavor = () => {
        const nameInput = document.querySelector(
        "#extra-custom-flavor-name"
        );

        const colorInput = document.querySelector(
        "#extra-custom-flavor-color"
        );

        const colorValue = document.querySelector(
        "#extra-custom-flavor-color-value"
        );

        if (
        !nameInput ||
        !colorInput ||
        !colorValue
        ) {
        return;
        }

        const color = colorInput.value;
        const name = nameInput.value.trim();

        colorValue.textContent =
        color.toUpperCase();

        onAddFlavor({
        _id: null,
        name: name || "Eigen smaak",
        color,
        price: 0,
        isCustom: true
        });
    };

    addButton.addEventListener(
        "click",
        () => {
        isVisible = !isVisible;

        if (!isVisible) {
            extraContainer.innerHTML = "";
            extraContainer.hidden = true;

            showEditablePrimaryFlavor();

            if (primaryFlavorLabel) {
            primaryFlavorLabel.textContent =
                "Kies je smaak";
            }

            if (primaryCustomFlavor) {
            primaryCustomFlavor.hidden = false;
            }

            addButton.innerHTML = `
            <span class="buttonIcon">
                +
            </span>

            Voeg nog een smaak toe
            `;

            onRemoveFlavor();

            return;
        }

        extraContainer.hidden = false;

        if (primaryFlavorLabel) {
            primaryFlavorLabel.textContent =
            "Smaak 1";
        }

        if (primaryCustomFlavor) {
            primaryCustomFlavor.hidden = true;
        }

        const primaryFlavor =
            getPrimaryFlavor();

        if (primaryFlavor) {
            showCollapsedPrimaryFlavor(
            primaryFlavor
            );
        }

        extraContainer.innerHTML = `
            <div class="extraFlavorBlock">
            <label class="inputGroup">
                <span class="iinputLabel">
                Kies je 2de smaak
                </span>

                <div class="selectBox">
                <span
                    id="extra-flavor-color-preview"
                    class="selectColor"
                ></span>

                <select
                    id="extra-flavor-select"
                    class="selectInput"
                ></select>

                <span class="selectArrow">
                    ⌄
                </span>
                </div>
            </label>

            <div class="flavorDivider">
                <span>
                Of kies je eigen smaak
                </span>
            </div>

            <label class="inputGroup">
                <span class="iinputLabel">
                Naam
                </span>

                <input
                id="extra-custom-flavor-name"
                class="input"
                type="text"
                maxlength="40"
                placeholder="Naam"
                />
            </label>

            <label class="inputGroup">
                <span class="iinputLabel">
                Kies je kleur
                </span>

                <div class="colorPicker">
                <input
                    id="extra-custom-flavor-color"
                    class="colorInput"
                    type="color"
                    value="#edb8cc"
                />

                <span
                    id="extra-custom-flavor-color-value"
                    class="colorValue"
                >
                    #EDB8CC
                </span>
                </div>
            </label>
            </div>
        `;

        const select = document.querySelector(
            "#extra-flavor-select"
        );

        const colorPreview =
            document.querySelector(
            "#extra-flavor-color-preview"
            );

        flavors.forEach((flavor) => {
            const option =
            document.createElement("option");

            option.value = flavor._id;

            option.textContent =
            `${flavor.name}  ${formatPrice(flavor.price)}`;

            select.appendChild(option);
        });

        const updatePresetFlavor = () => {
            const flavor = getFlavorById(
            select.value
            );

            if (!flavor) {
            return;
            }

            colorPreview.style.backgroundColor =
            flavor.color;

            onAddFlavor(flavor);
        };

        const firstFlavor = flavors[0];

        if (firstFlavor) {
            select.value = firstFlavor._id;

            colorPreview.style.backgroundColor =
            firstFlavor.color;

            onAddFlavor(firstFlavor);
        }

        select.addEventListener(
            "change",
            updatePresetFlavor
        );

        const customNameInput =
            document.querySelector(
            "#extra-custom-flavor-name"
            );

        const customColorInput =
            document.querySelector(
            "#extra-custom-flavor-color"
            );

        customNameInput.addEventListener(
            "input",
            emitCustomFlavor
        );

        customColorInput.addEventListener(
            "input",
            emitCustomFlavor
        );

        addButton.innerHTML = `
            <span class="buttonIcon">
            −
            </span>

            Verwijder extra smaak
        `;
        }
    );
};

export const createToppingDropdown = ({
    toppings,
    selectedTopping,
    onToppingChange
}) => {
    const select =
        document.querySelector(
            "#topping-select"
        );

    const colorPreview =
        document.querySelector(
            "#selected-topping-color-preview"
        );

    if (!select) {
        return;
    }

    select.innerHTML = "";

    const noToppingOption =
        document.createElement("option");

    noToppingOption.value = "";
    noToppingOption.textContent =
        "Geen topping";

    select.appendChild(
        noToppingOption
    );

    toppings.forEach((topping) => {
        const option =
            document.createElement(
                "option"
            );

        option.value = topping._id;

        option.textContent =
            `${topping.name}  ${formatPrice(
                topping.price
            )}`;

        select.appendChild(option);
    });

    select.value =
        selectedTopping?._id || "";

    const updatePreview = (
        topping
    ) => {
        if (!colorPreview) {
            return;
        }

        if (!topping) {
            colorPreview.style
                .backgroundColor =
                "transparent";

            colorPreview.style.border =
                "2px solid #d1d1d1";

            return;
        }

        colorPreview.style
            .backgroundColor =
            topping.color ||
            "transparent";

        colorPreview.style.border =
            "";
    };

    updatePreview(
        selectedTopping
    );

    const selectTopping =
        async () => {
            const toppingId =
                select.value;

            const topping =
                toppingId
                    ? toppings.find(
                        (item) =>
                            item._id ===
                            toppingId
                    )
                    : null;

            updatePreview(topping);

            try {
                select.disabled = true;

                await onToppingChange(
                    topping
                );
            } catch (error) {
                console.error(
                    "Topping toepassen mislukt:",
                    error
                );
            } finally {
                select.disabled = false;
            }
        };

    select.addEventListener(
        "change",
        selectTopping
    );
};