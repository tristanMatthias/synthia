import { Subject, Subscription } from 'rxjs';

export class EventObject<Events> {

  protected _subjects: Map<keyof Events, Subject<any>> = new Map();
  protected _subscriptions: Map<[keyof Events, (...args: any[]) => any], Subscription> = new Map();
  protected _once: Partial<{
    [event in keyof Events]: ((...args: any[]) => any)[]
  }> = {}

  on<E extends keyof Events>(event: E, func: (e: Events[E]) => any) {
    let subject = this._subjects.get(event)
    if (!subject) {
      subject = new Subject();
      this._subjects.set(event, subject);
    }
    this._subscriptions.set([event, func], subject.subscribe(func));

    return () => this.off(event, func);
  }

  once<E extends keyof Events>(event: E, func: (e: Events[E]) => any) {
    this.on(event, func);
    if (!this._once[event]) this._once[event] = [];
    this._once[event]!.push(func);
  }


  off<E extends keyof Events>(event: E, func: (e: Events[E]) => any) {
    let subscription = this._subscriptions.get([event, func])
    if (!subscription) return false;
    subscription.unsubscribe();
    return true;
  }


  emit<E extends keyof Events>(event: E, data: Events[E]) {
    let subject = this._subjects.get(event)
    if (!subject) return false;
    subject.next(data);

    if (this._once[event]) {
      this._once[event]!.forEach(s => this.off(event, s));
      this._once[event] = [];
    }

    return true;
  }

  clear() {
    for(let [, sub] of this._subjects) sub.unsubscribe();
    for(let [, sub] of this._subscriptions) sub.unsubscribe();
    this._subjects.clear();
    this._subscriptions.clear();
  }
}
