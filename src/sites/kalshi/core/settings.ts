export type DisplayMode = "american" | "price" | "both";

let extensionEnabled = true;
let currentDisplayMode: DisplayMode = "both";
let chartsHidden = true;

export async function loadSettings(): Promise<void> {
  try {
    const browserModule = await import("../../../lib/browser.js");
    const browser = browserModule.default;

    const result = await browser.storage.local.get([
      "kalshi.extensionEnabled",
      "kalshi.oddsDisplayMode",
      "kalshi.hideCharts",
    ]);
    extensionEnabled = result["kalshi.extensionEnabled"] !== false;
    currentDisplayMode = result["kalshi.oddsDisplayMode"] || "american";
    chartsHidden = result["kalshi.hideCharts"] !== false;
  } catch (error) {
    console.warn("[BBC] Could not load settings:", error);
    extensionEnabled = true;
    currentDisplayMode = "american";
    chartsHidden = true;
  }
}

export function getExtensionEnabled(): boolean {
  return extensionEnabled;
}

export function getCurrentDisplayMode(): DisplayMode {
  return currentDisplayMode;
}

export function getChartsHidden(): boolean {
  return chartsHidden;
}

export function setDisplayMode(mode: DisplayMode): void {
  currentDisplayMode = mode;
}

export function setChartsHidden(hidden: boolean): void {
  chartsHidden = hidden;
}
