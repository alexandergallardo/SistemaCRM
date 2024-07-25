import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRespuestaHttpEstandar } from '../models/http.models';
import { Rol } from '../models/rol.models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private readonly httpClient: HttpClient) { }

  public getRoles(
    nombre: string,
    numeroPagina: number, 
    totalPagina: number,
  ): Observable<IRespuestaHttpEstandar<Rol[]>> {
    const params = new HttpParams()
      .set('name', nombre)
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString());

    return this.httpClient.get<IRespuestaHttpEstandar<Rol[]>>(`${environment.apiBaseUrl}/settings/rol`, { params }).pipe(
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
}
