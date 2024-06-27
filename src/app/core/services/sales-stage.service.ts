import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRespuestaHttpEstandar } from '../models/http.models';
import { SalesStage } from '../models/sales_stage.models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SalesStageService {
  constructor(private readonly httpClient: HttpClient) { }

  public getSalesStage(
    numeroPagina: number, 
    totalPagina: number,
  ): Observable<IRespuestaHttpEstandar<SalesStage[]>> {
    const params = new HttpParams()
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString());

    return this.httpClient.get<IRespuestaHttpEstandar<SalesStage[]>>(`${environment.apiBaseUrl}/sales/sales-stage`, { params }).pipe(
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
}
