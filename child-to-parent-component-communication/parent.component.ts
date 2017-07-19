import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <div *ngIf="elementShow">Show this conditionally in parent template!</div>
    <app-child (elementToggled)="elementToggleHandler($event)"></app-child>
  `
})
export class ParentComponent {
  elementShow: boolean;

  elementToggleHandler(e: boolean) {
    this.elementShow = e;
  }

}
