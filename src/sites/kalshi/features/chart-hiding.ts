import {
  SELECTORS,
  CSS_CLASSES,
  DATA_ATTRIBUTES,
} from "../config/constants.js";
import { getChartsHidden } from "../core/settings.js";

export function hideChartsAndOptimizeLayout(): void {
  if (!getChartsHidden()) return;

  let styleElement = document.getElementById(
    CSS_CLASSES.HIDE_SVGS
  ) as HTMLStyleElement;
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = CSS_CLASSES.HIDE_SVGS;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = `
    div:has(span:contains("vol")) {
      display: none !important;
    }
  `;

  const svgElements = document.querySelectorAll("svg");
  svgElements.forEach((svg) => {
    if (svg.querySelector("g")) {
      const parent = svg.parentElement;
      if (parent && parent.parentElement) {
        const grandparent = parent.parentElement as HTMLElement;
        grandparent.style.setProperty("display", "none", "important");
        grandparent.dataset[DATA_ATTRIBUTES.HIDDEN_CHART.toLowerCase()] =
          "true";

        if (grandparent.parentElement) {
          const siblings = grandparent.parentElement.children;
          Array.from(siblings).forEach((sibling) => {
            if (sibling !== grandparent && sibling.tagName === "DIV") {
              const siblingElement = sibling as HTMLElement;
              siblingElement.style.setProperty("display", "none", "important");
              siblingElement.dataset[
                DATA_ATTRIBUTES.HIDDEN_CHART_SIBLING.toLowerCase()
              ] = "true";
            }
          });
        }
      }
    }
  });

  const gapElements = document.querySelectorAll(SELECTORS.GAP_ELEMENTS);
  gapElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    htmlElement.dataset[DATA_ATTRIBUTES.ORIGINAL_CLASS.toLowerCase()] =
      htmlElement.className;
    htmlElement.className = "flex flex-col gap-3 w-full";
    htmlElement.dataset[DATA_ATTRIBUTES.MODIFIED_GAP.toLowerCase()] = "true";
  });
}

export function showChartsAndRestoreLayout(): void {
  const styleElement = document.getElementById(CSS_CLASSES.HIDE_SVGS);
  if (styleElement) {
    styleElement.remove();
  }

  document
    .querySelectorAll(`[data-${DATA_ATTRIBUTES.HIDDEN_CHART.toLowerCase()}]`)
    .forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.display = "";
      delete htmlElement.dataset[DATA_ATTRIBUTES.HIDDEN_CHART.toLowerCase()];
    });

  document
    .querySelectorAll(
      `[data-${DATA_ATTRIBUTES.HIDDEN_CHART_SIBLING.toLowerCase()}]`
    )
    .forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.display = "";
      delete htmlElement.dataset[
        DATA_ATTRIBUTES.HIDDEN_CHART_SIBLING.toLowerCase()
      ];
    });

  document
    .querySelectorAll(`[data-${DATA_ATTRIBUTES.MODIFIED_GAP.toLowerCase()}]`)
    .forEach((element) => {
      const htmlElement = element as HTMLElement;
      const originalClass =
        htmlElement.dataset[DATA_ATTRIBUTES.ORIGINAL_CLASS.toLowerCase()];
      if (originalClass) {
        htmlElement.className = originalClass;
        delete htmlElement.dataset[
          DATA_ATTRIBUTES.ORIGINAL_CLASS.toLowerCase()
        ];
      }
      delete htmlElement.dataset[DATA_ATTRIBUTES.MODIFIED_GAP.toLowerCase()];
    });
}
