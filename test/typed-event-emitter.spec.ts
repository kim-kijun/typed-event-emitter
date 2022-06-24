import { should } from 'chai';
import { EventHandler, TypedEventEmitter } from '../src';

type MyEvent = {
  eventA(n: number): void;
  eventB(b: boolean): void;
  eventC(s: string, an: Array<number>): void;
};

describe('TEST FOR TYPE (dev)', () => {
  it('1 - on, emit, off', () => {
    let callCount = 0;

    const eventEmitter = new TypedEventEmitter<{
      onChange(value: string): void;
    }>();

    function onChange(value: string) {
      callCount++;
      should().equal(value, 'abcde');
      should().equal(typeof value, 'string');
    }

    eventEmitter.on('onChange', onChange);
    eventEmitter.emit('onChange', 'abcde');
    should().equal(callCount, 1);
    eventEmitter.emit('onChange', 'abcde');
    should().equal(callCount, 2);
    eventEmitter.off('onChange', onChange);
    eventEmitter.emit('onChange', 'abcde');
    should().equal(callCount, 2);
  });

  it('2 - once, addListener, removeListener, listeneres', () => {
    let count = {
      eventA: 0,
      eventB: 0,
      eventC: 0,
    };

    const eventEmitter = new TypedEventEmitter<MyEvent>();

    eventEmitter.setMaxListeners(100);
    should().equal(eventEmitter.getMaxListeners(), 100);

    eventEmitter.once('eventA', (n) => (count.eventA += n));
    eventEmitter.on('eventA', (n) => (count.eventA += n));
    eventEmitter.emit('eventA', 1);
    should().equal(count.eventA, 2);
    eventEmitter.emit('eventA', 1);
    should().equal(count.eventA, 3);

    eventEmitter.addListener('eventB', (b) => b && count.eventB++);
    eventEmitter.emit('eventB', false);
    should().equal(count.eventB, 0);
    eventEmitter.emit('eventB', true);
    should().equal(count.eventB, 1);
    eventEmitter.listeners('eventB')[0](true);
    should().equal(count.eventB, 2);
    eventEmitter.removeListener('eventB', eventEmitter.listeners('eventB')[0]);
    eventEmitter.emit('eventB', true);
    should().equal(count.eventB, 2);
  });

  it('3 - setMaxListeners, getMaxListeners', () => {
    const eventEmitter = new TypedEventEmitter<MyEvent>();

    eventEmitter.setMaxListeners(100);
    should().equal(eventEmitter.getMaxListeners(), 100);
  });

  it('4 - eventNames, removeAllListeners', () => {
    const eventEmitter = new TypedEventEmitter<MyEvent>();

    eventEmitter.on('eventA', () => {});
    eventEmitter.on('eventB', () => {});
    eventEmitter.on('eventC', () => {});
    eventEmitter.on('eventC', () => {});
    should().equal(
      `${eventEmitter.eventNames()}`,
      `${['eventA', 'eventB', 'eventC']}`,
    );

    eventEmitter.removeAllListeners('eventC');
    should().equal(`${eventEmitter.eventNames()}`, `${['eventA', 'eventB']}`);

    eventEmitter.removeAllListeners('eventA');
    should().equal(`${eventEmitter.eventNames()}`, `${['eventB']}`);

    eventEmitter.removeAllListeners('eventB');
    should().equal(`${eventEmitter.eventNames()}`, `${[]}`);
  });

  it('5 - prependListener, prependOnceListener', () => {
    let count = {
      eventA: 0,
      eventB: 0,
      eventC: 0,
    };

    const eventEmitter = new TypedEventEmitter<MyEvent>();
    eventEmitter.addListener('eventA', (n) => (count.eventA += n));
    eventEmitter.prependListener('eventA', (n) => (count.eventA -= n));
    eventEmitter.listeners('eventA')[0](2);
    should().equal(count.eventA, -2);

    eventEmitter.addListener('eventB', (b) => b && count.eventB++);
    eventEmitter.prependOnceListener('eventB', (b) => b && count.eventB--);
    eventEmitter.listeners('eventB')[0](true);
    should().equal(count.eventB, -1);
    eventEmitter.emit('eventB', true);
    should().equal(count.eventB, -1);
    eventEmitter.emit('eventB', true);
    should().equal(count.eventB, 0);
  });

  it('6 - inherit class test', () => {
    class MyEventClass extends TypedEventEmitter<MyEvent> {
      countA = 0;
      countB = 0;
      countC = 0;

      constructor() {
        super();
        this.on('eventA', this.increaseCountA);
        this.on('eventB', this.increaseCountB.bind(this));
      }

      increaseCountA: EventHandler<MyEvent, 'eventA'> = (n) => {
        this.countA += n;
      };

      increaseCountB(b: boolean) {
        b && this.countB++;
      }
    }

    const myEventEmitter = new MyEventClass();
    should().equal(myEventEmitter.countA, 0);
    should().equal(myEventEmitter.countB, 0);

    myEventEmitter.emit('eventA', 1);
    should().equal(myEventEmitter.countA, 1);

    myEventEmitter.emit('eventB', true);
    should().equal(myEventEmitter.countB, 1);
  });
});
