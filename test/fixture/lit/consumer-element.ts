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
      // @ts-expect-error todo
      this.hitCount = `${count} hits!`;
    },
  };

  constructor() {
    super();
    // @ts-expect-error todo
    this.hitCount = "Loading...";
  }

  render() {
    // @ts-expect-error todo
    return html`${this.hitCount}`;
  }
}
