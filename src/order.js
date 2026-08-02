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
        <main class="orderPage">
        <section class="orderEmpty">
            <img
            class="orderLogo"
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
            class="orderLinkButton"
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
        <main class="orderPage">
        <section class="orderLayout">
            <div class="orderFormSidebar">
            <header class="orderHeader">
                <a
                class="orderBackLink"
                href="/"
                >
                ← Terug naar configurator
                </a>

                <img
                class="orderLogo"
                src="${logoImage}"
                alt="Ben & Jerry's"
                />

                <p class="orderSubtitle">
                Vul je gegevens in
                </p>
            </header>

            <form
                id="orderForm"
                class="orderForm"
                novalidate
            >
                <h1 class="orderTitle">
                Bestel je ijsje
                </h1>

                <p class="orderIntro">
                Vul je gegevens in om je
                bestelling te plaatsen.
                </p>

                <div
                id="orderMessage"
                class="orderMessage"
                hidden
                ></div>

                <label class="inputGroup">
                <span class="iinputLabel">
                    Naam
                </span>

                <input
                    id="customer-name"
                    class="input"
                    type="text"
                    autocomplete="name"
                    placeholder="Voor- en achternaam"
                    required
                />

                <span
                    id="customer-name-error"
                    class="inputGroupError"
                ></span>
                </label>

                <div class="orderRow">
                <label class="inputGroup">
                    <span class="iinputLabel">
                    Straat
                    </span>

                    <input
                    id="street"
                    class="input"
                    type="text"
                    autocomplete="street-address"
                    placeholder="Straat"
                    required
                    />

                    <span
                    id="street-error"
                    class="inputGroupError"
                    ></span>
                </label>

                <label class="inputGroup">
                    <span class="iinputLabel">
                    Huisnummer
                    </span>

                    <input
                    id="house-number"
                    class="input"
                    type="text"
                    autocomplete="address-line2"
                    placeholder="12"
                    required
                    />

                    <span
                    id="house-number-error"
                    class="inputGroupError"
                    ></span>
                </label>
                </div>

                <div class="orderRow">
                <label class="inputGroup">
                    <span class="iinputLabel">
                    Postcode
                    </span>

                    <input
                    id="postal-code"
                    class="input"
                    type="text"
                    inputmode="numeric"
                    autocomplete="postal-code"
                    placeholder="2800"
                    maxlength="10"
                    required
                    />

                    <span
                    id="postal-code-error"
                    class="inputGroupError"
                    ></span>
                </label>

                <label class="inputGroup">
                    <span class="iinputLabel">
                    Gemeente
                    </span>

                    <input
                    id="city"
                    class="input"
                    type="text"
                    autocomplete="address-level2"
                    placeholder="Mechelen"
                    required
                    />

                    <span
                    id="city-error"
                    class="inputGroupError"
                    ></span>
                </label>
                </div>

                <button
                id="confirm-primaryButton"
                class="primaryButton"
                type="submit"
                >
                Bestelling plaatsen
                </button>
            </form>
            </div>

            <aside class="orderSummarySidebar">
            <div class="orderSummaryCard">
                <h2 class="orderSummaryTitle">
                Jouw bestelling
                </h2>

                <div class="orderSummaryItem">
                <span>Basis</span>

                <strong>
                    ${configuration.base.name}
                </strong>
                </div>

                <div class="orderSummaryItem">
                <span>Smaak 1</span>

                <strong>
                    ${getFlavorName(primaryFlavor)}
                </strong>
                </div>

                ${
                extraFlavor
                    ? `
                    <div class="orderSummaryItem">
                        <span>Smaak 2</span>

                        <strong>
                        ${getFlavorName(extraFlavor)}
                        </strong>
                    </div>
                    `
                    : ""
                }

                <div class="orderSummaryItem">
                <span>Toppings</span>

                <strong>
                    ${toppingNames}
                </strong>
                </div>

                <div
                class="
                    orderSummaryItem
                    orderSummaryItemTotal
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
        document.querySelector("#orderForm");

    const orderButton =
        document.querySelector(
        "#confirm-primaryButton"
        );

    const orderMessage =
        document.querySelector(
        "#orderMessage"
        );

    const inputGroups = {
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

        Object.values(inputGroups).forEach(
        (inputGroup) => {
            inputGroup.classList.remove(
            "inputError"
            );
        }
        );
    };

    const setinputGroupError = (
        inputGroupName,
        message
    ) => {
        errors[inputGroupName].textContent =
        message;

        inputGroups[inputGroupName].classList.add(
        "inputError"
        );
    };

    const validateForm = () => {
        clearErrors();

        let isValid = true;

        if (!inputGroups.customerName.value.trim()) {
        setinputGroupError(
            "customerName",
            "Vul je naam in."
        );

        isValid = false;
        }

        if (!inputGroups.street.value.trim()) {
        setinputGroupError(
            "street",
            "Vul je straat in."
        );

        isValid = false;
        }

        if (
        !inputGroups.houseNumber.value.trim()
        ) {
        setinputGroupError(
            "houseNumber",
            "Vul je huisnummer in."
        );

        isValid = false;
        }

        if (!inputGroups.postalCode.value.trim()) {
        setinputGroupError(
            "postalCode",
            "Vul je postcode in."
        );

        isValid = false;
        }

        if (!inputGroups.city.value.trim()) {
        setinputGroupError(
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
            "orderMessage";

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
            inputGroups.customerName.value.trim(),

            address: {
            street:
                inputGroups.street.value.trim(),

            houseNumber:
                inputGroups.houseNumber.value.trim(),

            postalCode:
                inputGroups.postalCode.value.trim(),

            city:
                inputGroups.city.value.trim()
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
            <section class="orderSuccess">
                <div class="orderSuccessIcon">
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
                class="orderLinkButton"
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
            "orderMessage--error"
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