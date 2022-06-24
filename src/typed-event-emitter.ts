import { EventEmitter, Listener } from 'events';

type PropType = {
  readonly [key: string]: Listener;
};

declare class TypedEventEmitterType<T extends PropType = {}>
  implements EventEmitter
{
  addListener<K extends keyof T>(type: K, listener: T[K]): this;
  on<K extends keyof T>(type: K, listener: T[K]): this;
  once<K extends keyof T>(type: K, listener: T[K]): this;
  off<K extends keyof T>(type: K, listener: T[K]): this;
  emit<K extends keyof T>(type: K, ...args: Parameters<T[K]>): boolean;
  eventNames<K extends keyof T>(): K[];
  getMaxListeners(): number;
  listenerCount(type: keyof T): number;
  listeners(type: keyof T): Listener[];
  prependListener<K extends keyof T>(type: K, listener: T[K]): this;
  prependOnceListener<K extends keyof T>(type: K, listener: T[K]): this;
  rawListeners(type: keyof T): Listener[];
  removeAllListeners(type?: keyof T): this;
  removeListener<K extends keyof T>(type: K, listener: T[K]): this;
  setMaxListeners(n: number): this;
}
export const TypedEventEmitter = EventEmitter as typeof TypedEventEmitterType;

export type EventName<E extends PropType = PropType> = keyof E;
export type EventHandler<
  E extends PropType = PropType,
  K extends keyof E = keyof E,
> = E[K];
export type EventHandlerParams<
  E extends PropType = PropType,
  K extends keyof E = keyof E,
> = Parameters<EventHandler<E, K>>;
export type ExtractEventType<
  T extends TypedEventEmitterType = TypedEventEmitterType,
> = T extends TypedEventEmitterType<infer P> ? P : {};
