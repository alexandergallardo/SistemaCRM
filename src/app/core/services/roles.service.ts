import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRespuestaHttpEstandar } from '../models/http.models';
import { Rol } from '../models/rol.models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpUtilsService } from '../../shared/services/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private readonly httpClient: HttpClient,  private httpUtilsService: HttpUtilsService) { }

  public getRoles(
    nombre: string,
    numeroPagina: number, 
    totalPagina: number,
    schema: string,
  ): Observable<IRespuestaHttpEstandar<Rol[]>> {
    const params = new HttpParams()
      .set('name', nombre)
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString())
      .set('schema', schema);

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.get<IRespuestaHttpEstandar<Rol[]>>(`${environment.apiBaseUrl}/settings/rol`, { params, headers }).pipe(
      map((respuesta: IRespuestaHttpEstandar<Rol[]>) => {
        if (respuesta.status === 200) {
          return respuesta;
        } else {
          throw new Error('Respuesta no válida');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener roles:', error);
        return throwError(() => new Error('Error al obtener roles'));
      })
    );
  }

  public create(
    name: string,
    permissions: Record<string, any>,
    schema: string,
  ): Observable<Rol> {
    const body = {
      name,
      permissions,
      schema
    };

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.post<IRespuestaHttpEstandar<Rol>>(`${environment.apiBaseUrl}/settings/rol`, body, { headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<Rol>) => {
        if (resultado.status === 201 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la creación del rol');
        }
      }),
      catchError((error) => {
        console.error('Error al crear rol:', error);
        return throwError(() => new Error('Error al crear rol'));
      }),
    );
  }

  public update(
    id: number,
    name: string,
    permissions: Record<string, any>,
    schema: string,
  ): Observable<number> {
    const body = {
      name,
      permissions,
      schema
    };

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.put<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/settings/rol/${id}`, body, { headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la actualización del rol');
        }
      }),
      catchError((error) => {
        console.error('Error al actualizar rol:', error);
        return throwError(() => new Error('Error al actualizar rol'));
      }),
    );
  }

  public delete(id: number, schema: string): Observable<number> {
    const headers = this.httpUtilsService.getHeaders();
    const params = new HttpParams().set('schema', schema);

    return this.httpClient
      .delete<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/settings/rol/${id}`, { headers, params })
      .pipe(
        map((resultado: IRespuestaHttpEstandar<number>) => {
          if (resultado.status === 200 && resultado.data) {
            return resultado.data;
          } else {
            throw new Error('Error en la eliminación del rol');
          }
        }),
        catchError((error) => {
          console.error('Error al eliminar rol:', error);
          return throwError(() => new Error('Error al eliminar rol'));
        }),
      );
  }
}
