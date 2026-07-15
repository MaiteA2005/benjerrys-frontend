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
        <span class="option-button__name">${base.name}</span>
        <span class="option-button__price">
            ${base.price > 0 ? `+ €${base.price.toFixed(2)}` : "Inbegrepen"}
        </span>
        `;

        button.addEventListener("click", async () => {
        controls.querySelectorAll(".option-button").forEach((item) => {
            item.classList.remove("option-button--active");
        });

        button.classList.add("option-button--active");

        try {
            button.disabled = true;
            await onBaseChange(base);
        } catch (error) {
            console.error(error);
            button.classList.remove("option-button--active");
        } finally {
            button.disabled = false;
        }
        });

        controls.appendChild(button);
    });
};