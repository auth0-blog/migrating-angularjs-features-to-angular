import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  template: `
    <div class="fullHeight" [style.min-height]="minHeight"></div>
  `,
  styles: [`
    .fullHeight { background: red; }
  `]
})
export class AppComponent implements OnInit {
  minHeight: string;
  private initWinHeight: number = 0;

  ngOnInit() {
    Observable.fromEvent(window, 'resize')
      .debounceTime(200)
      .subscribe(event => this.resizeFn(event)
    );
    
    this.initWinHeight = window.innerHeight;
    this.resizeFn(null);
  }
  
  private resizeFn(e) {
    let winHeight: number = e ? e.target.innerHeight : this.initWinHeight;
    this.minHeight = `${winHeight}px`;
  }
}
