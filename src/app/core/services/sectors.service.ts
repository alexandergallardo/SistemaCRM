import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { IRespuestaHttpEstandar } from "../models/http.models";
import { Sector } from "../models/sector.models";

@Injectable({
  providedIn: 'root',
})

export class SectorsService {
  constructor(private readonly httpClient: HttpClient) { }

  public getSectors(
    nombre: string,
    numeroPagina: number, 
    totalPagina: number,
  ): Observable<IRespuestaHttpEstandar<Sector[]>> {
    const params = new HttpParams()
      .set('name', nombre)
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString());

    return this.httpClient.get<IRespuestaHttpEstandar<Sector[]>>(`${environment.apiBaseUrl}/account/sector`, { params }).pipe(
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

  public create(nombre: string): Observable<Sector> {
    const params = new HttpParams().set('name', nombre);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient.post<IRespuestaHttpEstandar<Sector>>(`${environment.apiBaseUrl}/account/sector`, params, { headers: headers }).pipe(
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

  public delete(sectorId: number): Observable<number> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient
      .delete<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/account/sector/${sectorId}`, { headers: headers })
      .pipe(
        map((resultado: IRespuestaHttpEstandar<number>) => {
          if (resultado.status === 200 && resultado.data) {
            return resultado.data;
          }
          else {
            throw new Error('Error en la eliminación del sector');
          }
        }),
        catchError((error) => {
          console.error('Error al eliminar sector:', error);
          return throwError(() => new Error('Error al eliminar sector'));
        }),
      );
  }
}