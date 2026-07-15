import "./style.css";

import { 
  getBases, 
  getFlavors 
} from "./api/api.js";

import { createScene } from "./scene/scene.js";
import { createCamera } from "./scene/camera.js";
import { createRenderer } from "./scene/renderer.js";
import { addLights } from "./scene/lights.js";
import { createControls } from "./scene/controls.js";

import { configuratorState } from "./state/configuratorState.js";
import { showBaseModel } from "./managers/baseManager.js";

import {
  applyPresetFlavor,
  applyCustomFlavor,
  getCurrentFlavor
} from "./managers/flavorManager.js";

import {
  createBaseControls,
  createFlavorControls,
  createCustomFlavorControls
} from "./ui/controls.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="configurator">
    <section class="viewer">
      <div id="three-container"></div>
    </section>

    <aside class="panel">
      <p class="eyebrow">Mini Ice Cream Factory</p>
      <h1>Stel je ijsje samen</h1>

      <section class="configuration-section">
        <p class="step-label">Stap 1</p>
        <h2>Kies je basis</h2>

        <div id="base-options" class="option-list">
          <p>Opties laden...</p>
        </div>
      </section>

      <section class="configuration-section">
        <p class="step-label">Stap 2</p>
        <h2>Kies je smaak</h2>

        <div id="flavor-options" class="option-list">
          <p>Smaken laden...</p>
        </div>

        <div class="custom-flavor">

        <div class="custom-flavor__divider">
          <span>of maak je eigen smaak</span>
        </div>

        <label class="field">
          <span class="field__label">Naam van je smaak</span>

          <input
            id="custom-flavor-name"
            class="field__input"
            type="text"
            maxlength="40"
            placeholder="Bijvoorbeeld: Maite's mix"
          />
        </label>

        <label class="field">
          <span class="field__label">Kies een kleur</span>

          <div class="color-picker">
            <input
              id="custom-flavor-color"
              class="color-picker__input"
              type="color"
              value="#f5a9c6"
            />

            <span
              id="custom-flavor-color-value"
              class="color-picker__value"
            >
              #f5a9c6
            </span>
          </div>
        </label>
      </div>
      </section>

      <div class="selection-summary">
        <span>Gekozen basis</span>
        <strong id="selected-base-name">
          Nog niet gekozen
        </strong>
      </div>

      <div class="selection-summary">
        <span>Gekozen smaak</span>
        <strong id="selected-flavor-name">
          Nog niet gekozen
        </strong>
      </div>
    </aside>
  </main>
`;

const container = document.querySelector("#three-container");

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

container.appendChild(renderer.domElement);

addLights(scene);

const controls = createControls(camera, renderer);

const updateSelectedBaseName = () => {
  const selectedBaseName = document.querySelector(
    "#selected-base-name"
  );

  selectedBaseName.textContent =
    configuratorState.selectedBase?.name || "Nog niet gekozen";
};

const updateSelectedFlavorName = () => {
  const selectedFlavorName =
    document.querySelector(
      "#selected-flavor-name"
    );

  const currentFlavor = getCurrentFlavor(
    configuratorState
  );

  selectedFlavorName.textContent =
    currentFlavor.name;
};

const loadConfigurator = async () => {
  try {
    const [bases, flavors] = await Promise.all([
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

    configuratorState.selectedBase = bases[0];
    configuratorState.selectedFlavor = flavors[0];

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

        updateSelectedBaseName();
        updateSelectedFlavorName();
      }
    });

    createFlavorControls({
      flavors,
      selectedFlavor:
        configuratorState.selectedFlavor,

      onFlavorChange: (flavor) => {
        applyPresetFlavor({
          state: configuratorState,
          flavor
        });

        updateSelectedFlavorName();
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

        updateSelectedFlavorName();
      }
    });

    updateSelectedBaseName();
    updateSelectedFlavorName();
  } catch (error) {
    console.error(error);

    document.querySelector("#base-options").innerHTML = `
      <p class="error-message">
        De configuratie-opties konden niet geladen worden.
      </p>
    `;

    document.querySelector("#flavor-options").innerHTML = `
      <p class="error-message">
        De smaken konden niet geladen worden.
      </p>
    `;
  }
};

loadConfigurator();

const handleResize = () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );
};

window.addEventListener("resize", handleResize);

handleResize();

const animate = () => {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
};

animate();