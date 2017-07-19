import { Component } from '@angular/core';
import { FilterService } from './filter.service';

@Component({
  selector: 'app-list',
  template: `
    <label for="search">Search:</label>
    <input id="search" type="text" [(ngModel)]="query" />
    <button (click)="search()" [disabled]="!query">Go</button>
    <button (click)="reset()" [disabled]="!query">Reset</button>

    <ul>
      <li *ngFor="let item of filteredArray">{{item.name}}</li>
    </ul>
  `
})
export class ListComponent {
  array = [
    { id: 1, name: 'Jon Snow' },
    { id: 2, name: 'Sansa Stark' },
    { id: 3, name: 'Arya Stark' },
    { id: 4, name: 'Bran Stark' },
    { id: 5, name: 'Petyr Baelish' },
    { id: 6, name: 'Danaerys Targaryen' },
    { id: 7, name: 'Jaime Lannister ' },
    { id: 8, name: 'Cersei Lannister' },
    { id: 9, name: 'Samwell Tarly' },
    { id: 10, name: 'Sandor Clegane' }
  ];
  filteredArray = this.array;
  query: string;
  
  constructor(private filter: FilterService) { }

  search() {
    this.filteredArray = this.filter.search(this.array, this.query);
  }

  reset() {
    this.query = '';
    this.filteredArray = this.array;
  }

}
