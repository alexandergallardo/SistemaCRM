import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRespuestaHttpEstandar } from '../models/http.models';
import { User } from '../models/users.models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly httpClient: HttpClient) { }

  public getUsers(
    name: string,
    numeroPagina: number, 
    totalPagina: number,
  ): Observable<IRespuestaHttpEstandar<User[]>> {
    const params = new HttpParams()
    .set('name', name)
    .set('numeroPagina', numeroPagina.toString())
    .set('totalPagina', totalPagina.toString());

    return this.httpClient.get<IRespuestaHttpEstandar<User[]>>(`${environment.apiBaseUrl}/users`, { params }).pipe(
      map((respuesta: IRespuestaHttpEstandar<User[]>) => {
        if (respuesta.status === 200) {
          return respuesta;
        } else {
          throw new Error('Respuesta no válida');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        return throwError(() => new Error('Error al obtener usuarios'));
      })
    );
  }

  public create(
    document: string,
    name: string,
    email: string,
    password: string,
    rolId: number,
  ): Observable<User> {
    const params = new HttpParams()
      .set('document', document)
      .set('name', name)
      .set('email', email)
      .set('password', password)
      .set('rolId', rolId)
      
    console.log(params);
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient.post<IRespuestaHttpEstandar<User>>(`${environment.apiBaseUrl}/users`, params, { headers: headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<User>) => {
        if (resultado.status === 201 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la creación del usuario');
        }
      }),
      catchError((error) => {
        console.error('Error al crear el usuario:', error);
        return throwError(() => new Error('Error al crear el usuario'));
      }),
    );
  }
}
