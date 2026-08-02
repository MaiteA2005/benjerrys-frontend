import "./style.css";

import logoImage from "./assets/b&j-logo.svg";

import {
  getBases,
  getFlavors,
  getToppings
} from "./api/api.js";

import {createScene} from "./scene/scene.js";
import {createCamera} from "./scene/camera.js";
import {createRenderer} from "./scene/renderer.js";
import {addLights} from "./scene/lights.js";

import {
  createControls
} from "./scene/controls.js";

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
  applyTopping,
  refreshTopping,
  removeTopping
} from "./managers/toppingManager.js";

import {
  createBaseControls,
  createFlavorDropdown,
  createCustomFlavorControls,
  createExtraFlavorControls,
  createToppingDropdown
} from "./ui/controls.js";

const app =
  document.querySelector("#app");

app.innerHTML = `
  <main class="configurator">
    <section class="viewer">
      <div id="three-container"></div>
    </section>

    <aside class="sidebar">
      <header class="sidebarHeader">
        <img
          class="sidebarLogo"
          src="${logoImage}"
          alt="Ben & Jerry's"
        />

        <p class="sidebarSubtitle">
          Ice cream factory
        </p>
      </header>

      <div class="sidebarContent">
        <section class="step">
          <h2 class="stepTitle">
            Stap 1
          </h2>

          <p class="stepText">
            Kies je basis
          </p>

          <div
            id="baseList"
            class="baseList"
          >
            <p>Opties laden...</p>
          </div>
        </section>

        <section class="step">
          <h2 class="stepTitle">
            Stap 2
          </h2>

          <p
            id="primary-flavor-label"
            class="stepText"
          >
            Kies je smaak
          </p>

          <div id="primary-flavor-select-wrapper">
            <div class="selectBox">
              <span
                id="selected-flavor-color-preview"
                class="selectColor"
              ></span>

              <select
                id="flavor-select"
                class="selectInput"
              >
                <option>
                  Smaken laden...
                </option>
              </select>

              <span class="selectArrow">
                ⌄
              </span>
            </div>
          </div>

          <div
            id="primary-flavor-summary"
            class="flavorCard"
            hidden
          >
            <span
              id="primary-flavor-summary-color"
              class="flavorColor"
            ></span>

            <span
              id="primary-flavor-summary-name"
              class="flavorName"
            >
              Nog niet gekozen
            </span>

            <span
              id="primary-flavor-summary-price"
              class="flavorPrice"
            ></span>
          </div>

          <div id="primary-custom-flavor">
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
                id="custom-flavor-name"
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
                  id="custom-flavor-color"
                  class="colorInput"
                  type="color"
                  value="#edb8cc"
                />

                <span
                  id="custom-flavor-color-value"
                  class="colorValue"
                >
                  #EDB8CC
                </span>
              </div>
            </label>
          </div>

          <div
            id="extraFlavor"
            class="extraFlavor"
            hidden
          ></div>

          <button
            id="addFlavorButton"
            class="addFlavorButton"
            type="button"
          >
            <span class="buttonIcon">
              +
            </span>

            Voeg nog een smaak toe
          </button>
        </section>

        <section class="step">
          <h2 class="stepTitle">
            Stap 3
          </h2>

          <p class="stepText">
            Kies je topping
          </p>

          <div class="selectBox">
            <span
              id="selected-topping-color-preview"
              class="selectColor"
            ></span>

            <select
              id="topping-select"
              class="selectInput"
            >
              <option>
                Toppings laden...
              </option>
            </select>

            <span class="selectArrow">
              ⌄
            </span>
          </div>
        </section>

        <section
          class="
            step
            summary
          "
        >
          <h2 class="stepTitle">
            Jouw ijsje
          </h2>

          <div class="summaryItem">
            <span>
              Gekozen basis
            </span>

            <strong id="selected-base-name">
              Nog niet gekozen
            </strong>
          </div>

          <div class="summaryItem">
            <span>
              Gekozen smaak
            </span>

            <strong id="selected-flavor-name">
              Nog niet gekozen
            </strong>
          </div>

          <div
            id="extra-flavor-summary"
            class="summaryItem"
            hidden
          >
            <span>
              Extra smaak
            </span>

            <strong id="extra-flavor-name"></strong>
          </div>

          <div class="summaryItem">
            <span>
              Gekozen topping
            </span>

            <strong id="selected-topping-name">
              Geen topping gekozen
            </strong>
          </div>
        </section>
      </div>

      <footer class="sidebarFooter">
        <button
          id="primaryButton"
          class="primaryButton"
          type="button"
        >
          Bestel nu
        </button>
      </footer>
    </aside>
  </main>
`;

const container =
  document.querySelector(
    "#three-container"
  );

const scene =
  createScene();

const camera =
  createCamera();

const renderer =
  createRenderer();

container.appendChild(
  renderer.domElement
);

addLights(scene);

const controls =
  createControls(
    camera,
    renderer
  );

const updateSummary = () => {
  const baseName =
    document.querySelector(
      "#selected-base-name"
    );

  const flavorName =
    document.querySelector(
      "#selected-flavor-name"
    );

  const extraSummary =
    document.querySelector(
      "#extra-flavor-summary"
    );

  const extraFlavorName =
    document.querySelector(
      "#extra-flavor-name"
    );

  const toppingName =
    document.querySelector(
      "#selected-topping-name"
    );

  if (baseName) {
    baseName.textContent =
      configuratorState
        .selectedBase
        ?.name ||
      "Nog niet gekozen";
  }

  const currentFlavor =
    getCurrentFlavor(
      configuratorState
    );

  if (flavorName) {
    flavorName.textContent =
      currentFlavor?.name ||
      "Nog niet gekozen";
  }
  
  if (
    extraSummary &&
    extraFlavorName
  ) {
    if (
      configuratorState.extraFlavor
    ) {
      extraSummary.hidden = false;

      extraFlavorName.textContent =
        configuratorState
          .extraFlavor
          .name;
    } else {
      extraSummary.hidden = true;
      extraFlavorName.textContent = "";
    }
  }

  if (toppingName) {
    toppingName.textContent =
      configuratorState
        .selectedTopping
        ?.name ||
      "Geen topping gekozen";
  }
};

const loadConfigurator = async () => {
  try {
    const [
      bases,
      flavors,
      toppings
    ] = await Promise.all([
      getBases(),
      getFlavors(),
      getToppings()
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

    if (!toppings.length) {
      throw new Error(
        "Er zijn geen toppings gevonden."
      );
    }

    configuratorState.bases =
      bases;

    configuratorState.flavors =
      flavors;

    configuratorState.toppings =
      toppings;

    configuratorState.selectedBase =
      bases[0];

    configuratorState.selectedFlavor =
      flavors[0];

    configuratorState.selectedTopping =
      null;

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
        configuratorState
          .selectedBase,

      onBaseChange: async (
        base
      ) => {
        await showBaseModel({
          scene,
          state:
            configuratorState,
          base
        });

        if (
          configuratorState
            .extraFlavor
        ) {
          await addExtraScoop({
            scene,
            state:
              configuratorState,
            flavor:
              configuratorState
                .extraFlavor
          });
        }

        await refreshTopping({
          scene,
          state:
            configuratorState
        });

        updateSummary();
      }
    });

    createFlavorDropdown({
      flavors,

      selectedFlavor:
        configuratorState
          .selectedFlavor,

      onFlavorChange: (
        flavor
      ) => {
        applyPresetFlavor({
          state:
            configuratorState,
          flavor
        });

        updateSummary();
      }
    });

    createCustomFlavorControls({
      initialName:
        configuratorState
          .customFlavorName,

      initialColor:
        configuratorState
          .customFlavorColor,

      onCustomFlavorChange: ({
        name,
        color
      }) => {
        applyCustomFlavor({
          state:
            configuratorState,
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

      onAddFlavor: async (
        flavor
      ) => {
        configuratorState.extraFlavor =
          flavor;

        await addExtraScoop({
          scene,
          state:
            configuratorState,
          flavor
        });

        await refreshTopping({
          scene,
          state:
            configuratorState
        });

        updateSummary();
      },

      onRemoveFlavor: async () => {
        removeExtraScoop(
          configuratorState
        );

        configuratorState.extraFlavor =
          null;

        await refreshTopping({
          scene,
          state:
            configuratorState
        });

        updateSummary();
      }
    });

    createToppingDropdown({
      toppings,

      selectedTopping:
        configuratorState
          .selectedTopping,

      onToppingChange: async (
        topping
      ) => {
        if (!topping) {
          removeTopping(
            configuratorState
          );

          configuratorState.selectedTopping =
            null;

          updateSummary();

          return;
        }

        await applyTopping({
          scene,
          state:
            configuratorState,
          topping
        });

        updateSummary();
      }
    });

    updateSummary();
  } catch (error) {
    console.error(
      "Configurator laden mislukt:",
      error
    );

    const baseOptions =
      document.querySelector(
        "#baseList"
      );

    if (baseOptions) {
      baseOptions.innerHTML = `
        <p class="errorMessage">
          De opties konden niet geladen worden.
        </p>
      `;
    }

    const toppingSelect =
      document.querySelector(
        "#topping-select"
      );

    if (toppingSelect) {
      toppingSelect.innerHTML = `
        <option>
          Toppings konden niet geladen worden
        </option>
      `;

      toppingSelect.disabled = true;
    }
  }
};

const orderButton =
  document.querySelector(
    "#primaryButton"
  );

orderButton.addEventListener(
  "click",
  () => {
    const currentFlavor =
      getCurrentFlavor(
        configuratorState
      );

    if (
      !configuratorState
        .selectedBase ||
      !currentFlavor
    ) {
      alert(
        "Kies eerst een basis en een smaak."
      );

      return;
    }

    const selectedFlavors = [
      currentFlavor
    ];

    if (
      configuratorState.extraFlavor
    ) {
      selectedFlavors.push(
        configuratorState
          .extraFlavor
      );
    }

    const configuration = {
      base:
        configuratorState
          .selectedBase,

      flavors:
        selectedFlavors,

      toppings:
        configuratorState.selectedTopping
            ? [
                configuratorState.selectedTopping
            ]
            : []
    };

    localStorage.setItem(
      "iceCreamConfiguration",
      JSON.stringify(
        configuration
      )
    );

    window.location.href =
      "/order.html";
  }
);

const handleResize = () => {
  const width =
    container.clientWidth;

  const height =
    container.clientHeight;

  if (
    width === 0 ||
    height === 0
  ) {
    return;
  }

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

window.addEventListener(
  "resize",
  handleResize
);

handleResize();
animate();
loadConfigurator();