import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { IRespuestaHttpEstandar } from "../models/http.models";
import { Sector } from "../models/sector.models";
import { AuthService } from "./auth.service";
import { HttpUtilsService } from "../../shared/services/http-utils.service";

@Injectable({
  providedIn: 'root',
})

export class SectorsService {
  constructor(private readonly httpClient: HttpClient, private httpUtilsService: HttpUtilsService) { }

  public getSectors(
    nombre: string,
    numeroPagina: number, 
    totalPagina: number,
    schema: string,
  ): Observable<IRespuestaHttpEstandar<Sector[]>> {
    const params = new HttpParams()
      .set('name', nombre)
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString())
      .set('schema', schema);

      const headers = this.httpUtilsService.getHeaders();

    return this.httpClient.get<IRespuestaHttpEstandar<Sector[]>>(`${environment.apiBaseUrl}/settings/sector`, { params, headers }).pipe(
      map((respuesta: IRespuestaHttpEstandar<Sector[]>) => {
        if (respuesta.status === 200) {
          return respuesta;
        } else {
          throw new Error('Respuesta no válida');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener sectores:', error);
        return throwError(() => new Error('Error al obtener sectores'));
      })
    );
  }

  public create(nombre: string, schema: string): Observable<Sector> {
    const body = { name: nombre, schema };
    const headers = this.httpUtilsService.getHeaders();
  
    return this.httpClient.post<IRespuestaHttpEstandar<Sector>>(
      `${environment.apiBaseUrl}/settings/sector`, 
      body, 
      { headers }
    ).pipe(
      map((resultado: IRespuestaHttpEstandar<Sector>) => {
        if (resultado.status === 201 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la creación del sector');
        }
      }),
      catchError((error) => {
        console.error('Error al crear sector:', error);
        return throwError(() => new Error('Error al crear sector'));
      }),
    );
  }

  public delete(sectorId: number, schema: string): Observable<number> {
    const headers = this.httpUtilsService.getHeaders();
  
    return this.httpClient.delete<IRespuestaHttpEstandar<number>>(
      `${environment.apiBaseUrl}/settings/sector/${sectorId}`, 
      { headers, params: new HttpParams().set('schema', schema) }
    ).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la eliminación del sector');
        }
      }),
      catchError((error) => {
        console.error('Error al eliminar sector:', error);
        return throwError(() => new Error('Error al eliminar sector'));
      }),
    );
  }

  public update(sectorId: number, nombre: string, schema: string): Observable<number> {
    const body = { name: nombre, schema };
    const headers = this.httpUtilsService.getHeaders();
  
    return this.httpClient.put<IRespuestaHttpEstandar<number>>(
      `${environment.apiBaseUrl}/settings/sector/${sectorId}`, 
      body, 
      { headers }
    ).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la actualización del sector');
        }
      }),
      catchError((error) => {
        console.error('Error al actualizar sector:', error);
        return throwError(() => new Error('Error al actualizar sector'));
      }),
    );
  }
  
}