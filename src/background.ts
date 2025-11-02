// src/background.ts
// Import the polyfill first for service workers
import "webextension-polyfill";
import browser from "./lib/browser.js";

// Only log in development - remove these for production
if (process.env.NODE_ENV === "development") {
  console.log("[BBC] background loaded");
}

browser.runtime.onInstalled.addListener(() => {
  if (process.env.NODE_ENV === "development") {
    console.log("[BBC] installed");
  }
});
