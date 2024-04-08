import { expect } from "chai";
import { fixture, waitUntil } from "@open-wc/testing";
import { ScopedElementsMixin as LitScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ScopedElementsMixin as HTMLScopedElementsMixin } from "@open-wc/scoped-elements/html-element.js";
import { ProviderElement } from "../../fixture/lit/provider-element.js";
import { ConsumerElement } from "../../fixture/html/consumer-element.js";

it("ScopedElementsMixin", async () => {
  window.customElements.define(
    "server-state",
    class extends LitScopedElementsMixin(ProviderElement) {},
  );
  window.customElements.define(
    "hit-count",
    class extends HTMLScopedElementsMixin(ConsumerElement) {},
  );
  const provider = await fixture<ProviderElement>(
    `<server-state><hit-count>Loading...</hit-count></server-state>`,
  );
  const el = provider?.querySelector("hit-count");

  await waitUntil(() => el?.textContent?.trim() !== "Loading...");
  expect(el?.textContent).to.equal("9001 hits!");

  provider?.updateContext?.("hit-count", 9002);
  await waitUntil(() => el?.textContent?.trim() !== "9001 hits!");
  expect(el?.textContent).to.equal("9002 hits!");
});
