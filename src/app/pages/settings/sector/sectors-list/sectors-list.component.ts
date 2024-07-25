import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SectorsService } from '../../../../core/services/sectors.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule} from '@angular/material/table';
import { Sector } from '../../../../core/models/sector.models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, finalize, merge, tap } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { IRespuestaHttpEstandar } from '../../../../core/models/http.models';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SectorsAddComponent } from '../sectors-add/sectors-add.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { DeleteWindowComponent } from '../../../../shared/components/delete-window/delete-window.component';

@Component({
  selector: 'app-sectors',
  standalone: true,
  imports: [MatMenuModule, ReactiveFormsModule, MatInputModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, CommonModule, MatButtonModule],
  templateUrl: './sectors-list.component.html',
  styleUrl: './sectors-list.component.scss'
})
export class SectorsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource = new SectorsDataSource(this.sectorsService);
  public displayedColumns = ['name','options'];
  public sectores: Sector[] = [];
  public cargando$ = new BehaviorSubject<boolean>(false);
  public formControl = new FormControl('');

  constructor(
    private sectorsService: SectorsService,
    private readonly matDialog: MatDialog,
    private readonly notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
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
    this.dataSource.listarSectores(
      this.formControl.value!,
      this.paginator?.pageIndex + 1 || 1, 
      this.paginator?.pageSize || 20,
    );
  }

  public agregar() {
    const ventana = this.matDialog.open(SectorsAddComponent, {
      maxHeight: '90vh',
      width: '600px',
    });

    ventana.afterClosed().subscribe((response) => {
      if (response === true) {
        this.notificationService.Snack('Se creó el sector satisfactoriamente', 'Entendido');
        this.cargarInformacion();
      } else if (response === false) {
        this.notificationService.Snack('Ocurrió un error al crear el sector', 'Entendido');
      }
    });
  }

  public eliminar(sector: Sector) {
    const ventana = this.matDialog.open(DeleteWindowComponent, {
      width: '600px',
      data: { object: 'el sector', value: sector.name },
    });

    ventana.afterClosed().subscribe((response) => {
      if (response === true) {
        this.cargando$.next(true);
        this.sectorsService
          .delete(sector.id)
          .pipe(
            finalize(() => {
              this.cargando$.next(false);
            }),
          )
          .subscribe({
            next: (resultado) => {
              if (resultado > 0) {
                this.notificationService.Snack('Se eliminó el sector satisfactoriamente', '');
                this.cargarInformacion();
              } else {
                this.notificationService.Snack('Ocurrió un error al eliminar el sector', '');
              }
            },
            error: () => {
              this.notificationService.Snack('Ocurrió un error al eliminar el sector', '');
            }
          });
      }
    });
  }
}

export class SectorsDataSource implements DataSource<Sector> {
  private informacionUsuarios$ = new BehaviorSubject<Sector[]>([]);
  public cargandoInformacion$ = new BehaviorSubject<boolean>(false);
  public cargando$ = this.cargandoInformacion$.asObservable();
  public totalResultados$ = new BehaviorSubject<number>(0);

  constructor(private readonly sectorsService: SectorsService) {}

  connect(): Observable<Sector[]> {
    return this.informacionUsuarios$.asObservable();
  }

  disconnect() {
    this.informacionUsuarios$.complete();
    this.cargandoInformacion$.complete();
  }

  listarSectores(nombre: string, numeroPagina: number, totalPagina: number) {
    this.cargandoInformacion$.next(true);
    this.sectorsService
      .getSectors(nombre, numeroPagina, totalPagina)
      .pipe(
        finalize(() => {
          this.cargandoInformacion$.next(false);
        }),
      )
      .subscribe((response: IRespuestaHttpEstandar<Sector[]>) => {
        this.informacionUsuarios$.next(response.data);
      });
  }
}

