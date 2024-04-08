import { ProviderMixin } from "../../../index.js";

export class ProviderElement extends ProviderMixin(HTMLElement) {
  contexts = {
    "hit-count": () => {
      return 9001;
    },
  };
}
