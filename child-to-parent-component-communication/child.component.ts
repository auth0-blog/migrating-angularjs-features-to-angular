import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <button (click)="toggleElement()">Toggle Parent from Child</button>
  `
})
export class ChildComponent {
  @Output() elementToggled = new EventEmitter();
  elementShow: boolean = false;

  toggleElement() {
    this.elementShow = !this.elementShow;
    this.elementToggled.emit(this.elementShow);
  }
}
