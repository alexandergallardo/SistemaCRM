import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, finalize, merge, tap } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { IRespuestaHttpEstandar } from '../../../../core/models/http.models';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ServicesService } from '../../../../core/services/services.service';
import { Service } from '../../../../core/models/service.models';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InformacionVentanaServicios, ServicesAddComponent } from '../services-add/services-add.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';
import { DeleteWindowComponent } from '../../../../shared/components/delete-window/delete-window.component';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatMenuModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, CommonModule, MatButtonModule],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource = new ServicesDataSource(this.servicesService);
  public displayedColumns = ['code','name','measurement_unit','options'];
  public servicios: Service[] = [];
  public cargando$ = new BehaviorSubject<boolean>(false);
  public formControl = new FormControl('');
  private schema: string = '';

  constructor(
    private servicesService: ServicesService,
    private readonly notificationService: NotificationService,
    private readonly matDialog: MatDialog,
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
    this.dataSource.listarServicios(
      this.formControl.value!,
      this.paginator?.pageIndex + 1 || 1, 
      this.paginator?.pageSize || 20,
      this.schema
    );
    this.dataSource.connect().subscribe(services => {
      this.servicios = services;
    });
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  public agregar() {
    this.cargarInformacion();

    setTimeout(() => {
      const maxCode = this.servicios.length > 0
        ? Math.max(...this.servicios.map(service => parseInt(service.code.replace('SVC', ''), 10)))
        : 0;

      const ventana = this.matDialog.open(ServicesAddComponent, {
        maxHeight: '90vh',
        width: '600px',
        data: { maxCode, tipo_vista: 'crear' },
        disableClose: true,
      });

      ventana.afterClosed().subscribe((response) => {
        if (response === true) {
          this.notificationService.Snack('Se creó el servicio satisfactoriamente', 'Entendido');
          this.cargarInformacion();
        } else if (response === false) {
          this.notificationService.Snack('Ocurrió un error al crear el servicio', 'Entendido');
        }
      });
    }, 500);
  }

  public editar(service: Service) {
    const informacion: InformacionVentanaServicios = {
      tipo_vista: 'editar',
      service,
    }
    const Ventana = this.matDialog.open(ServicesAddComponent, {
      width: '900px',
      data: informacion,
      disableClose: true,
    });

    Ventana.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.notificationService.Snack('Se actualizó al servicio con éxito', '');
        this.cargarInformacion();
      }
      if (res === false) {
        this.notificationService.Snack('Ocurrió un error al actualizar al servicio', '');
      }
    });
  }

  public eliminar(service: Service) {
    const ventana = this.matDialog.open(DeleteWindowComponent, {
      width: '600px',
      data: { object: 'el servicio', value: service.name },
      disableClose: true,
    });

    ventana.afterClosed().subscribe((response) => {
      if (response === true) {
        this.cargando$.next(true);
        this.servicesService
          .delete(service.id, this.schema)
          .pipe(
            finalize(() => {
              this.cargando$.next(false);
            }),
          )
          .subscribe({
            next: (resultado) => {
              if (resultado > 0) {
                this.notificationService.Snack('Se eliminó el servicio satisfactoriamente', '');
                this.cargarInformacion();
              } else {
                this.notificationService.Snack('Ocurrió un error al eliminar el servicio', '');
              }
            },
            error: () => {
              this.notificationService.Snack('Ocurrió un error al eliminar el servicio', '');
            }
          });
      }
    });
  }


}

export class ServicesDataSource implements DataSource<Service> {
  private informacionUsuarios$ = new BehaviorSubject<Service[]>([]);
  public cargandoInformacion$ = new BehaviorSubject<boolean>(false);
  public cargando$ = this.cargandoInformacion$.asObservable();
  public totalResultados$ = new BehaviorSubject<number>(0);

  constructor(private readonly servicesService: ServicesService) {}

  connect(): Observable<Service[]> {
    return this.informacionUsuarios$.asObservable();
  }

  disconnect() {
    this.informacionUsuarios$.complete();
    this.cargandoInformacion$.complete();
  }

  listarServicios(nombre: string, numeroPagina: number, totalPagina: number, schema: string) {
    this.cargandoInformacion$.next(true);
    this.servicesService
      .getServices(nombre, numeroPagina, totalPagina, schema)
      .pipe(
        finalize(() => {
          this.cargandoInformacion$.next(false);
        }),
      )
      .subscribe((response: IRespuestaHttpEstandar<Service[]>) => {
        this.informacionUsuarios$.next(response.data);
      });
  }
}

