/* globals describe, it */

import { expect } from "chai";
import { fixture, waitUntil } from "@open-wc/testing";

import { ProviderElement } from "./fixture/html/provider-element.js";
import { ConsumerElement } from "./fixture/lit/consumer-element.js";

window.customElements.define("server-state", ProviderElement);
window.customElements.define("hit-count", ConsumerElement);

describe("Parent[HTML] => Child[Lit]", () => {
  it("subscribes to changes", async () => {
    const provider = await fixture<ProviderElement>(
      `<server-state><hit-count>Loading...</hit-count></server-state>`,
    );
    const el = provider?.querySelector("hit-count");

    await waitUntil(() => el?.shadowRoot?.textContent?.trim() !== "Loading...");
    expect(el?.shadowRoot?.textContent).to.equal("9001 hits!");

    provider?.updateContext?.("hit-count", 9002);
    await waitUntil(() => el?.shadowRoot?.textContent?.trim() !== "9001 hits!");
    expect(el?.shadowRoot?.textContent).to.equal("9002 hits!");
  });
});
