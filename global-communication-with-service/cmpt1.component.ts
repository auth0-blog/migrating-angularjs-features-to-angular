import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-cmpt1',
  template: `
    <div>
      <h2>Counter (Component 1)</h2>
      <button (click)="counter.dec()">-</button>
      {{counter.getCount}}
      <button (click)="counter.inc()">+</button>
    <div>
  `
})
export class Cmpt1Component implements OnInit, OnDestroy {
  countSub: Subscription;
  
  constructor(private counter: CounterService) { }

  ngOnInit() {
    this.countSub = this.counter.count$.subscribe(
      value => {
        console.log('counter value changed:', value);
      }
    );
  }

  ngOnDestroy() {
    this.countSub.unsubscribe();
  }
}
