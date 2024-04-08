/* globals describe, it */

import { expect } from "chai";
import { fixture, waitUntil } from "@open-wc/testing";

import { ProviderElement } from "./fixture/html/provider-element.js";
import { ConsumerElement } from "./fixture/html/consumer-element.js";

window.customElements.define("server-state", ProviderElement);
window.customElements.define("hit-count", ConsumerElement);

describe("Parent[HTML] => Child[HTML]", () => {
  it("subscribes to changes", async () => {
    const provider = await fixture<HTMLElement>(
      `<server-state><hit-count>Loading...</hit-count></server-state>`,
    );
    const el = provider?.querySelector("hit-count");

    await waitUntil(() => el?.textContent?.trim() !== "Loading...");
    expect(el?.textContent).to.equal("9001 hits!");

    // @ts-expect-error todo
    provider?.updateContext?.("hit-count", 9002);
    await waitUntil(() => el?.textContent?.trim() !== "9001 hits!");
    expect(el?.textContent).to.equal("9002 hits!");
  });
});
