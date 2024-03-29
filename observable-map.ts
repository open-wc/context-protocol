type Subscriber<T> = (value: T) => void;

export class ObservableMap {
  #store = new Map<string, {value: unknown, subscribers: Set<Subscriber<unknown>>}>

  set(key: string, value: unknown, subscribers = new Set<Subscriber<unknown>>()) {
    const data = this.#store.get(key);
    subscribers = new Set([...subscribers, ...(data?.subscribers || new Set())]);
    this.#store.set(key, {value, subscribers});
    for (const subscriber of subscribers) {
      subscriber(value);
    }
  }

  get(key: string) {
    return this.#store.get(key);
  }
}
