import { Injectable } from '@angular/core';
import { CanActivate, CanMatch, Router } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanMatch, CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  private checkAuthenticationStatus() {
    return this.authService.validateAuthentication().pipe(
      tap((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/heroes/list');
        }
      }),
      map((isAuthenticated) => !isAuthenticated)
    );
  }

  canMatch(): Observable<boolean> {
    return this.checkAuthenticationStatus();
  }

  canActivate(): Observable<boolean> {
    return this.checkAuthenticationStatus();
  }
}
