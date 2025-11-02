import { SELECTORS, REGEX_PATTERNS } from "../config/constants.js";

let cachedTeamNames: { team1: string; team2: string } | null = null;

export function getTeamNames(): { team1: string; team2: string } | null {
  if (cachedTeamNames) {
    return cachedTeamNames;
  }

  const titleElements = document.querySelectorAll(SELECTORS.TITLE_ELEMENTS);

  for (const element of titleElements) {
    const titleText = element.textContent || "";
    const titleMatch = titleText.match(REGEX_PATTERNS.TEAM_NAMES);

    if (titleMatch) {
      const team1 = titleMatch[1].trim();
      const team2 = titleMatch[2].trim();
      cachedTeamNames = { team1, team2 };
      return cachedTeamNames;
    }
  }

  const allText = document.body.textContent || "";
  const contentMatch = allText.match(REGEX_PATTERNS.CONTENT_TEAM_NAMES);

  if (contentMatch) {
    const team1 = contentMatch[1].trim();
    const team2 = contentMatch[2].trim();
    cachedTeamNames = { team1, team2 };
    return cachedTeamNames;
  }

  return null;
}

export function clearTeamNameCache(): void {
  cachedTeamNames = null;
}
