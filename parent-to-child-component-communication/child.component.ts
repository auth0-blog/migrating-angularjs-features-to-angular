import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<div>{{data.name}}</div>`
})
export class ChildComponent implements OnInit {
  @Input() data: {[key: string]: any};
  
  ngOnInit() {
    console.log('Data for child:', this.data);
  }

}
