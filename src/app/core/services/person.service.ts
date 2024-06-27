import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRespuestaHttpEstandar } from '../models/http.models';
import { Contact, CustomAttribute, Lead, Person } from '../models/person.models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private readonly httpClient: HttpClient) { }

  public getContacts(
    nombre: string,
    numeroPagina: number,
    totalPagina: number,
  ): Observable<IRespuestaHttpEstandar<Contact[]>> {
    const params = new HttpParams()
      .set('name', nombre)
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString());

    return this.httpClient.get<IRespuestaHttpEstandar<Contact[]>>(`${environment.apiBaseUrl}/person/contacts`, { params }).pipe(
      map((respuesta: IRespuestaHttpEstandar<Contact[]>) => {
        if (respuesta.status === 200) {
          return respuesta;
        } else {
          throw new Error('Respuesta no válida');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener contactos:', error);
        return throwError(() => new Error('Error al obtener contactos'));
      })
    );
  }

  public getLeads(
    nombre: string,
    numeroPagina: number, 
    totalPagina: number,
  ): Observable<IRespuestaHttpEstandar<Lead[]>> {
    const params = new HttpParams()
      .set('name', nombre)
      .set('numeroPagina', numeroPagina.toString())
      .set('totalPagina', totalPagina.toString());

    return this.httpClient.get<IRespuestaHttpEstandar<Lead[]>>(`${environment.apiBaseUrl}/person/leads`, { params }).pipe(
      map((respuesta: IRespuestaHttpEstandar<Lead[]>) => {
        if (respuesta.status === 200) {
          return respuesta;
        } else {
          throw new Error('Respuesta no válida');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener leads:', error);
        return throwError(() => new Error('Error al obtener leads'));
      })
    );
  }

  public getOneLead(id: number): Observable<IRespuestaHttpEstandar<Lead>> {
    return this.httpClient.get<IRespuestaHttpEstandar<Lead>>(`${environment.apiBaseUrl}/person/leads/${id}`);
  }

  public create(
    name: string,
    position: string,
    email: string,
    mobile: string,
    accountId: number,
    personType: string,
    salesAgentId: number,
    customAttributes: CustomAttribute[],
  ): Observable<Person> {
    const body = {
      name,
      position,
      email,
      mobile,
      accountId,
      personType,
      salesAgentId,
      customAttributes
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    console.log('Params:', body); 

    return this.httpClient.post<IRespuestaHttpEstandar<Person>>(`${environment.apiBaseUrl}/person`, body, { headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<Person>) => {
        if (resultado.status === 201 && resultado.data) {
          return resultado.data;
        } else {
          throw new Error('Error en la creación del contacto');
        }
      }),
      catchError((error) => {
        console.error('Error al crear el contacto:', error);
        return throwError(() => new Error('Error al crear el contacto'));
      }),
    );
  }

  public delete(personId: number): Observable<number> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient
      .delete<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/person/${personId}`, { headers: headers })
      .pipe(
        map((resultado: IRespuestaHttpEstandar<number>) => {
          if (resultado.status === 200 && resultado.data) {
            return resultado.data;
          }
          else {
            throw new Error('Error en la eliminación del contacto ');
          }
        }),
        catchError((error) => {
          console.error('Error al eliminar el contacto :', error);
          return throwError(() => new Error('Error al eliminar el contacto'));
        }),
      );
  }
}
