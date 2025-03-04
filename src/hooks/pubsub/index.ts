import PubSub from 'pubsub-js';
import { isFunction } from '@/utils';
import { onBeforeUnmount, InjectionKey } from 'vue';

// subscribe
export function useSubscribe (key: string | symbol | InjectionKey<string | symbol>) {
  let pubsubCode: string;
  let callback: FunctionConstructor;
  const unsubscribe = () => pubsubCode && PubSub.unsubscribe(pubsubCode);

  new Promise<void>((resolve: any, reject: any) => {
    if (!key) reject('key is required!');
    pubsubCode = PubSub.subscribe(<any>key, (msg: string, data: any) => {
      isFunction(callback) && callback(data);
    });

    resolve();
    onBeforeUnmount(() => unsubscribe());
  });

  return {
    // fn
    subscribe: (fn: any) => (callback = fn),
    unsubscribe
  };
}
