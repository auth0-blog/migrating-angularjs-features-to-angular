import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-reddit',
  template: `
    <ul>
      <li *ngFor="let post of redditFP">
        <a href="http://reddit.com{{post.data.permalink}}">{{post.data.title}}</a>
      </li>
    </ul>
  `
})
export class RedditComponent implements OnInit {
  redditFP: Object;
  
  constructor(private redditApi: ApiService) { }

  ngOnInit() {
    this.getRedditFront();
  }

  getRedditFront() {
    this.redditApi
      .getFrontPage$()
      .subscribe(
        res => this.redditFP = res,
        err => console.log('An error occurred', err)
      );
  }
}
