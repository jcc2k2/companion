import browser from "./browser.js";

export const send = <T = any>(type: string, payload: T) =>
  browser.runtime.sendMessage({ type, payload });

export const on = <T = any>(
  type: string,
  handler: (payload: T, respond: (r?: any) => void) => void
) => {
  browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === type) handler(msg.payload as T, sendResponse);
  });
};
