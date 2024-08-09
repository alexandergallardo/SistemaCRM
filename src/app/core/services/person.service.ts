import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRespuestaHttpEstandar } from '../models/http.models';
import { Contact, CustomAttribute, Lead, Person } from '../models/person.models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private readonly httpClient: HttpClient) { }

  public getContacts(
    nombre: string,
    numeroPagina: number,
    totalPagina: number,
    schema: string,
  ): Observable<IRespuestaHttpEstandar<Contact[]>> {
    const params = {
      name: nombre,
      numeroPagina: numeroPagina.toString(),
      totalPagina: totalPagina.toString(),
      schema: schema,
    };

    return this.httpClient.get<IRespuestaHttpEstandar<Contact[]>>(`${environment.apiBaseUrl}/sales/person/contacts`, { params }).pipe(
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

  public getContactsByAccount(
    accountId: number,
    totalPagina: number,
    schema: string,
  ): Observable<IRespuestaHttpEstandar<Contact[]>> {
    const params = {
      accountId: accountId.toString(),
      totalPagina: totalPagina.toString(),
      schema: schema,
    };

    return this.httpClient.get<IRespuestaHttpEstandar<Contact[]>>(`${environment.apiBaseUrl}/sales/person/contacts-by-account`, { params }).pipe(
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
    schema: string,
  ): Observable<IRespuestaHttpEstandar<Lead[]>> {
    const params = {
      name: nombre,
      numeroPagina: numeroPagina.toString(),
      totalPagina: totalPagina.toString(),
      schema: schema,
    };

    return this.httpClient.get<IRespuestaHttpEstandar<Lead[]>>(`${environment.apiBaseUrl}/sales/person/leads`, { params }).pipe(
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

  public getOneLead(id: number, schema: string): Observable<IRespuestaHttpEstandar<Lead>> {
    const params = { schema };
    return this.httpClient.get<IRespuestaHttpEstandar<Lead>>(`${environment.apiBaseUrl}/sales/person/leads/${id}`, { params });
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
    schema: string,
  ): Observable<Person> {
    const body = {
      name,
      position,
      email,
      mobile,
      accountId,
      personType,
      salesAgentId,
      customAttributes,
      schema,
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    console.log('Params:', body); 

    return this.httpClient.post<IRespuestaHttpEstandar<Person>>(`${environment.apiBaseUrl}/sales/person`, body, { headers }).pipe(
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
  
  public update(
    id: number,
    name: string,
    position: string,
    email: string,
    mobile: string,
    accountId: number,
    personType: string,
    salesAgentId: number,
    customAttributes: CustomAttribute[],
    schema: string,
  ): Observable<number> {
    const body = {
      name,
      position,
      email,
      mobile,
      accountId,
      personType,
      salesAgentId,
      customAttributes,
      schema,
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.put<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/sales/person/${id}`, body, { headers }).pipe(
      map((resultado: IRespuestaHttpEstandar<number>) => {
        if (resultado.status === 200) {
          return resultado.data;
        } else {
          throw new Error('Error en la actualización del contacto');
        }
      }),
      catchError((error) => {
        console.error('Error al actualizar el contacto:', error);
        return throwError(() => new Error('Error al actualizar el contacto'));
      }),
    );
  }

  public delete(personId: number, schema: string): Observable<number> {
    const params = { schema };
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient
      .delete<IRespuestaHttpEstandar<number>>(`${environment.apiBaseUrl}/sales/person/${personId}`, { params, headers })
      .pipe(
        map((resultado: IRespuestaHttpEstandar<number>) => {
          if (resultado.status === 200 && resultado.data) {
            return resultado.data;
          }
          else {
            throw new Error('Error en la eliminación del contacto');
          }
        }),
        catchError((error) => {
          console.error('Error al eliminar el contacto:', error);
          return throwError(() => new Error('Error al eliminar el contacto'));
        }),
      );
  }

  public getAttributeIds(schema: string): Observable<{ [key: string]: number }> {
    return this.httpClient
      .get<{ [key: string]: number }>(`${environment.apiBaseUrl}/sales/attribute/${schema}`)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener los IDs de los atributos:', error);
          return throwError(() => new Error('Error al obtener los IDs de los atributos'));
        }),
      );
  }
}
