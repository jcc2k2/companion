/**
 * Creates a DOM element with properties and children
 * Similar to React.createElement but for vanilla JavaScript
 *
 * @param tagName - HTML tag name (e.g., 'div', 'span', 'button')
 * @param properties - Object with attributes, styles, and event handlers
 * @param children - Child elements or text content
 *
 * @example
 * createElement('div',
 *   { class: 'my-class', style: { color: 'red' }, onclick: () => console.log('clicked') },
 *   'Hello World'
 * )
 */
export const createElement = (
  tagName: string,
  properties: Record<string, any> = {},
  ...children: Array<Node | string | null>
): HTMLElement => {
  const element = document.createElement(tagName);

  // Apply properties (attributes, styles, event listeners)
  Object.entries(properties || {}).forEach(([key, value]) => {
    if (key === "style" && typeof value === "object") {
      // Handle style objects: { color: 'red', fontSize: '14px' }
      Object.assign(element.style, value);
    } else if (key.startsWith("on") && typeof value === "function") {
      // Handle event listeners: { onclick: () => {} }
      const eventName = key.slice(2); // Remove 'on' prefix
      element.addEventListener(eventName, value);
    } else if (value != null) {
      // Handle regular attributes: { class: 'my-class', id: 'my-id' }
      element.setAttribute(key, String(value));
    }
  });

  // Add children
  for (const child of children) {
    if (child != null) {
      const childNode =
        typeof child === "string" ? document.createTextNode(child) : child;
      element.appendChild(childNode);
    }
  }

  return element;
};
/**
 * Creates an isolated Shadow DOM container for extension UI
 * This prevents the host website's CSS from affecting our extension's appearance
 *
 * @param containerId - Unique ID for the shadow host container
 * @returns Shadow root where you can mount extension UI safely
 *
 * @example
 * const shadowRoot = createIsolatedContainer('my-extension-ui');
 * shadowRoot.appendChild(createElement('div', {}, 'My extension content'));
 */
export const createIsolatedContainer = (
  containerId = "bb-companion-root"
): ShadowRoot => {
  // Check if container already exists
  let hostElement = document.getElementById(containerId) as HTMLElement | null;
  if (hostElement?.shadowRoot) {
    return hostElement.shadowRoot;
  }

  // Create new host container
  hostElement = document.createElement("div");
  hostElement.id = containerId;

  // Reset all styles to prevent inheritance from host page
  hostElement.style.all = "initial";

  // Position in bottom-right corner, above everything else
  hostElement.style.position = "fixed";
  hostElement.style.bottom = "12px";
  hostElement.style.right = "12px";
  hostElement.style.zIndex = "2147483647"; // Maximum z-index value

  // Create isolated Shadow DOM
  hostElement.attachShadow({ mode: "open" });

  // Add to page
  document.documentElement.appendChild(hostElement);

  return hostElement.shadowRoot as ShadowRoot;
};
/**
 * Monitors URL changes in Single Page Applications (SPAs)
 *
 * Many modern websites (like Kalshi) use client-side routing that doesn't
 * trigger page reloads. This function detects when the URL changes and
 * calls your callback function so you can re-run extension logic.
 *
 * @param callback - Function to call when URL changes, receives new URL as parameter
 *
 * @example
 * watchForUrlChanges((newUrl) => {
 *   console.log('User navigated to:', newUrl);
 *   // Re-run your extension logic here
 * });
 */
export const watchForUrlChanges = (
  callback: (newUrl: string) => void
): void => {
  let previousUrl = location.href;

  // Use MutationObserver to watch for DOM changes that might indicate navigation
  const observer = new MutationObserver(() => {
    const currentUrl = location.href;

    // If URL changed, notify the callback
    if (currentUrl !== previousUrl) {
      previousUrl = currentUrl;
      callback(currentUrl);
    }
  });

  // Start observing the entire document for changes
  observer.observe(document, {
    subtree: true, // Watch all descendant elements
    childList: true, // Watch for added/removed elements
  });
};

// Backward compatibility aliases - remove these when all code is updated
export const h = createElement;
export const createShadowHost = createIsolatedContainer;
export const onUrlChange = watchForUrlChanges;
