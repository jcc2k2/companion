import {
  SELECTORS,
  REGEX_PATTERNS,
  SPREAD_KEYWORDS,
  DATA_ATTRIBUTES,
} from "../config/constants.js";
import { getExtensionEnabled } from "../core/settings.js";
import { getTeamNames } from "../utils/team-detection.js";
import { createSpreadOverlay } from "../utils/dom-utils.js";

let processedSpreads = new Map<string, string>();

export function extractSpreadInfo(text: string): {
  favoriteTeam: string;
  underdogTeam: string;
  spread: number;
  isSpread: boolean;
} | null {
  const altPatterns = [REGEX_PATTERNS.SPREAD_ALT1, REGEX_PATTERNS.SPREAD_ALT2];

  let match = text.match(REGEX_PATTERNS.SPREAD_MAIN);

  if (!match) {
    for (const altPattern of altPatterns) {
      match = text.match(altPattern);
      if (match) break;
    }
  }

  if (!match || text.length < 15) return null;

  const hasSpreadKeyword = SPREAD_KEYWORDS.some((keyword) =>
    text.toLowerCase().includes(keyword)
  );

  if (!hasSpreadKeyword) return null;

  const favoriteTeam = match[1].trim();
  const spread = parseFloat(match[2]);
  let underdogTeam = "Opponent";
  const teamNames = getTeamNames();

  if (teamNames) {
    if (teamNames.team1.toLowerCase().includes(favoriteTeam.toLowerCase())) {
      underdogTeam = teamNames.team2;
    } else if (
      teamNames.team2.toLowerCase().includes(favoriteTeam.toLowerCase())
    ) {
      underdogTeam = teamNames.team1;
    }
  }

  return {
    favoriteTeam,
    underdogTeam,
    spread,
    isSpread: true,
  };
}

export function processSpreadBetting(): void {
  if (!getExtensionEnabled()) return;

  const containers = document.querySelectorAll(SELECTORS.SPREAD_CONTAINERS);

  containers.forEach((container) => {
    const containerText = container.textContent?.trim() || "";

    if (
      !(
        containerText.toLowerCase().includes("wins by") &&
        (containerText.toLowerCase().includes("points") ||
          containerText.toLowerCase().includes("goals") ||
          containerText.toLowerCase().includes("runs"))
      )
    ) {
      return;
    }

    const spreadInfo = extractSpreadInfo(containerText);

    if (spreadInfo) {
      const spreadKey = `${spreadInfo.favoriteTeam}-${spreadInfo.underdogTeam}-${spreadInfo.spread}`;

      const lastProcessedText = processedSpreads.get(spreadKey);
      if (lastProcessedText === containerText) {
        return;
      }

      processedSpreads.set(spreadKey, containerText);

      const buttons = container.querySelectorAll(SELECTORS.PRICE_BUTTONS);

      if (buttons.length < 2) {
        return;
      }

      let yesButton: HTMLElement | null = null;
      let noButton: HTMLElement | null = null;

      buttons.forEach((button) => {
        const htmlButton = button as HTMLElement;
        const buttonText = htmlButton.textContent?.toLowerCase().trim() || "";

        if (buttonText.includes("yes") && !yesButton) {
          yesButton = htmlButton;
        } else if (buttonText.includes("no") && !noButton) {
          noButton = htmlButton;
        }
      });

      if (yesButton && noButton) {
        const favoriteSpread = `${spreadInfo.favoriteTeam} -${spreadInfo.spread}`;
        const underdogSpread = `${spreadInfo.underdogTeam} +${spreadInfo.spread}`;

        createSpreadOverlay(yesButton, favoriteSpread, true);
        createSpreadOverlay(noButton, underdogSpread, false);
      }
    }
  });
}

export function processIndividualSpreadCards(): void {
  if (!getExtensionEnabled()) return;

  const spreadSpans = document.querySelectorAll("span");

  spreadSpans.forEach((span) => {
    const spanText = span.textContent?.trim() || "";

    if (spanText.includes("Buy Yes") || spanText.includes("Buy No")) {
      const spreadInfo = extractSpreadInfo(spanText);

      if (spreadInfo) {
        const spreadKey = `individual-${spreadInfo.favoriteTeam}-${spreadInfo.underdogTeam}-${spreadInfo.spread}`;

        const lastProcessedText = processedSpreads.get(spreadKey);
        if (lastProcessedText === spanText) {
          return;
        }

        processedSpreads.set(spreadKey, spanText);

        let parentContainer = span.parentElement;
        while (
          parentContainer &&
          !parentContainer.querySelector(SELECTORS.PRICE_BUTTONS)
        ) {
          parentContainer = parentContainer.parentElement;
          if (!parentContainer || parentContainer === document.body) {
            break;
          }
        }

        if (parentContainer) {
          const buttons = parentContainer.querySelectorAll(
            SELECTORS.PRICE_BUTTONS
          );

          if (buttons.length >= 2) {
            let yesButton: HTMLElement | null = null;
            let noButton: HTMLElement | null = null;

            buttons.forEach((button) => {
              const htmlButton = button as HTMLElement;
              const buttonText =
                htmlButton.textContent?.toLowerCase().trim() || "";

              if (buttonText.includes("yes") && !yesButton) {
                yesButton = htmlButton;
              } else if (buttonText.includes("no") && !noButton) {
                noButton = htmlButton;
              }
            });

            if (
              yesButton &&
              noButton &&
              !(yesButton as HTMLElement).dataset[
                DATA_ATTRIBUTES.SPREAD_PROCESSED.toLowerCase()
              ]
            ) {
              const favoriteSpread = `${spreadInfo.favoriteTeam} -${spreadInfo.spread}`;
              const underdogSpread = `${spreadInfo.underdogTeam} +${spreadInfo.spread}`;

              (yesButton as HTMLElement).style.marginTop = "8px";
              (noButton as HTMLElement).style.marginTop = "8px";

              createSpreadOverlay(yesButton, favoriteSpread, true);
              createSpreadOverlay(noButton, underdogSpread, false);
            }
          }
        }
      }
    }
  });
}

export function clearProcessedSpreads(): void {
  processedSpreads.clear();
}
