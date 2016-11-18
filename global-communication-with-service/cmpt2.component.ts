import { Component, OnInit } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-cmpt2',
  template: `
    <div>
      <h2>Counter (Component 2)</h2>
      <button (click)="counter.dec()">-</button>
      {{counter.getCount}}
      <button (click)="counter.inc()">+</button>
    <div>
  `
})
export class Cmpt2Component implements OnInit {
  
  constructor(private counter: CounterService) { }

  ngOnInit() {
  }
}
