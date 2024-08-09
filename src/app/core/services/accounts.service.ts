import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { IRespuestaHttpEstandar } from "../models/http.models";
import { Account } from "../models/account.models";
import { HttpUtilsService } from "../../shared/services/http-utils.service";

@Injectable({
  providedIn: 'root',
})

export class AccountsService {
  constructor(private readonly httpClient: HttpClient, private httpUtilsService: HttpUtilsService) { }

  public getAccounts(
    document: string, 
    companyName: string,
    sectorId: number | null,
    numeroPagina: number, 
    totalPagina: number,
    schema: string,
  ): Observable<IRespuestaHttpEstandar<Account[]>> {
    let params = new HttpParams()
      .set('document', document)
      .set('companyName', companyName)
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString())
      .set('schema', schema);

    if (sectorId !== null) {
      params = params.set('sectorId', sectorId.toString());
    }
    
    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.get<IRespuestaHttpEstandar<Account[]>>(`${environment.apiBaseUrl}/sales/account`, { params, headers }).pipe(
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
    schema: string,
  ): Observable<Account> {
    const body = {
      document,
      companyName,
      businessGroup,
      sectorId,
      numberOfEmployees,
      tradeName,
      legalAddress,
      description,
      salesAgentId,
      website,
      facebook,
      instagram,
      linkedin,
      schema,
    };
  
    const headers = this.httpUtilsService.getHeaders();
  
    return this.httpClient.post<IRespuestaHttpEstandar<Account>>(
      `${environment.apiBaseUrl}/sales/account`, 
      body, 
      { headers }
    ).pipe(
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

  public delete(accountId: number, schema: string): Observable<number> {
    const headers = this.httpUtilsService.getHeaders();
    const params = new HttpParams().set('schema', schema);

    return this.httpClient
      .delete<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/sales/account/${accountId}`, { headers, params })
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

  public update(
    accountId: number,
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
    schema: string,
  ): Observable<number> {
    const body = {
      document,
      companyName,
      businessGroup,
      sectorId,
      numberOfEmployees,
      tradeName,
      legalAddress,
      description,
      salesAgentId,
      website,
      facebook,
      instagram,
      linkedin,
      schema,
    };

    const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.put<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/sales/account/${accountId}`, body, { headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error al actualizar la cuenta');
        }
      }),
      catchError((error) => {
        console.error('Error al actualizar la cuenta:', error);
        return throwError(() => new Error('Error al actualizar la cuenta'));
      }),
    );
  }
}
