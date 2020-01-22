import { Subscription, Observable, interval, PartialObserver } from 'rxjs';
import {} from 'rxjs/operators';

// Using a single Subscription
let subscription: Subscription;

// Using an array of Subscriptions
let subscriptions: Subscription[];

function setup() {
  const sub1 = interval(1).subscribe(() => {
    /* do something */
  });
  const sub2 = interval(1).subscribe(() => {
    /* do something */
  });
  const sub3 = interval(1).subscribe(() => {
    /* do something */
  });

  // Using the .add() method to group subscriptions
  subscription = sub1.add(sub2).add(sub3);

  // Using an array to group subscriptions
  subscriptions = [sub1, sub2, sub3];
}

function destroy() {
  // Calling unsubscribe will also unsubscribe all added subscriptions
  subscription.unsubscribe();

  // Or iterate over the array and unsubscribe from each individually
  subscriptions.forEach(sub => sub.unsubscribe());
}

interface OnDestroy {
  ngOnDestroy: Function;
}

abstract class SubscriptionManager implements OnDestroy {
  private subPool = new Subscription();

  ngOnDestroy() {
    this.subPool.unsubscribe();
  }

  protected subscribe<T>(
    observable: Observable<T>,
    observerOrNext?: PartialObserver<T> | ((value: T) => void),
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return this.subPool.add(observable.subscribe(observerOrNext as any, error, complete));
  }

  protected unsubscribe(innerSub: Subscription) {
    this.subPool.remove(innerSub);
  }
}

class UserSubManager extends SubscriptionManager {
  count = 0;
  countSub: Subscription;

  ngOnInit() {
    this.countSub = this.subscribe(interval(1000), value => {
      this.count++;
      console.log(value);
    });
  }

  manualStop() {
    // this.countSub.unsubscribe();
    this.unsubscribe(this.countSub);
  }
}
