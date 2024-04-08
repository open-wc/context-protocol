import { LitElement, html } from "lit";
import { ProviderMixin } from "../../../index.js";

export class ProviderElement extends ProviderMixin(LitElement) {
  contexts = {
    "hit-count": () => {
      return 9001;
    },
  };

  render() {
    return html`<slot></slot>`;
  }
}
