/**
 * Service to fetch user positions from Kalshi API.
 */

interface Position {
    ticker: string;
    market_ticker: string;
    position: number;
    fees_paid: number;
    realized_pnl: number;
    avg_price: number;
}

interface PortfolioResponse {
    positions: Position[];
}

let cachedPositions: Position[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

/**
 * Fetches user positions from Kalshi API.
 * Uses a simple cache to avoid rate limits.
 */
export async function fetchPositions(): Promise<Position[]> {
    const now = Date.now();
    if (cachedPositions && now - lastFetchTime < CACHE_DURATION) {
        return cachedPositions;
    }

    try {
        // Attempt to fetch from V2 API
        // Note: This relies on the user being logged in and the browser attaching cookies automatically.
        const response = await fetch(
            "https://api.elections.kalshi.com/trade-api/v2/portfolio/positions",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Add any other necessary headers here if needed, usually cookies are enough
                },
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                console.log("[BBC] User not logged in or unauthorized to fetch positions.");
                return [];
            }
            throw new Error(`API error: ${response.status}`);
        }

        const data = (await response.json()) as PortfolioResponse;
        cachedPositions = data.positions || [];
        lastFetchTime = now;

        if (process.env.NODE_ENV === "development") {
            console.log("[BBC] Fetched positions:", cachedPositions);
        }

        return cachedPositions;
    } catch (error) {
        console.error("[BBC] Failed to fetch positions:", error);
        return [];
    }
}

/**
 * Gets a position for a specific market ticker.
 */
export async function getPositionForMarket(marketTicker: string): Promise<Position | undefined> {
    const positions = await fetchPositions();
    return positions.find(p => p.market_ticker === marketTicker || p.ticker.startsWith(marketTicker));
}
