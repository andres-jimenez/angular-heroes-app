import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { environments } from '../../../environments/environments';

import { User } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(private httpClient: HttpClient) {}

  get currentUser(): User | undefined {
    if (!this.user) return undefined;

    return structuredClone(this.user);
  }

  login(): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => {
        this.user = user;
      }),
      tap((user) => localStorage.setItem('token', user.id.toString()))
    );
  }

  logout(): void {
    this.user = undefined;

    localStorage.clear();
  }

  validateAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) return of(false);

    return this.httpClient.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => {
        this.user = user;
      }),
      map((user) => !!user),
      catchError(() => of(false))
    );
  }
}
