import { Component, OnInit } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-cmpt1',
  providers: [CounterService],
  template: `
    <div>
      <h2>Counter (Component 1)</h2>
      <button (click)="counter.dec()">-</button>
      {{counter.getCount}}
      <button (click)="counter.inc()">+</button>
    <div>
  `
})
export class Cmpt1Component implements OnInit {
  
  constructor(private counter: CounterService) { }

  ngOnInit() {

  }
}
