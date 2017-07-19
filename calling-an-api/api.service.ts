import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
  private baseUrl = 'https://www.reddit.com/';

  constructor(private http: HttpClient) { }

  getFrontPage$(): Observable<{[key: string]: any}[]> {
    return this.http
      .get(`${this.baseUrl}.json`)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  private handleSuccess(res: HttpResponse<any>) {
    return res.data.children;
  }

  private handleError(err: HttpErrorResponse | any) {
    let errorMsg = err.message || 'Unable to retrieve data';
    return Observable.throw(errorMsg);
  }

}
