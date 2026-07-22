import "./style.css";
import "./orderStyle.css";

import logoImage from "./assets/b&j-logo.svg";

import {
    createOrder
} from "./api/api.js";

const orderApp =
    document.querySelector("#order-app");

const storedConfiguration =
    localStorage.getItem(
        "iceCreamConfiguration"
    );

let configuration = null;

try {
    configuration =
        storedConfiguration
        ? JSON.parse(storedConfiguration)
        : null;
    } catch (error) {
    console.error(
        "Configuratie kon niet gelezen worden:",
        error
    );
}

const getFlavorName = (flavor) => {
    if (!flavor) {
        return "Niet gekozen";
    }

    return (
        flavor.name ||
        flavor.customName ||
        "Eigen smaak"
    );
};

const formatPrice = (price) => {
    return `€${Number(price || 0)
        .toFixed(2)
        .replace(".", ",")}`;
};

const calculatePreviewPrice = () => {
    if (!configuration) {
        return 0;
    }

    const basePrice =
        Number(
        configuration.base?.price || 0
        );

    const flavorsPrice =
        configuration.flavors.reduce(
        (total, flavor) => {
            return (
            total +
            Number(flavor?.price || 0)
            );
        },
        0
        );

    const toppingsPrice =
        configuration.toppings.reduce(
        (total, topping) => {
            return (
            total +
            Number(topping?.price || 0)
            );
        },
        0
        );

    return (
        basePrice +
        flavorsPrice +
        toppingsPrice
    );
};

if (!configuration) {
    orderApp.innerHTML = `
        <main class="order-page">
        <section class="order-empty">
            <img
            class="order-page__logo"
            src="${logoImage}"
            alt="Ben & Jerry's"
            />

            <h1>
            Geen ijsje gevonden
            </h1>

            <p>
            Stel eerst een ijsje samen voordat
            je een bestelling plaatst.
            </p>

            <a
            class="order-link-button"
            href="/"
            >
            Terug naar configurator
            </a>
        </section>
        </main>
    `;
    } else {
    const primaryFlavor =
        configuration.flavors[0];

    const extraFlavor =
        configuration.flavors[1];

    const toppingNames =
        configuration.toppings.length
        ? configuration.toppings
            .map((topping) => topping.name)
            .join(", ")
        : "Geen toppings";

    orderApp.innerHTML = `
        <main class="order-page">
        <section class="order-layout">
            <div class="order-form-panel">
            <header class="order-header">
                <a
                class="order-back-link"
                href="/"
                >
                ← Terug naar configurator
                </a>

                <img
                class="order-page__logo"
                src="${logoImage}"
                alt="Ben & Jerry's"
                />

                <p class="order-header__subtitle">
                Vul je gegevens in
                </p>
            </header>

            <form
                id="order-form"
                class="order-form"
                novalidate
            >
                <h1 class="order-title">
                Bestel je ijsje
                </h1>

                <p class="order-intro">
                Vul je gegevens in om je
                bestelling te plaatsen.
                </p>

                <div
                id="order-message"
                class="order-message"
                hidden
                ></div>

                <label class="field">
                <span class="field__label">
                    Naam
                </span>

                <input
                    id="customer-name"
                    class="field__input"
                    type="text"
                    autocomplete="name"
                    placeholder="Voor- en achternaam"
                    required
                />

                <span
                    id="customer-name-error"
                    class="field__error"
                ></span>
                </label>

                <div class="order-form__row">
                <label class="field">
                    <span class="field__label">
                    Straat
                    </span>

                    <input
                    id="street"
                    class="field__input"
                    type="text"
                    autocomplete="street-address"
                    placeholder="Straat"
                    required
                    />

                    <span
                    id="street-error"
                    class="field__error"
                    ></span>
                </label>

                <label class="field">
                    <span class="field__label">
                    Huisnummer
                    </span>

                    <input
                    id="house-number"
                    class="field__input"
                    type="text"
                    autocomplete="address-line2"
                    placeholder="12"
                    required
                    />

                    <span
                    id="house-number-error"
                    class="field__error"
                    ></span>
                </label>
                </div>

                <div class="order-form__row">
                <label class="field">
                    <span class="field__label">
                    Postcode
                    </span>

                    <input
                    id="postal-code"
                    class="field__input"
                    type="text"
                    inputmode="numeric"
                    autocomplete="postal-code"
                    placeholder="2800"
                    maxlength="10"
                    required
                    />

                    <span
                    id="postal-code-error"
                    class="field__error"
                    ></span>
                </label>

                <label class="field">
                    <span class="field__label">
                    Gemeente
                    </span>

                    <input
                    id="city"
                    class="field__input"
                    type="text"
                    autocomplete="address-level2"
                    placeholder="Mechelen"
                    required
                    />

                    <span
                    id="city-error"
                    class="field__error"
                    ></span>
                </label>
                </div>

                <button
                id="confirm-order-button"
                class="order-button"
                type="submit"
                >
                Bestelling plaatsen
                </button>
            </form>
            </div>

            <aside class="order-summary-panel">
            <div class="order-summary-card">
                <h2 class="order-summary-card__title">
                Jouw bestelling
                </h2>

                <div class="order-summary-row">
                <span>Basis</span>

                <strong>
                    ${configuration.base.name}
                </strong>
                </div>

                <div class="order-summary-row">
                <span>Smaak 1</span>

                <strong>
                    ${getFlavorName(primaryFlavor)}
                </strong>
                </div>

                ${
                extraFlavor
                    ? `
                    <div class="order-summary-row">
                        <span>Smaak 2</span>

                        <strong>
                        ${getFlavorName(extraFlavor)}
                        </strong>
                    </div>
                    `
                    : ""
                }

                <div class="order-summary-row">
                <span>Toppings</span>

                <strong>
                    ${toppingNames}
                </strong>
                </div>

                <div
                class="
                    order-summary-row
                    order-summary-row--total
                "
                >
                <span>Totaal</span>

                <strong>
                    ${formatPrice(
                    calculatePreviewPrice()
                    )}
                </strong>
                </div>
            </div>
            </aside>
        </section>
        </main>
    `;

    const form =
        document.querySelector("#order-form");

    const orderButton =
        document.querySelector(
        "#confirm-order-button"
        );

    const orderMessage =
        document.querySelector(
        "#order-message"
        );

    const fields = {
        customerName:
        document.querySelector(
            "#customer-name"
        ),

        street:
        document.querySelector("#street"),

        houseNumber:
        document.querySelector(
            "#house-number"
        ),

        postalCode:
        document.querySelector(
            "#postal-code"
        ),

        city:
        document.querySelector("#city")
    };

    const errors = {
        customerName:
        document.querySelector(
            "#customer-name-error"
        ),

        street:
        document.querySelector(
            "#street-error"
        ),

        houseNumber:
        document.querySelector(
            "#house-number-error"
        ),

        postalCode:
        document.querySelector(
            "#postal-code-error"
        ),

        city:
        document.querySelector(
            "#city-error"
        )
    };

    const clearErrors = () => {
        Object.values(errors).forEach(
        (errorElement) => {
            errorElement.textContent = "";
        }
        );

        Object.values(fields).forEach(
        (field) => {
            field.classList.remove(
            "field__input--error"
            );
        }
        );
    };

    const setFieldError = (
        fieldName,
        message
    ) => {
        errors[fieldName].textContent =
        message;

        fields[fieldName].classList.add(
        "field__input--error"
        );
    };

    const validateForm = () => {
        clearErrors();

        let isValid = true;

        if (!fields.customerName.value.trim()) {
        setFieldError(
            "customerName",
            "Vul je naam in."
        );

        isValid = false;
        }

        if (!fields.street.value.trim()) {
        setFieldError(
            "street",
            "Vul je straat in."
        );

        isValid = false;
        }

        if (
        !fields.houseNumber.value.trim()
        ) {
        setFieldError(
            "houseNumber",
            "Vul je huisnummer in."
        );

        isValid = false;
        }

        if (!fields.postalCode.value.trim()) {
        setFieldError(
            "postalCode",
            "Vul je postcode in."
        );

        isValid = false;
        }

        if (!fields.city.value.trim()) {
        setFieldError(
            "city",
            "Vul je gemeente in."
        );

        isValid = false;
        }

        return isValid;
    };

    const mapFlavorForApi = (flavor) => {
        if (!flavor) {
        return null;
        }

        if (
        flavor.isCustom ||
        !flavor._id
        ) {
        return {
            flavor: null,
            customName:
            flavor.name ||
            flavor.customName ||
            "Eigen smaak",
            customColor:
            flavor.color ||
            flavor.customColor
        };
        }

        return {
        flavor: flavor._id,
        customName: null,
        customColor: null
        };
    };

    form.addEventListener(
        "submit",
        async (event) => {
        event.preventDefault();

        orderMessage.hidden = true;
        orderMessage.textContent = "";
        orderMessage.className =
            "order-message";

        if (!validateForm()) {
            return;
        }

        const flavors =
            configuration.flavors
            .map(mapFlavorForApi)
            .filter(Boolean);

        const toppingIds =
            configuration.toppings
            .map((topping) => topping._id)
            .filter(Boolean);

        const orderData = {
            customerName:
            fields.customerName.value.trim(),

            address: {
            street:
                fields.street.value.trim(),

            houseNumber:
                fields.houseNumber.value.trim(),

            postalCode:
                fields.postalCode.value.trim(),

            city:
                fields.city.value.trim()
            },

            iceCreamBase:
            configuration.base._id,

            flavors,

            toppings: toppingIds
        };

        try {
            orderButton.disabled = true;
            orderButton.textContent =
            "Bestelling plaatsen...";

            const createdOrder =
            await createOrder(orderData);

            localStorage.removeItem(
            "iceCreamConfiguration"
            );

            form.innerHTML = `
            <section class="order-success">
                <div class="order-success__icon">
                ✓
                </div>

                <h1>
                Bestelling geplaatst
                </h1>

                <p>
                Bedankt, ${createdOrder.customerName}.
                Je bestelling is goed ontvangen.
                </p>

                <p>
                De status van je bestelling is:
                <strong>
                    ${createdOrder.status}
                </strong>
                </p>

                <a
                class="order-link-button"
                href="/"
                >
                Nieuw ijsje maken
                </a>
            </section>
            `;
        } catch (error) {
            console.error(error);

            orderMessage.hidden = false;
            orderMessage.classList.add(
            "order-message--error"
            );

            orderMessage.textContent =
            error.message ||
            "Bestelling plaatsen is mislukt.";
        } finally {
            orderButton.disabled = false;
            orderButton.textContent =
            "Bestelling plaatsen";
        }
        }
    );
}