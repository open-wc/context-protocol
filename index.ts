import { ObservableMap } from "./observable-map.js";
import {
  createContext,
  Context,
  ContextRequestEvent,
  UnknownContext,
} from "./context-protocol.js";

export interface CustomElement extends Element {
  connectedCallback?(): void;
  attributeChangedCallback?(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void;
  disconnectedCallback?(): void;
  adoptedCallback?(): void;
  formAssociatedCallback?(form: HTMLFormElement): void;
  formDisabledCallback?(disabled: boolean): void;
  formResetCallback?(): void;
  formStateRestoreCallback?(
    state: unknown,
    reason: "autocomplete" | "restore",
  ): void;
}

export declare type Constructor<T> = new (...args: any[]) => T;

type ProviderElement = CustomElement & {
  contexts?: Record<PropertyKey, () => unknown>;
  updateContext?(name: PropertyKey, value: unknown): void;
};

type ConsumerElement = CustomElement & {
  contexts?: Record<PropertyKey, (data: any) => void>;
};

export function ProviderMixin<T extends Constructor<ProviderElement>>(
  Class: T,
): T & Constructor<ProviderElement> {
  return class extends Class {
    #dataStore = new ObservableMap();

    connectedCallback() {
      super.connectedCallback?.();

      const contexts = "contexts" in this ? this.contexts : {};

      for (const [key, value] of Object.entries(contexts || {})) {
        this.#dataStore.set(key, value());
      }

      this.addEventListener("context-request", this.#handleContextRequest);
    }

    disconnectedCallback(): void {
      this.#dataStore = new ObservableMap();
      this.removeEventListener("context-request", this.#handleContextRequest);
    }

    updateContext(name: PropertyKey, value: unknown) {
      this.#dataStore.set(createContext(name), value);
    }

    // We listen for a bubbled context request event and provide the event with the context requested.
    #handleContextRequest(event: ContextRequestEvent<UnknownContext>) {
      const subscribe = event.subscribe;
      const data = this.#dataStore.get(event.context);
      if (data) {
        event.stopPropagation();

        let unsubscribe = () => undefined;

        if (subscribe) {
          unsubscribe = () => {
            data.subscribers.delete(event.callback);
          };
          data.subscribers.add(event.callback);
        }

        event.callback(data.value, unsubscribe);
      }
    }
  };
}

export function ConsumerMixin<T extends Constructor<ConsumerElement>>(
  Class: T,
): T & Constructor<ConsumerElement> {
  return class extends Class {
    #unsubscribes: Array<() => void> = [];

    getContext(contextName: PropertyKey) {
      let result: unknown;

      this.dispatchEvent(
        new ContextRequestEvent(createContext(contextName), (data) => {
          result = data;
        }),
      );

      return result;
    }

    connectedCallback() {
      super.connectedCallback?.();

      const contexts = "contexts" in this ? this.contexts : {};
      for (const [contextName, callback] of Object.entries(contexts || {})) {
        const context = createContext(contextName);

        // We dispatch a event with that context. The event will bubble up the tree until it
        // reaches a component that is able to provide that value to us.
        // The event has a callback for the the value.
        this.dispatchEvent(
          new ContextRequestEvent(
            context,
            (data, unsubscribe) => {
              callback(data);
              if (unsubscribe) {
                this.#unsubscribes.push(unsubscribe);
              }
            },
            // Always subscribe. Consumers can ignore updates if they'd like.
            true,
          ),
        );
      }
    }

    // Unsubscribe from all callbacks when disconnecting
    disconnectedCallback() {
      for (const unsubscribe of this.#unsubscribes) {
        unsubscribe?.();
      }
      // Empty out the array in case this element is still stored in memory but just not connected
      // to the DOM.
      this.#unsubscribes = [];
    }
  };
}
