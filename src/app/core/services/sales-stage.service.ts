import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRespuestaHttpEstandar } from '../models/http.models';
import { SalesStage } from '../models/sales_stage.models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpUtilsService } from '../../shared/services/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class SalesStageService {
  constructor(private readonly httpClient: HttpClient, private readonly httpUtilsService: HttpUtilsService,) { }

  public getSalesStages(
    numeroPagina: number, 
    totalPagina: number,
    schema: string,
  ): Observable<IRespuestaHttpEstandar<SalesStage[]>> {
    const params = {
      numeroPagina: numeroPagina.toString(),
      totalPagina: totalPagina.toString(),
      schema: schema,
    };
      
    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.get<IRespuestaHttpEstandar<SalesStage[]>>(
      `${environment.apiBaseUrl}/sales/sales-stage`, 
      { params, headers }
    ).pipe(
      map((respuesta: IRespuestaHttpEstandar<SalesStage[]>) => {
        if (respuesta.status === 200) {
          return respuesta;
        } else {
          throw new Error('Respuesta no válida');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener etapas de venta:', error);
        return throwError(() => new Error('Error al obtener etapas de venta'));
      })
    );
  }

  public create(
    name: string,
    schema: string,
  ): Observable<SalesStage> {
    const body = { name, schema };

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.post<IRespuestaHttpEstandar<SalesStage>>(
      `${environment.apiBaseUrl}/sales/sales-stage`, 
      body, 
      { headers }
    ).pipe(
      map((resultado: IRespuestaHttpEstandar<SalesStage>) => {
        if (resultado.status === 201 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la creación de la etapa de venta');
        }
      }),
      catchError((error) => {
        console.error('Error al crear la etapa de venta:', error);
        return throwError(() => new Error('Error al crear la etapa de venta'));
      }),
    );
  }

  public update(
    id: number,
    name: string,
    schema: string,
  ): Observable<number> {
    const body = { name, schema };

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.put<IRespuestaHttpEstandar<number>>(
      `${environment.apiBaseUrl}/sales/sales-stage/${id}`, 
      body, 
      { headers }
    ).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la actualización de la etapa de venta');
        }
      }),
      catchError((error) => {
        console.error('Error al actualizar la etapa de venta:', error);
        return throwError(() => new Error('Error al actualizar la etapa de venta'));
      }),
    );
  }

  public delete(id: number, schema: string): Observable<number> {
    const params = { schema };
    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.delete<IRespuestaHttpEstandar<number>>(
      `${environment.apiBaseUrl}/sales/sales-stage/${id}`, 
      { headers, params }
    ).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la eliminación de la etapa de venta');
        }
      }),
      catchError((error) => {
        console.error('Error al eliminar la etapa de venta:', error);
        return throwError(() => new Error('Error al eliminar la etapa de venta'));
      }),
    );
  }

  public createMultiple(etapas: { name: string; position: number; schema: string }[]): Observable<void> {
    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.post<void>(
      `${environment.apiBaseUrl}/sales/sales-stage/multiple`, 
      etapas, 
      { headers }
    ).pipe(
      catchError((error) => {
        console.error('Error al crear las etapas de venta:', error);
        return throwError(() => new Error('Error al crear las etapas de venta'));
      }),
    );
  }
}
