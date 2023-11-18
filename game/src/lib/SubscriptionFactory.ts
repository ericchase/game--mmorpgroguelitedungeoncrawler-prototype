interface SubscriptionFactoryParameters<CallbackType> {
  onNotify: (subscriptions: Set<CallbackType>) => void;
  onSubscribe: (callback: CallbackType) => void;
}

export function SubscriptionFactory<CallbackType>({ onNotify, onSubscribe }: SubscriptionFactoryParameters<CallbackType>) {
  const subscriptions = new Set<CallbackType>();
  function subscribe(callback: CallbackType) {
    onSubscribe(callback);
    subscriptions.add(callback);
    return function () {
      subscriptions.delete(callback);
    };
  }
  function notify() {
    onNotify(subscriptions);
  }
  return { subscribe, notify };
}
