# Typed Event Emitter

You can use node module [event-emitter](https://nodejs.org/api/events.html#class-eventemitter) with strict type in typescript.

# Installation

```
npm i @kim-kijun/typed-event-emitter
```

# Usage

## Class `TypedEventEmitter`

You can use `TypedEventEmitter` like EventEmitter. (It's same.)

```typescript
import { TypedEventEmitter } from '@kim-kijun/typed-event-emitter';

// Predefine event types
type MyEvents = {
  loadedEnd(): void;
  changeValue(value: string): void;
  pressKey(key: string, keycode: number, ctrlKey?: boolean): void;
};

// Call constructor with the defined type.
const eventEmitter = new TypedEventEmitter<MyEvents>();

/** 1. You can check valid name of the event. */
eventEmitter.on('loadidEnd', () => {}); // Type Error! - wrong event name
eventEmitter.on('loadedEnd', () => {}); // Good!

/** 2. You can check type of the arguments of callback function. */
eventEmitter.on('changeValue', (value) => {
  let fixed = value.toFixed(2); // Type Error! - 'value' should be used as string type
});
eventEmitter.on('changeValue', (value) => {
  let threeStr = value.slice(0, 3); // Good!
});

/** 3. You can check type of arguments when emit the event. */
eventEmitter.emit('pressKey', 'a', '80', true); // Type Error! - second argument should be number.
eventEmitter.emit('pressKey', 'a', 0, true); // Good!

/** 4. You can inherit class like original 'EventEmitter' */
class MyEventEmitter extends TypedEventEmitter<MyEvents> {...}
const myEventEmitter = new MyEventEmitter();
myEventEmitter.on('loadidEnd', () => {}); // Type Error!
myEventEmitter.on('loadedEnd', () => {}); // Good!
```

## Utility Types

### Base

```typescript
type MyEvents = {
  loadedEnd(): void;
  changeValue(value: string): void;
  pressKey(key: string, keycode: number, ctrlKey?: boolean): void;
};
const eventEmitter = new TypedEventEmitter<MyEvents>();
```

### type `EventName`

```typescript
import { EventName } from '@kim-kijun/typed-event-emitter';
type ExtractedEvents = EventName<MyEvents>;
// 'loadedEnd' | 'changeValue' | 'pressKey'
```

### type `EventHandler`

```typescript
import { EventHandler } from '@kim-kijun/typed-event-emitter';
type HandlerChangeValue = EventHandler<MyEvents, 'changeValue'>;
// (value: string): void
```

### type `EventHandlerParams`

```typescript
import { EventHandlerParams } from '@kim-kijun/typed-event-emitter';
type HandlerParamsPressKey = EventHandlerParams<MyEvents, 'pressKey'>;
// [string, number, boolean | undefined]
```

### type `ExtractEventType`

```typescript
import { ExtractEventType } from '@kim-kijun/typed-event-emitter';
type ExtractedEvents = ExtractEventType<typeof eventEmitter>;
// equals to 'MyEvents'
```
