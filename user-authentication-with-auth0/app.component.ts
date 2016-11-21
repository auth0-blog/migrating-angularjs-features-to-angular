import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  template: `
    <button *ngIf="!auth.authenticated" (click)="auth.login()">Log In</button>

    <div *ngIf="auth.authenticated">
      <p *ngIf="auth.userProfile">Hello, {{auth.userProfile.name}}!</p>
      <button (click)="auth.logout()">Log Out</button>
    </div>
  `
})
export class AppComponent {
  constructor(private auth: AuthService) { }
}
