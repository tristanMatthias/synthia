import { Subject, Subscription } from 'rxjs';

export class EventObject<Events> {

  protected _subjects: Map<keyof Events, Subject<any>> = new Map();
  protected _subscriptions: Map<[keyof Events, (...args: any[]) => any], Subscription> = new Map();

  on<E extends keyof Events>(event: E, func: (e: Events[E]) => any) {
    let subject = this._subjects.get(event)
    if (!subject) {
      subject = new Subject();
      this._subjects.set(event, subject);
    }

    this._subscriptions.set([event, func], subject.subscribe(func));
  }


  off(event: keyof Events, func: () => any) {
    let subscription = this._subscriptions.get([event, func])
    if (!subscription) return false;
    subscription.unsubscribe();
    return true;
  }


  emit<E extends keyof Events>(event: E, data: Events[E]) {
    let subject = this._subjects.get(event)
    if (!subject) return false;
    subject.next(data);
    return true;
  }

  clear() {
    for(let [, sub] of this._subjects) sub.unsubscribe();
    for(let [, sub] of this._subscriptions) sub.unsubscribe();
    this._subjects.clear();
    this._subscriptions.clear();
  }
}
