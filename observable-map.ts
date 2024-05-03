type Subscriber<T> = (value: T) => void;

export class ObservableMap<K, V> {
  #store = new Map<K, { value: V; subscribers: Set<Subscriber<V>> }>();

  set(key: K, value: V, subscribers = new Set<Subscriber<V>>()) {
    const data = this.#store.get(key);
    subscribers = new Set([
      ...subscribers,
      ...(data?.subscribers || new Set()),
    ]);

    this.#store.set(key, { value, subscribers });
    for (const subscriber of subscribers) {
      subscriber(value);
    }
  }

  get(key: K) {
    return this.#store.get(key);
  }
}
