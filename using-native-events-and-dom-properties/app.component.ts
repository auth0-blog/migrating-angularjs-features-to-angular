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
  private _initWinHeight: number = 0;

  ngOnInit() {
    Observable.fromEvent(window, 'resize')
      .debounceTime(200)
      .subscribe(event => this._resizeFn(event)
    );
    
    this._initWinHeight = window.innerHeight;
    this._resizeFn(null);
  }
  
  private _resizeFn(e) {
    let winHeight: number = e ? e.target.innerHeight : this._initWinHeight;
    this.minHeight = `${winHeight}px`;
  }

}
