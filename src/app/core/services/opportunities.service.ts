import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
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

  updateOpportunityStage(opportunityId: number, salesStageId: number): Observable<any> {
    return this.httpClient.post(`${environment.apiBaseUrl}/sales/opportunities/update-stage`, { opportunityId, salesStageId });
  }
}