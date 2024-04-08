import { ConsumerMixin } from "../../../index.js";

export class ConsumerElement extends ConsumerMixin(HTMLElement) {
  contexts = {
    "hit-count": (count: number) => {
      this.textContent = `${count} hits!`;
    },
  };
}
