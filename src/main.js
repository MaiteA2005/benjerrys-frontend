import "./style.css";

import { getBases } from "./api/api.js";

import { createScene } from "./scene/scene.js";
import { createCamera } from "./scene/camera.js";
import { createRenderer } from "./scene/renderer.js";
import { addLights } from "./scene/lights.js";
import { createControls } from "./scene/controls.js";

import { configuratorState } from "./state/configuratorState.js";
import { showBaseModel } from "./managers/baseManager.js";
import { createBaseControls } from "./ui/controls.js";

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

      <div class="selection-summary">
        <span>Gekozen basis</span>
        <strong id="selected-base-name">Nog niet gekozen</strong>
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

const loadConfigurator = async () => {
  try {
    const bases = await getBases();

    if (!bases.length) {
      throw new Error("Er zijn geen bases gevonden.");
    }

    configuratorState.bases = bases;
    configuratorState.selectedBase = bases[0];

    await showBaseModel({
      scene,
      state: configuratorState,
      base: bases[0]
    });

    createBaseControls({
      bases,
      selectedBase: configuratorState.selectedBase,

      onBaseChange: async (base) => {
        await showBaseModel({
          scene,
          state: configuratorState,
          base
        });

        updateSelectedBaseName();
      }
    });

    updateSelectedBaseName();
  } catch (error) {
    console.error(error);

    document.querySelector("#base-options").innerHTML = `
      <p class="error-message">
        De configuratie-opties konden niet geladen worden.
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