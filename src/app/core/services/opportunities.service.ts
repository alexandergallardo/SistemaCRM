import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { IRespuestaHttpEstandar } from "../models/http.models";
import { Opportunity } from "../models/opportunity.models";

@Injectable({
  providedIn: 'root',
})

export class OportunitiesService {
  constructor(private readonly httpClient: HttpClient) { }

  public getOportunities(
    numeroPagina: number, 
    totalPagina: number,
    schema: string,
  ): Observable<IRespuestaHttpEstandar<Opportunity[]>> {
    const params = new HttpParams()
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString())
      .set('schema', schema);

    return this.httpClient.get<IRespuestaHttpEstandar<Opportunity[]>>(`${environment.apiBaseUrl}/sales/opportunities`, { params }).pipe(
      map((respuesta: IRespuestaHttpEstandar<Opportunity[]>) => {
        if (respuesta.status === 200) {
          return respuesta;
        } else {
          throw new Error('Respuesta no válida');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener oportunidades:', error);
        return throwError(() => new Error('Error al obtener oportunidades'));
      })
    );
  }

  public create(
    accountId: number,
    personId: number,
    probability: string,
    currency: string,
    baseAmount: number,
    serviceId: number,
    salesAgentId: number,
    salesStageId: number,
    schema: string,
  ): Observable<Opportunity> {
    const body = {
      accountId,
      personId,
      probability,
      currency,
      baseAmount,
      serviceId,
      salesAgentId,
      salesStageId,
      schema
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post<IRespuestaHttpEstandar<Opportunity>>(`${environment.apiBaseUrl}/sales/opportunities`, body, { headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<Opportunity>) => {
        if (resultado.status === 201 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la creación de la oportunidad');
        }
      }),
      catchError((error) => {
        console.error('Error al crear la oportunidad:', error);
        return throwError(() => new Error('Error al crear la oportunidad'));
      }),
    );
  }

  public update(
    id: number,
    accountId: number,
    personId: number,
    probability: string,
    currency: string,
    baseAmount: number,
    serviceId: number,
    salesAgentId: number,
    salesStageId: number,
    schema: string,
  ): Observable<number> {
    const body = {
      accountId,
      personId,
      probability,
      currency,
      baseAmount,
      serviceId,
      salesAgentId,
      salesStageId,
      schema
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.put<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/sales/opportunities/${id}`, body, { headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la actualización de la oportunidad');
        }
      }),
      catchError((error) => {
        console.error('Error al actualizar la oportunidad:', error);
        return throwError(() => new Error('Error al actualizar la oportunidad'));
      }),
    );
  }

  public delete(opportunityId: number, schema: string): Observable<number> {
    const params = new HttpParams().set('schema', schema);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.delete<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/sales/opportunities/${opportunityId}`, { headers, params }).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la eliminación de la oportunidad');
        }
      }),
      catchError((error) => {
        console.error('Error al eliminar la oportunidad:', error);
        return throwError(() => new Error('Error al eliminar la oportunidad'));
      }),
    );
  }

  public updateOpportunityStage(opportunityId: number, salesStageId: number, schema: string): Observable<any> {
    const body = {
      opportunityId,
      salesStageId,
      schema
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(`${environment.apiBaseUrl}/sales/opportunities/update-stage`, body, { headers });
  }
}