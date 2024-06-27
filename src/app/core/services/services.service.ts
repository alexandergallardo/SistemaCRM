import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { IRespuestaHttpEstandar } from "../models/http.models";
import { Sector } from "../models/sector.models";
import { Service } from "../models/service.models";

@Injectable({
  providedIn: 'root',
})

export class ServicesService {
  constructor(private readonly httpClient: HttpClient) { }

  public getServices(
    nombre: string,
    numeroPagina: number, 
    totalPagina: number,
  ): Observable<IRespuestaHttpEstandar<Service[]>> {
    const params = new HttpParams()
      .set('name', nombre)
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString());

    return this.httpClient.get<IRespuestaHttpEstandar<Service[]>>(`${environment.apiBaseUrl}/sales/service`, { params }).pipe(
      map((respuesta: IRespuestaHttpEstandar<Service[]>) => {
        if (respuesta.status === 200) {
          return respuesta;
        } else {
          throw new Error('Respuesta no válida');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener servicios:', error);
        return throwError(() => new Error('Error al obtener servicios'));
      })
    );
  }

  public create(
    code: string,
    nombre: string,
    measurementUnit: string,
  ): Observable<Service> {
    const params = new HttpParams()
      .set('code', code)
      .set('name', nombre)
      .set('measurementUnit', measurementUnit);
      
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient.post<IRespuestaHttpEstandar<Service>>(`${environment.apiBaseUrl}/sales/service`, params, { headers: headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<Service>) => {
        if (resultado.status === 201 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la creación del servicio');
        }
      }),
      catchError((error) => {
        console.error('Error al crear servicio:', error);
        return throwError(() => new Error('Error al crear servicio'));
      }),
    );
  }

  public delete(serviceId: number): Observable<number> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient
      .delete<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/sales/service/${serviceId}`, { headers: headers })
      .pipe(
        map((resultado: IRespuestaHttpEstandar<number>) => {
          if (resultado.status === 200 && resultado.data) {
            return resultado.data;
          }
          else {
            throw new Error('Error en la eliminación del servicio');
          }
        }),
        catchError((error) => {
          console.error('Error al eliminar servicio:', error);
          return throwError(() => new Error('Error al eliminar servicio'));
        }),
      );
  }
}