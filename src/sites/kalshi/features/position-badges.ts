import { fetchPositions } from "../core/portfolio.js";

const BADGE_CLASS = "bb-position-badge";

/**
 * Injects position badges into market cards.
 */
export async function injectPositionBadges(): Promise<void> {
    // 1. Fetch positions
    const positions = await fetchPositions();
    if (!positions || positions.length === 0) return;

    // 2. Find all market cards
    // Kalshi cards usually have an href like "/markets/KX-TRUMP-24"
    const marketCards = document.querySelectorAll("a[href^='/markets/']");

    marketCards.forEach((card) => {
        const link = card.getAttribute("href");
        if (!link) return;

        // Extract ticker from URL
        // e.g. /markets/KX-TRUMP-24/presidential-election-winner -> KX-TRUMP-24
        const match = link.match(/\/markets\/([A-Z0-9-]+)/);
        if (!match) return;
        const ticker = match[1];

        // Find matching position
        // We check if any position's ticker STARTS with this market ticker (since positions are specific contracts)
        // or if the market_ticker matches.
        const position = positions.find(
            (p) => p.market_ticker === ticker || p.ticker.startsWith(ticker)
        );

        if (position) {
            injectBadge(card as HTMLElement, position);
        }
    });
}

function injectBadge(card: HTMLElement, position: any): void {
    // Check if already injected
    if (card.querySelector(`.${BADGE_CLASS}`)) return;

    // Create badge
    const badge = document.createElement("div");
    badge.className = BADGE_CLASS;

    const isYes = position.ticker.includes("YES"); // Simple heuristic
    const color = isYes ? "#00d178" : "#ff4d4d"; // Green/Red
    const count = Math.abs(position.position);

    badge.textContent = `Pos: ${count}`;

    Object.assign(badge.style, {
        position: "absolute",
        top: "8px",
        right: "8px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: color,
        padding: "2px 6px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: "bold",
        zIndex: "10",
        border: `1px solid ${color}`,
    });

    // Ensure card is relative so absolute positioning works
    if (window.getComputedStyle(card).position === "static") {
        card.style.position = "relative";
    }

    card.appendChild(badge);
}
