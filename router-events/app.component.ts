import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ``
})
export class AppComponent implements OnInit {
  
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(event => {
        // do something every time a location change is initiated
      });
  }
}
