import { expect } from "chai";
import { fixture, waitUntil } from "@open-wc/testing";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { dedupeMixin } from "@open-wc/dedupe-mixin";

import { ProviderElement } from "../../fixture/lit/provider-element.js";
import { ConsumerElement } from "../../fixture/lit/consumer-element.js";

const ScopedElementsMixinDeduped = dedupeMixin(ScopedElementsMixin);

it("DedupeMixin", async () => {
  window.customElements.define(
    "server-state",
    class extends ScopedElementsMixinDeduped(ProviderElement) {},
  );
  window.customElements.define(
    "hit-count",
    class extends ScopedElementsMixinDeduped(ConsumerElement) {},
  );

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
