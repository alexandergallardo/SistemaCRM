import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Lead } from '../../../../core/models/person.models';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, finalize, merge, tap } from 'rxjs';
import { PersonService } from '../../../../core/services/person.service';
import { IRespuestaHttpEstandar } from '../../../../core/models/http.models';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsAddComponent } from '../leads-add/leads-add.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-leads-list',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatMenuModule, MatFormFieldModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, CommonModule, MatButtonModule],
  templateUrl: './leads-list.component.html',
  styleUrl: './leads-list.component.scss'
})
export class LeadsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource = new LeadsDataSource(this.personService);
  public displayedColumns = ['accountName','name','mobile','email', 'salesAgentName', 'createdAt', 'options'];
  public leads: Lead[] = [];
  public cargando$ = new BehaviorSubject<boolean>(false);
  public formControl = new FormControl('');
  private schema: string = '';

  constructor(
    private readonly personService: PersonService,
    private readonly activatedReoute: ActivatedRoute,
    private readonly router: Router,
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
    this.dataSource.listarLeads(
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
    const ventana = this.matDialog.open(LeadsAddComponent, {
      maxHeight: '90vh',
      width: '900px',
    });

    ventana.afterClosed().subscribe((response) => {
      if (response === true) {
        this.notificationService.Snack('Se creó el lead satisfactoriamente', 'Entendido');
        this.cargarInformacion();
      } else if (response === false) {
        this.notificationService.Snack('Ocurrió un error al crear el lead', 'Entendido');
      }
    });
  }
  
  public getDetails(leadId: string) {
    this.router.navigate([leadId], { relativeTo: this.activatedReoute });
  }
}

export class LeadsDataSource implements DataSource<Lead> {
  private informacionUsuarios$ = new BehaviorSubject<Lead[]>([]);
  public cargandoInformacion$ = new BehaviorSubject<boolean>(false);
  public cargando$ = this.cargandoInformacion$.asObservable();
  public totalResultados$ = new BehaviorSubject<number>(0);

  constructor(private readonly personService: PersonService) {}

  connect(): Observable<Lead[]> {
    return this.informacionUsuarios$.asObservable();
  }

  disconnect() {
    this.informacionUsuarios$.complete();
    this.cargandoInformacion$.complete();
  }

  listarLeads(nombre: string, numeroPagina: number, totalPagina: number, schema: string) {
    this.cargandoInformacion$.next(true);
    this.personService
      .getLeads(nombre, numeroPagina, totalPagina, schema)
      .pipe(
        finalize(() => {
          this.cargandoInformacion$.next(false);
        }),
      )
      .subscribe((response: IRespuestaHttpEstandar<Lead[]>) => {
        this.informacionUsuarios$.next(response.data);
      });
  }
}