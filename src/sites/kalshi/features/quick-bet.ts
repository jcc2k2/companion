import { SELECTORS } from "../config/constants.js";

const QUICK_BET_AMOUNTS = [100, 500, 1000];
const QUICK_BET_CLASS = "bb-quick-bet-container";

/**
 * Injects Quick Bet buttons into the order slip.
 */
export function injectQuickBetButtons(): void {
  // 1. Find the order slip container
  // We look for the input field first, as it's the most recognizable element
  const input = document.querySelector("input[type='text'][inputmode='decimal'], input[type='number'][placeholder='0']");

  if (!input) return;

  // Check if we already injected
  const parent = input.parentElement;
  if (!parent || parent.querySelector(`.${QUICK_BET_CLASS}`)) return;

  // 2. Create the container
  const container = document.createElement("div");
  container.className = `${QUICK_BET_CLASS} flex gap-2 mt-2`;
  container.style.display = "flex";
  container.style.gap = "8px";
  container.style.marginTop = "8px";

  // 3. Create buttons
  QUICK_BET_AMOUNTS.forEach((amount) => {
    const btn = document.createElement("button");
    btn.textContent = `+${amount}`;
    btn.className = "bb-quick-bet-btn";
    // Basic styling to match Kalshi's dark theme (approximate)
    Object.assign(btn.style, {
      padding: "4px 8px",
      borderRadius: "4px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
    });

    btn.onmouseover = () => {
      btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    };
    btn.onmouseout = () => {
      btn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    };

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setInputValue(input as HTMLInputElement, amount);
    };

    container.appendChild(btn);
  });

  // 4. Inject
  parent.appendChild(container);
}

/**
 * Sets the value of a React-controlled input and dispatches events.
 */
function setInputValue(input: HTMLInputElement, value: number): void {
  // Get current value to add to it, or just set it? 
  // User asked for "Presets" but usually "+100" implies adding. 
  // Let's assume they want to SET the value for now as it's safer/easier, 
  // or we can parse the current value.
  // Let's try to parse current value and ADD.
  
  let currentVal = parseFloat(input.value.replace(/[^0-9.]/g, "")) || 0;
  const newValue = (currentVal + value).toString();

  // React 16+ hack to trigger onChange
  // We need to call the native setter because React overrides it
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;
  
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, newValue);
  } else {
    input.value = newValue;
  }

  // Dispatch events
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}
