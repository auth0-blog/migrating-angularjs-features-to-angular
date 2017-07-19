import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CounterService {
  count = 0;
  count$ = new BehaviorSubject<number>(this.count);

  inc() {
    this.count++;
    this.updateCountSbj(this.count);
  }

  dec() {
    this.count--;
    this.updateCountSbj(this.count);
  }

  get getCount(): number {
    return this.count;
  }
  
  private updateCountSbj(value) {
    this.count$.next(value);
  }

}
