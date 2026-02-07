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
  private currentUserKey = 'currentUser';
  private tokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  
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

  get isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return this.accessToken;
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login/`, credentials).pipe(
      tap((response: any) => {
        this.setAuthData(response.user, response.tokens);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register/`, userData).pipe(
      tap((response: any) => {
        this.setAuthData(response.user, response.tokens);
      })
    );
  }

  adminLogin(credentials: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/admin/login/`, credentials).pipe(
      tap((response: any) => {
        this.setAuthData(response.user, response.tokens);
      })
    );
  }

  private setAuthData(userData: any, tokens: any) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(userData));
    localStorage.setItem(this.tokenKey, tokens.access);
    localStorage.setItem(this.refreshTokenKey, tokens.refresh);
    this.currentUserSubject.next(userData);
    
    this.redirectBasedOnRole(userData.role);
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  updateCurrentUser(user: any) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private redirectBasedOnRole(role: string) {
    switch (role) {
      case 'customer':
        this.router.navigate(['/dashboard']);
        break;
      case 'vendor':
        this.router.navigate(['/vendor']);
        break;
      case 'admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  isCustomer(): boolean {
    return this.hasRole('customer');
  }

  isVendor(): boolean {
    return this.hasRole('vendor');
  }

  isAdmin(): boolean {
    return this.hasRole('admin') || this.currentUser?.is_superuser;
  }
}