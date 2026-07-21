import "./style.css";

import logoImage from "./assets/b&j-logo.svg";

import {
  getBases,
  getFlavors
} from "./api/api.js";

import { createScene } from "./scene/scene.js";
import { createCamera } from "./scene/camera.js";
import { createRenderer } from "./scene/renderer.js";
import { addLights } from "./scene/lights.js";
import { createControls } from "./scene/controls.js";

import {
  configuratorState
} from "./state/configuratorState.js";

import {
  showBaseModel
} from "./managers/baseManager.js";

import {
  applyPresetFlavor,
  applyCustomFlavor,
  getCurrentFlavor
} from "./managers/flavorManager.js";

import {
  addExtraScoop,
  removeExtraScoop
} from "./managers/scoopManager.js";

import {
  createBaseControls,
  createFlavorDropdown,
  createCustomFlavorControls,
  createExtraFlavorControls
} from "./ui/controls.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="configurator">
    <section class="viewer">
      <div id="three-container"></div>
    </section>

    <aside class="panel">
      <header class="panel-header">
        <img
          class="panel-header__logo"
          src="${logoImage}"
          alt="Ben & Jerry's"
        />

        <p class="panel-header__subtitle">
          Ice cream factory
        </p>
      </header>

      <div class="panel-content">
        <section class="configuration-section">
          <h2 class="step-title">
            Stap 1
          </h2>

          <p class="step-description">
            Kies je basis
          </p>

          <div
            id="base-options"
            class="base-options"
          >
            <p>Opties laden...</p>
          </div>
        </section>

        <section class="configuration-section">
          <h2 class="step-title">
            Stap 2
          </h2>

          <p
            id="primary-flavor-label"
            class="step-description"
          >
            Kies je smaak
          </p>

          <div id="primary-flavor-select-wrapper">
            <div class="select-field">
              <span
                id="selected-flavor-color-preview"
                class="select-field__color"
              ></span>

              <select
                id="flavor-select"
                class="select-field__select"
              >
                <option>
                  Smaken laden...
                </option>
              </select>

              <span class="select-field__arrow">
                ⌄
              </span>
            </div>
          </div>

          <div
            id="primary-flavor-summary"
            class="selected-flavor-card"
            hidden
          >
            <span
              id="primary-flavor-summary-color"
              class="selected-flavor-card__color"
            ></span>

            <span
              id="primary-flavor-summary-name"
              class="selected-flavor-card__name"
            >
              Nog niet gekozen
            </span>

            <span
              id="primary-flavor-summary-price"
              class="selected-flavor-card__price"
            ></span>
          </div>

          <div id="primary-custom-flavor">
            <div class="custom-flavor__divider">
              <span>
                Of kies je eigen smaak
              </span>
            </div>

            <label class="field">
              <span class="field__label">
                Naam
              </span>

              <input
                id="custom-flavor-name"
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
                  id="custom-flavor-color"
                  class="color-picker__input"
                  type="color"
                  value="#edb8cc"
                />

                <span
                  id="custom-flavor-color-value"
                  class="color-picker__value"
                >
                  #EDB8CC
                </span>
              </div>
            </label>
          </div>

          <div
            id="extra-flavor-container"
            class="extra-flavor-container"
            hidden
          ></div>

          <button
            id="add-flavor-button"
            class="add-flavor-button"
            type="button"
          >
            <span class="add-flavor-button__icon">
              +
            </span>

            Voeg nog een smaak toe
          </button>
        </section>

        <section
          class="configuration-section summary-section"
        >
          <h2 class="step-title">
            Stap 3
          </h2>

          <div class="summary-row">
            <span>
              Gekozen basis
            </span>

            <strong id="selected-base-name">
              Nog niet gekozen
            </strong>
          </div>

          <div class="summary-row">
            <span>
              Gekozen smaak
            </span>

            <strong id="selected-flavor-name">
              Nog niet gekozen
            </strong>
          </div>

          <div
            id="extra-flavor-summary"
            class="summary-row"
            hidden
          >
            <span>
              Extra smaak
            </span>

            <strong id="extra-flavor-name"></strong>
          </div>
        </section>
      </div>

      <footer class="panel-footer">
        <button
          id="order-button"
          class="order-button"
          type="button"
        >
          Bestel nu
        </button>
      </footer>
    </aside>
  </main>
`;

const container = document.querySelector(
  "#three-container"
);

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

container.appendChild(
  renderer.domElement
);

addLights(scene);

const controls = createControls(
  camera,
  renderer
);

const updateSummary = () => {
  const baseName = document.querySelector(
    "#selected-base-name"
  );

  const flavorName = document.querySelector(
    "#selected-flavor-name"
  );

  const extraSummary = document.querySelector(
    "#extra-flavor-summary"
  );

  const extraFlavorName = document.querySelector(
    "#extra-flavor-name"
  );

  baseName.textContent =
    configuratorState.selectedBase?.name ||
    "Nog niet gekozen";

  const currentFlavor = getCurrentFlavor(
    configuratorState
  );

  flavorName.textContent =
    currentFlavor.name;

  if (configuratorState.extraFlavor) {
    extraSummary.hidden = false;

    extraFlavorName.textContent =
      configuratorState.extraFlavor.name;
  } else {
    extraSummary.hidden = true;
    extraFlavorName.textContent = "";
  }
};

const loadConfigurator = async () => {
  try {
    const [bases, flavors] =
      await Promise.all([
        getBases(),
        getFlavors()
      ]);

    if (!bases.length) {
      throw new Error(
        "Er zijn geen bases gevonden."
      );
    }

    if (!flavors.length) {
      throw new Error(
        "Er zijn geen smaken gevonden."
      );
    }

    configuratorState.bases = bases;
    configuratorState.flavors = flavors;

    configuratorState.selectedBase =
      bases[0];

    configuratorState.selectedFlavor =
      flavors[0];

    await showBaseModel({
      scene,
      state: configuratorState,
      base: bases[0]
    });

    applyPresetFlavor({
      state: configuratorState,
      flavor: flavors[0]
    });

    createBaseControls({
      bases,

      selectedBase:
        configuratorState.selectedBase,

      onBaseChange: async (base) => {
        await showBaseModel({
          scene,
          state: configuratorState,
          base
        });

        if (
          configuratorState.extraFlavor
        ) {
          await addExtraScoop({
            scene,
            state: configuratorState,
            flavor:
              configuratorState.extraFlavor
          });
        }

        updateSummary();
      }
    });

    createFlavorDropdown({
      flavors,

      selectedFlavor:
        configuratorState.selectedFlavor,

      onFlavorChange: (flavor) => {
        applyPresetFlavor({
          state: configuratorState,
          flavor
        });

        updateSummary();
      }
    });

    createCustomFlavorControls({
      initialName:
        configuratorState.customFlavorName,

      initialColor:
        configuratorState.customFlavorColor,

      onCustomFlavorChange: ({
        name,
        color
      }) => {
        applyCustomFlavor({
          state: configuratorState,
          name,
          color
        });

        updateSummary();
      }
    });

    createExtraFlavorControls({
      flavors,

      getPrimaryFlavor: () => {
        return getCurrentFlavor(
          configuratorState
        );
      },

      onAddFlavor: async (flavor) => {
        configuratorState.extraFlavor =
          flavor;

        await addExtraScoop({
          scene,
          state: configuratorState,
          flavor
        });

        updateSummary();
      },

      onRemoveFlavor: () => {
        removeExtraScoop(
          configuratorState
        );

        configuratorState.extraFlavor =
          null;

        updateSummary();
      }
    });

    updateSummary();
  } catch (error) {
    console.error(error);

    const baseOptions =
      document.querySelector(
        "#base-options"
      );

    if (baseOptions) {
      baseOptions.innerHTML = `
        <p class="error-message">
          De opties konden niet geladen worden.
        </p>
      `;
    }
  }
};

const orderButton =
  document.querySelector(
    "#order-button"
  );

orderButton.addEventListener(
  "click",
  () => {
    const currentFlavor =
      getCurrentFlavor(
        configuratorState
      );

    const orderPreview = {
      base:
        configuratorState.selectedBase,

      flavor:
        currentFlavor,

      extraFlavor:
        configuratorState.extraFlavor
    };

    console.log(
      "Bestelling:",
      orderPreview
    );

    const extraFlavorText =
      configuratorState.extraFlavor
        ? ` en ${configuratorState.extraFlavor.name}`
        : "";

    alert(
      `Je koos ${configuratorState.selectedBase?.name} met ${currentFlavor.name}${extraFlavorText}.`
    );
  }
);

loadConfigurator();

const handleResize = () => {
  const width =
    container.clientWidth;

  const height =
    container.clientHeight;

  camera.aspect =
    width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(
    width,
    height
  );

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );
};

window.addEventListener(
  "resize",
  handleResize
);

handleResize();

const animate = () => {
  requestAnimationFrame(
    animate
  );

  controls.update();

  renderer.render(
    scene,
    camera
  );
};

animate();