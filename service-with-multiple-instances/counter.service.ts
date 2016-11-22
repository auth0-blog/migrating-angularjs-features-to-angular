import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CounterService {
  count: number = 0;
  private countSource = new BehaviorSubject<number>(this.count);

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

  count$ = this.countSource;
  
  private updateCountSbj(value) {
    this.countSource.next(value);
  }

}
