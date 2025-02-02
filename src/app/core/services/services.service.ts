import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { IRespuestaHttpEstandar } from "../models/http.models";
import { Service } from "../models/service.models";
import { HttpUtilsService } from "../../shared/services/http-utils.service";

@Injectable({
  providedIn: 'root',
})

export class ServicesService {
  constructor(private readonly httpClient: HttpClient, private readonly httpUtilsService: HttpUtilsService) { }

  public getServices(
    nombre: string,
    numeroPagina: number, 
    totalPagina: number,
    schema: string,
  ): Observable<IRespuestaHttpEstandar<Service[]>> {
    const params = new HttpParams()
      .set('name', nombre)
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString())
      .set('schema', schema);

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.get<IRespuestaHttpEstandar<Service[]>>(`${environment.apiBaseUrl}/settings/service`, { params, headers }).pipe(
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
    schema: string,
  ): Observable<Service> {
    const body = {
      code,
      name: nombre,
      measurementUnit,
      schema
    };
      
    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.post<IRespuestaHttpEstandar<Service>>(`${environment.apiBaseUrl}/settings/service`, body, { headers }).pipe(
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

  public delete(serviceId: number, schema: string): Observable<number> {
    const params = new HttpParams().set('schema', schema);

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient
      .delete<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/settings/service/${serviceId}`, { headers, params })
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

  public update(
    serviceId: number,
    nombre: string,
    measurementUnit: string,
    schema: string,
  ): Observable<number> {
    const body = {
      name: nombre,
      measurementUnit,
      schema
    };

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.put<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/settings/service/${serviceId}`, body, { headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la actualización del servicio');
        }
      }),
      catchError((error) => {
        console.error('Error al actualizar servicio:', error);
        return throwError(() => new Error('Error al actualizar servicio'));
      })
    );
  }
}