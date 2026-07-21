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
    const controls = document.querySelector("#base-options");

    if (!controls) {
        return;
    }

    controls.innerHTML = "";

    bases.forEach((base) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "base-option";
        button.dataset.baseId = base._id;

        if (base._id === selectedBase?._id) {
        button.classList.add("base-option--active");
        }

        button.innerHTML = `
        <span class="base-option__name">
            ${base.name}
        </span>

        <span class="base-option__price">
            ${formatPrice(base.price)}
        </span>
        `;

        button.addEventListener("click", async () => {
        controls
            .querySelectorAll(".base-option")
            .forEach((item) => {
            item.classList.remove("base-option--active");
            });

        button.classList.add("base-option--active");

        try {
            button.disabled = true;
            await onBaseChange(base);
        } catch (error) {
            console.error(error);
            button.classList.remove("base-option--active");
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

export const createExtraFlavorControls = ({
    flavors,
    onAddFlavor,
    onRemoveFlavor
    }) => {
    const addButton = document.querySelector(
        "#add-flavor-button"
    );

    const extraContainer =
        document.querySelector(
        "#extra-flavor-container"
        );

    if (!addButton || !extraContainer) {
        return;
    }

    let isVisible = false;

    const formatExtraPrice = (price) => {
        if (!price || price === 0) {
        return "Inbegrepen";
        }

        return `+ €${price
        .toFixed(2)
        .replace(".", ",")}`;
    };

    const getFlavorById = (id) => {
        return flavors.find(
        (flavor) => flavor._id === id
        );
    };

    const emitCustomFlavor = () => {
        const nameInput =
        document.querySelector(
            "#extra-custom-flavor-name"
        );

        const colorInput =
        document.querySelector(
            "#extra-custom-flavor-color"
        );

        const colorValue =
        document.querySelector(
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

            addButton.innerHTML = `
            <span class="add-flavor-button__icon">
                +
            </span>

            Voeg nog een smaak toe
            `;

            onRemoveFlavor();

            return;
        }

        extraContainer.hidden = false;

        extraContainer.innerHTML = `
            <div class="extra-flavor-block">
            <label class="field">
                <span class="field__label">
                Kies je 2de smaak
                </span>

                <div class="select-field">
                <span
                    id="extra-flavor-color-preview"
                    class="select-field__color"
                ></span>

                <select
                    id="extra-flavor-select"
                    class="select-field__select"
                ></select>

                <span class="select-field__arrow">
                    ⌄
                </span>
                </div>
            </label>

            <div class="custom-flavor__divider">
                <span>Of kies je eigen smaak</span>
            </div>

            <label class="field">
                <span class="field__label">
                Naam
                </span>

                <input
                id="extra-custom-flavor-name"
                class="field__input"
                type="text"
                maxlength="40"
                placeholder="Naam"
                />
            </label>

            <label class="field">
                <span class="field__label">
                Kies je kleur
                </span>

                <div class="color-picker">
                <input
                    id="extra-custom-flavor-color"
                    class="color-picker__input"
                    type="color"
                    value="#edb8cc"
                />

                <span
                    id="extra-custom-flavor-color-value"
                    class="color-picker__value"
                >
                    #EDB8CC
                </span>
                </div>
            </label>
            </div>
        `;

        const select =
            document.querySelector(
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
            `${flavor.name} — ` +
            formatExtraPrice(flavor.price);

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
            <span class="add-flavor-button__icon">
            −
            </span>

            Verwijder extra smaak
        `;
        }
    );
};