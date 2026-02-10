import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserKey = 'adminUser';
  private tokenKey = 'adminToken';
  private refreshTokenKey = 'adminRefreshToken';
  
  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getCurrentUserFromStorage(): any {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  get currentUser(): any {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  adminLogin(credentials: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/admin/login/`, credentials).pipe(
      tap((response: any) => {
        this.setAuthData(response.user, response.tokens);
      })
    );
  }

  private setAuthData(userData: any, tokens: any) {
    // Verify user is admin
    if (userData.role !== 'admin' && !userData.is_superuser) {
      throw new Error('Access denied - Admins only');
    }

    localStorage.setItem(this.currentUserKey, JSON.stringify(userData));
    localStorage.setItem(this.tokenKey, tokens.access);
    localStorage.setItem(this.refreshTokenKey, tokens.refresh);
    this.currentUserSubject.next(userData);
    
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
