const formatPrice = (price) => {
    if (!price || price === 0) {
        return "Inbegrepen";
    }

    return `+ €${price.toFixed(2)}`;
};

export const createBaseControls = ({
    bases,
    selectedBase,
    onBaseChange
    }) => {
    const controls = document.querySelector("#base-options");

    controls.innerHTML = "";

    bases.forEach((base) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "option-button";
        button.dataset.baseId = base._id;

        if (base._id === selectedBase?._id) {
        button.classList.add("option-button--active");
        }

        button.innerHTML = `
        <span class="option-button__name">
            ${base.name}
        </span>

        <span class="option-button__price">
            ${formatPrice(base.price)}
        </span>
        `;

        button.addEventListener("click", async () => {
        controls
            .querySelectorAll(".option-button")
            .forEach((item) => {
            item.classList.remove(
                "option-button--active"
            );
            });

        button.classList.add(
            "option-button--active"
        );

        try {
            button.disabled = true;
            await onBaseChange(base);
        } catch (error) {
            console.error(error);

            button.classList.remove(
            "option-button--active"
            );
        } finally {
            button.disabled = false;
        }
        });

        controls.appendChild(button);
    });
};

export const createFlavorControls = ({
    flavors,
    selectedFlavor,
    onFlavorChange
    }) => {
    const controls = document.querySelector(
        "#flavor-options"
    );

    controls.innerHTML = "";

    flavors.forEach((flavor) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className =
        "option-button flavor-button";

        button.dataset.flavorId = flavor._id;

        if (flavor._id === selectedFlavor?._id) {
        button.classList.add(
            "option-button--active"
        );
        }

        button.innerHTML = `
        <span class="flavor-button__content">
            <span
            class="flavor-button__color"
            style="background-color: ${flavor.color}"
            ></span>

            <span class="option-button__name">
            ${flavor.name}
            </span>
        </span>

        <span class="option-button__price">
            ${formatPrice(flavor.price)}
        </span>
        `;

        button.addEventListener("click", () => {
        controls
            .querySelectorAll(".option-button")
            .forEach((item) => {
            item.classList.remove(
                "option-button--active"
            );
            });

        button.classList.add(
            "option-button--active"
        );

        const customNameInput = document.querySelector(
            "#custom-flavor-name"
        );

        const customColorInput = document.querySelector(
            "#custom-flavor-color"
        );

        const customColorValue = document.querySelector(
            "#custom-flavor-color-value"
        );

        if (customNameInput) {
            customNameInput.value = "";
        }

        if (customColorInput) {
            customColorInput.value = flavor.color;
        }

        if (customColorValue) {
            customColorValue.textContent = flavor.color;
        }

        onFlavorChange(flavor);
        });

        controls.appendChild(button);
    });
};

export const createCustomFlavorControls = ({
    initialName = "",
    initialColor = "#f5a9c6",
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
        console.warn(
            "De velden voor de eigen smaak werden niet gevonden."
        );

        return;
    }

    nameInput.value = initialName;
    colorInput.value = initialColor;
    colorValue.textContent = initialColor;

    const emitChange = () => {
        const name = nameInput.value;
        const color = colorInput.value;

        colorValue.textContent = color;

        document
            .querySelectorAll(
                "#flavor-options .option-button"
            )
            .forEach((button) => {
                button.classList.remove(
                    "option-button--active"
                );
            });

        onCustomFlavorChange({
            name,
            color
        });
    };

    nameInput.addEventListener(
        "input",
        emitChange
    );

    colorInput.addEventListener(
        "input",
        emitChange
    );
};