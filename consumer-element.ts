import { createContext, ContextEvent } from './index.js';

export class ConsumerElement extends HTMLElement {
  unsubscribe: () => void | undefined;

  connectedCallback() {
    // This component would like `hit-count` so we create that context.
    const context = createContext('hit-count', 9001);

    // We dispatch a event with that context. The event will bubble up the tree until it
    // reaches a component that is able to provide that value to us.
    // The event has a callback for the the value.
    this.dispatchEvent(new ContextEvent(
      context,
      (count, unsubscribe) => {
        this.textContent = `${count} hits!`;
        this.unsubscribe = unsubscribe;
      },
      true
    ));
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }
}
