import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Contact } from '../../../../core/models/person.models';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, finalize, merge, tap } from 'rxjs';
import { PersonService } from '../../../../core/services/person.service';
import { DataSource } from '@angular/cdk/collections';
import { IRespuestaHttpEstandar } from '../../../../core/models/http.models';
import { FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactsAddComponent } from '../contacts-add/contacts-add.component';
import { DeleteWindowComponent } from '../../../../shared/components/delete-window/delete-window.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatMenuModule, MatFormFieldModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, CommonModule, MatButtonModule],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'
})
export class ContactsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource = new ContactsDataSource(this.personService);
  public displayedColumns = ['name','position','area','management', 'accountName', 'email', 'mobile', 'salesAgentName', 'options'];
  public contactos: Contact[] = [];
  public cargando$ = new BehaviorSubject<boolean>(false);
  public formControl = new FormControl('');
  private schema: string = '';

  constructor(
    private readonly personService: PersonService,
    private readonly matDialog: MatDialog,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.inicializarSchema();
    this.cargarInformacion();
  }

  ngAfterViewInit() {
    merge(this.formControl.valueChanges)
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.cargarInformacion();
        }),
      )
      .subscribe();
    
      this.paginator.page
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => {
          this.cargarInformacion();
        }),
      )
      .subscribe();
  }

  private cargarInformacion() {
    this.dataSource.listarContactos(
      this.formControl.value!,
      this.paginator?.pageIndex + 1 || 1, 
      this.paginator?.pageSize || 20,
      this.schema
    );
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  public agregar() {
    const ventana = this.matDialog.open(ContactsAddComponent, {
      maxHeight: '90vh',
      width: '900px',
    });

    ventana.afterClosed().subscribe((response) => {
      if (response === true) {
        this.notificationService.Snack('Se creó el contacto satisfactoriamente', 'Entendido');
        this.cargarInformacion();
      } else if (response === false) {
        this.notificationService.Snack('Ocurrió un error al crear el contacto', 'Entendido');
      }
    });
  }

  public eliminar(contact: Contact) {
    const ventana = this.matDialog.open(DeleteWindowComponent, {
      width: '600px',
      data: { object: 'el contacto', value: contact.name },
    });

    ventana.afterClosed().subscribe((response) => {
      if (response === true) {
        this.cargando$.next(true);
        this.personService
          .delete(contact.id, this.schema)
          .pipe(
            finalize(() => {
              this.cargando$.next(false);
            }),
          )
          .subscribe({
            next: (resultado) => {
              if (resultado > 0) {
                this.notificationService.Snack('Se eliminó el contacto satisfactoriamente', '');
                this.cargarInformacion();
              } else {
                this.notificationService.Snack('Ocurrió un error al eliminar el contacto', '');
              }
            },
            error: () => {
              this.notificationService.Snack('Ocurrió un error al eliminar el contacto', '');
            }
          });
      }
    });
  }
}

export class ContactsDataSource implements DataSource<Contact> {
  private informacionUsuarios$ = new BehaviorSubject<Contact[]>([]);
  public cargandoInformacion$ = new BehaviorSubject<boolean>(false);
  public cargando$ = this.cargandoInformacion$.asObservable();
  public totalResultados$ = new BehaviorSubject<number>(0);

  constructor(private readonly personService: PersonService) {}

  connect(): Observable<Contact[]> {
    return this.informacionUsuarios$.asObservable();
  }

  disconnect() {
    this.informacionUsuarios$.complete();
    this.cargandoInformacion$.complete();
  }

  listarContactos(nombre: string, numeroPagina: number, totalPagina: number, schema: string) {
    this.cargandoInformacion$.next(true);
    this.personService
      .getContacts(nombre, numeroPagina, totalPagina, schema)
      .pipe(
        finalize(() => {
          this.cargandoInformacion$.next(false);
        }),
      )
      .subscribe((response: IRespuestaHttpEstandar<Contact[]>) => {
        this.informacionUsuarios$.next(response.data);
      });
  }
}