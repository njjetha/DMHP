import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(environment.backendIP + '/api/auth', { username, password })
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.token);
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['login']);

  }
  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }


}
