import { Injectable } from '@angular/core';

@Injectable()
export class CounterService {
  count: number = 0;

  inc() {
    this.count++;
  }

  dec() {
    this.count--;
  }

  get getCount(): number {
    return this.count;
  }

}
