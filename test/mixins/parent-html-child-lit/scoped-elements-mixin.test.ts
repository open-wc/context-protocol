import { LitElement, html } from "lit";
import { expect } from "chai";
import { fixture, waitUntil } from "@open-wc/testing";
import { ScopedElementsMixin as HTMLScopedElementsMixin } from "@open-wc/scoped-elements/html-element.js";
import { ScopedElementsMixin as LitScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ProviderMixin, ConsumerMixin } from "../../../index.js";

class ProviderElement extends HTMLScopedElementsMixin(
  ProviderMixin(HTMLElement),
) {
  contexts = {
    "hit-count": () => {
      return 9001;
    },
  };
}

class ConsumerElement extends LitScopedElementsMixin(
  ConsumerMixin(LitElement),
) {
  static get properties() {
    return {
      hitCount: { type: String },
    };
  }

  contexts = {
    "hit-count": (count: number) => {
      // @ts-expect-error
      this.hitCount = `${count} hits!`;
    },
  };

  constructor() {
    super();
    // @ts-expect-error
    this.hitCount = "Loading...";
  }

  render() {
    // @ts-expect-error
    return html`${this.hitCount}`;
  }
}

it("ScopedElementsMixin", async () => {
  window.customElements.define(
    "server-state",
    HTMLScopedElementsMixin(ProviderElement),
  );
  window.customElements.define(
    "hit-count",
    LitScopedElementsMixin(ConsumerElement),
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
