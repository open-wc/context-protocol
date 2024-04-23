# @open-wc/context-protocol

A Lit compatible implementation of the [context-protocol community protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md).

## Installation

```sh
npm install --save @open-wc/context-protocol
```

## Usage

A component that implements the ProviderMixin will become a _Provider_ of data and a component that implements the ConsumerMixin will become a _Consumer_ of data.

```ts
import { ProviderMixin } from "@open-wc/context-protocol";

export class ProviderElement extends ProviderMixin(HTMLElement) {
  // Set any data contexts here.
  contexts = {
    "number-of-unread-messages": () => {
      return 0;
    },
  };

  async connectedCallback() {
    // It's also possible to provide context at any point using `updateContext`.

    const response = await fetch("/api/messages/");
    const data = await response.json();
    this.updateContext("number-of-unread-messages", data.unreadCount);
  }
}
```

```ts
import { ConsumerMixin } from "@open-wc/context-protocol";

export class ConsumerElement extends ConsumerMixin(HTMLElement) {
  contexts = {
    // Fetch contexts that we care about and subscribe to any changes.
    "number-of-unread-messages": (count: number) => {
      this.textContent = `${count} unread messages!`;
    },
  };

  connectedCallback() {
    // It's also possible to get any context on demand without subscribing.
    this.textContent = this.getContext("number-of-unread-messages");
  }
}
```
