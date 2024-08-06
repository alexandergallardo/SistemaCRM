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
  ): Observable<IRespuestaHttpEstandar<Opportunity[]>> {
    const params = new HttpParams()
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString());

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
  ): Observable<Opportunity> {
    const params = new HttpParams()
      .set('accountId', accountId)
      .set('personId', personId)
      .set('probability', probability)
      .set('currency', currency)
      .set('baseAmount', baseAmount)
      .set('serviceId', serviceId)
      .set('salesAgentId', salesAgentId)
      .set('salesStageId', salesStageId);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient.post<IRespuestaHttpEstandar<Opportunity>>(`${environment.apiBaseUrl}/sales/opportunities`, params, { headers: headers }).pipe(
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

  updateOpportunityStage(opportunityId: number, salesStageId: number): Observable<any> {
    return this.httpClient.post(`${environment.apiBaseUrl}/sales/opportunities/update-stage`, { opportunityId, salesStageId });
  }
}