import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <app-child *ngFor="let item of items" [data]="item"></app-child>
  `
})
export class ParentComponent {
  items: Object[] = [
	  { name: 'Allosaurus' },
    { name: 'Brachiosaurus' },
    { name: 'Dionychus' },
    { name: 'Elasmosaurus' },
    { name: 'Parasaurolophus' }
  ];
}
