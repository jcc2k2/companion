import {
  loadAllSettings,
  saveSetting,
  resetAllSettings,
  notifyContentScripts,
  DEFAULT_SETTINGS,
} from "../lib/settings.js";

// DOM element references
const globalEnabled = document.getElementById(
  "global-enabled"
) as HTMLInputElement;
const kalshiEnabled = document.getElementById(
  "kalshi-enabled"
) as HTMLInputElement;
const kalshiDisplayMode = document.getElementById(
  "kalshi-display-mode"
) as HTMLSelectElement;
const kalshiHideCharts = document.getElementById(
  "kalshi-hide-charts"
) as HTMLInputElement;
const debugMode = document.getElementById("debug-mode") as HTMLInputElement;
const resetButton = document.getElementById(
  "reset-settings"
) as HTMLButtonElement;

/**
 * Load all settings from storage and update UI
 */
async function loadSettings(): Promise<void> {
  try {
    const settings = await loadAllSettings();

    // Global settings
    globalEnabled.checked = settings["global.extensionEnabled"] !== false;
    debugMode.checked = settings["debug.enabled"] === true;

    // Kalshi settings
    kalshiEnabled.checked = settings["kalshi.extensionEnabled"] !== false;
    kalshiDisplayMode.value = settings["kalshi.oddsDisplayMode"] || "american";
    kalshiHideCharts.checked = settings["kalshi.hideCharts"] !== false;

    console.log("Settings loaded:", settings);
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
}

/**
 * Reset all settings to defaults with confirmation
 */
async function handleResetSettings(): Promise<void> {
  const confirmed = confirm(
    "Are you sure you want to reset all settings to their defaults? This cannot be undone."
  );

  if (!confirmed) return;

  try {
    await resetAllSettings();
    await loadSettings(); // Reload UI
    await notifyContentScripts({ type: "settingsReset" });

    alert("All settings have been reset to defaults.");
  } catch (error) {
    console.error("Failed to reset settings:", error);
    alert("Failed to reset settings. Please try again.");
  }
}

/**
 * Setup event listeners for all controls
 */
function setupEventListeners(): void {
  // Global settings
  globalEnabled.addEventListener("change", async () => {
    await saveSetting("global.extensionEnabled", globalEnabled.checked);
  });

  debugMode.addEventListener("change", async () => {
    await saveSetting("debug.enabled", debugMode.checked);
  });

  // Kalshi settings
  kalshiEnabled.addEventListener("change", async () => {
    await saveSetting("kalshi.extensionEnabled", kalshiEnabled.checked);
  });

  kalshiDisplayMode.addEventListener("change", async () => {
    await saveSetting("kalshi.oddsDisplayMode", kalshiDisplayMode.value);
    await notifyContentScripts({
      type: "displayModeChanged",
      mode: kalshiDisplayMode.value,
    });
  });

  kalshiHideCharts.addEventListener("change", async () => {
    await saveSetting("kalshi.hideCharts", kalshiHideCharts.checked);
    await notifyContentScripts({
      type: "hideChartsChanged",
      hide: kalshiHideCharts.checked,
    });
  });

  // Reset button
  resetButton.addEventListener("click", handleResetSettings);
}

/**
 * Initialize the options page
 */
async function initialize(): Promise<void> {
  console.log("Initializing options page...");

  try {
    await loadSettings();
    setupEventListeners();

    console.log("Options page ready.");
  } catch (error) {
    console.error("Failed to initialize options page:", error);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
