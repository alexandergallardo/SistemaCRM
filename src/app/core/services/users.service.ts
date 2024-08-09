import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRespuestaHttpEstandar } from '../models/http.models';
import { User } from '../models/users.models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpUtilsService } from '../../shared/services/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly httpClient: HttpClient, private httpUtilsService: HttpUtilsService) { }

  public getUsers(
    name: string,
    numeroPagina: number, 
    totalPagina: number,
    schema: string,
  ): Observable<IRespuestaHttpEstandar<User[]>> {
    const params = new HttpParams()
      .set('name', name)
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString())
      .set('schema', schema);

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.get<IRespuestaHttpEstandar<User[]>>(`${environment.apiBaseUrl}/users`, { params, headers }).pipe(
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
    schema: string,
  ): Observable<User> {
    const body = {
      document,
      name,
      email,
      password,
      rolId,
      schema,
    };
      
    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.post<IRespuestaHttpEstandar<User>>(`${environment.apiBaseUrl}/users`, body, { headers }).pipe(
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

  public update(
    id: number,
    document: string,
    name: string,
    email: string,
    password: string,
    rolId: number,
    schema: string,
  ): Observable<number> {
    const body = {
      document,
      name,
      email,
      password,
      rolId,
      schema,
    };

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.put<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/users/${id}`, body, { headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error al actualizar el usuario');
        }
      }),
      catchError((error) => {
        console.error('Error al actualizar el usuario:', error);
        return throwError(() => new Error('Error al actualizar el usuario'));
      }),
    );
  }

  public delete(id: number, schema: string): Observable<number> {
    const headers = this.httpUtilsService.getHeaders();
    const params = new HttpParams().set('schema', schema);

    return this.httpClient
      .delete<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/users/${id}`, { headers, params })
      .pipe(
        map((resultado: IRespuestaHttpEstandar<number>) => {
          if (resultado.status === 200 && resultado.data) {
            return resultado.data;
          } else {
            throw new Error('Error al eliminar el usuario');
          }
        }),
        catchError((error) => {
          console.error('Error al eliminar el usuario:', error);
          return throwError(() => new Error('Error al eliminar el usuario'));
        }),
      );
  }
}
