import { LitElement, html } from "lit";
import { ConsumerMixin } from "../../../index.js";

export class ConsumerElement extends ConsumerMixin(LitElement) {
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
