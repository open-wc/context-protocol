import { expect } from "chai";
import { fixture, waitUntil } from "@open-wc/testing";
import { ScopedElementsMixin as HTMLScopedElementsMixin } from "@open-wc/scoped-elements/html-element.js";
import { ScopedElementsMixin as LitScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { dedupeMixin } from "@open-wc/dedupe-mixin";

import { ProviderElement } from "../../fixture/html/provider-element.js";
import { ConsumerElement } from "../../fixture/lit/consumer-element.js";

const HTMLScopedElementsMixinDeduped = dedupeMixin(HTMLScopedElementsMixin);
const LitScopedElementsMixinDeduped = dedupeMixin(LitScopedElementsMixin);

it("DedupeMixin", async () => {
  window.customElements.define(
    "server-state",
    class extends HTMLScopedElementsMixinDeduped(ProviderElement) {},
  );
  window.customElements.define(
    "hit-count",
    class extends LitScopedElementsMixinDeduped(ConsumerElement) {},
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
