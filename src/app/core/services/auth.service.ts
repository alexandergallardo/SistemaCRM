import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../models/users.models';
import { AccionEstablecerUsuario } from '../reducers/usuario.reducer';
import { EstadoGlobal } from '../reducers/estado-global.reducer';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router, private store: Store<EstadoGlobal>  ) {}

  login(
    schema: string, 
    email: string, 
    password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { schema, email, password };

    return this.http.post<any>(`${environment.apiBaseUrl}/auth/login`, body, { headers }).pipe(
      tap((response) => {
        this.token = response.access_token;
        if (response.schema) {
          localStorage.setItem('schema', response.schema);
        } else {
          console.log('Schema no recibido en la respuesta');
        }
        localStorage.setItem('token', this.token as string);
        if (response.user) {
          const user: User = response.user;
          this.store.dispatch(new AccionEstablecerUsuario(user));
        } else {
          console.log('Usuario no recibido en la respuesta');
        }
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of(null);
      })
    );
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('schema');
    this.router.navigate(['']);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
      console.log('Token obtenido de localStorage:', this.token);
    }
    return this.token || '';
  }

  getSchema(): string | null {
    return localStorage.getItem('schema');
  }

  isLoggedIn(): boolean {
    return !!this.token || !!localStorage.getItem('token');
  }
}
