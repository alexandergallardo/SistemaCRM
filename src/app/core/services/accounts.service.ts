import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { IRespuestaHttpEstandar } from "../models/http.models";
import { Account } from "../models/account.models";

@Injectable({
  providedIn: 'root',
})

export class AccountsService {
  constructor(private readonly httpClient: HttpClient) { }

  public getAccounts(
    document: string, 
    companyName: string,
    sector: string,
    numeroPagina: number, 
    totalPagina: number,
  ): Observable<IRespuestaHttpEstandar<Account[]>> {
    const params = new HttpParams()
    .set('document', document)
    .set('companyName', companyName)
    .set('sector', sector)
    .set('numeroPagina', numeroPagina.toString())
    .set('totalPagina', totalPagina.toString());

    return this.httpClient.get<IRespuestaHttpEstandar<Account[]>>(`${environment.apiBaseUrl}/sales/account`, { params }).pipe(
      map((respuesta: IRespuestaHttpEstandar<Account[]>) => {
        if (respuesta.status === 200) {
          return respuesta;
        } else {
          throw new Error('Respuesta no válida');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener cuentas:', error);
        return throwError(() => new Error('Error al obtener cuentas'));
      })
    );
  }

  public create(
    document: string,
    companyName: string,
    businessGroup: string,
    sectorId: number,
    numberOfEmployees: number,
    tradeName: string,
    legalAddress: string,
    description: string,
    salesAgentId: number,
    website: string,
    facebook: string,
    instagram: string,
    linkedin: string,

  ): Observable<Account> {
    const params = new HttpParams()
      .set('document', document)
      .set('companyName', companyName)
      .set('businessGroup', businessGroup)
      .set('sectorId', sectorId)
      .set('numberOfEmployees', numberOfEmployees)
      .set('tradeName', tradeName)
      .set('legalAddress', legalAddress)
      .set('description', description)
      .set('salesAgentId', salesAgentId)
      .set('website', website)
      .set('facebook', facebook)
      .set('instagram', instagram)
      .set('linkedin', linkedin);
      
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient.post<IRespuestaHttpEstandar<Account>>(`${environment.apiBaseUrl}/sales/account`, params, { headers: headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<Account>) => {
        if (resultado.status === 201 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la creación de la cuenta');
        }
      }),
      catchError((error) => {
        console.error('Error al crear la cuenta:', error);
        return throwError(() => new Error('Error al crear la cuenta'));
      }),
    );
  }

  public delete(accountId: number): Observable<number> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient
      .delete<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/sales/account/${accountId}`, { headers: headers })
      .pipe(
        map((resultado: IRespuestaHttpEstandar<number>) => {
          if (resultado.status === 200 && resultado.data) {
            return resultado.data;
          }
          else {
            throw new Error('Error en la eliminación de la cuenta');
          }
        }),
        catchError((error) => {
          console.error('Error al eliminar la cuenta:', error);
          return throwError(() => new Error('Error al eliminar la cuenta'));
        }),
      );
  }
}