import { ObservableMap } from "./context-protocol.js";
import { ContextEvent } from "./index.js";

export class ProviderElement extends HTMLElement {
  #dataStore = new ObservableMap();
  static observedAttributes = ['hit-count'];

  connectedCallback() {
    // We listen for a bubbled context request event and provide the event with the context requested.
    this.addEventListener('context-request', (event: ContextEvent<{name: string, initialValue?: unknown}>) => {
      const {name, initialValue} = event.context;
      const subscribe = event.subscribe;
      if (initialValue) {
        this.#dataStore.set(name, initialValue);
      }
      const data = this.#dataStore.get(name);
      if (data) {
        event.stopPropagation();

        let unsubscribe;

        if (subscribe) {
          unsubscribe = () => { data.subscribers.delete(event.callback) }
          data.subscribers.add(event.callback);
        }

        event.callback(data.value, unsubscribe);
      }
    });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.#dataStore.set(name, newValue);
  }
}
