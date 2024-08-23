import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { AccountsService } from '../../../../core/services/accounts.service';
import { Account } from '../../../../core/models/account.models';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SectorsService } from '../../../../core/services/sectors.service';
import { Sector } from '../../../../core/models/sector.models';
import { MatSelectModule } from '@angular/material/select';
import { AccountsAddComponent, InformacionVentanaCuentas } from '../accounts-add/accounts-add.component';
import { DeleteWindowComponent } from '../../../../shared/components/delete-window/delete-window.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, MatMenuModule, MatFormFieldModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, CommonModule, MatButtonModule],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.scss'
})
export class AccountsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource = new AccountsDataSource(this.accountsService);
  public displayedColumns = ['document','companyName','tradeName','sectorName','options'];
  public cuentas: Account[] = [];
  public sectors: Sector[] = [];
  public cargando$ = new BehaviorSubject<boolean>(false);
  public filterForm = new FormGroup({
    document: new FormControl(''),
    companyName: new FormControl(''),
    sector: new FormControl(null)
  });
  private schema: string = '';

  constructor(
    private readonly accountsService: AccountsService, 
    private readonly sectorsService: SectorsService,
    private readonly matDialog: MatDialog,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.inicializarSchema();
    this.cargarInformacion();
    this.listarSectores();
  }

  ngAfterViewInit() {
    merge(
      this.filterForm.valueChanges,
      this.paginator.page
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.cargarInformacion();
      })
    ).subscribe();
  }

  private cargarInformacion() {
    const { document, companyName, sector } = this.filterForm.value;
    this.dataSource.listarCuentas(
      document || '',
      companyName || '',
      sector || null,
      this.paginator?.pageIndex + 1 || 1,
      this.paginator?.pageSize || 20,
      this.schema
    );
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  private listarSectores() {
    this.sectorsService.getSectors('', 1, 100, this.schema).subscribe(response => {
      if (response.status === 200) {
        this.sectors = response.data;
      }
    });
  }

  public agregar() {
    const informacion: InformacionVentanaCuentas = {
      tipo_vista: 'crear',
    }
    const ventana = this.matDialog.open(AccountsAddComponent, {
      maxHeight: '90vh',
      width: '900px',
      data:informacion,
      disableClose: true,
    });

    ventana.afterClosed().subscribe((response) => {
      if (response === true) {
        this.notificationService.Snack('Se creó la cuenta  satisfactoriamente', 'Entendido');
        this.cargarInformacion();
      } else if (response === false) {
        this.notificationService.Snack('Ocurrió un error al crear la cuenta', 'Entendido');
      }
    });
  }

  public editar(account: Account) {
    const informacion: InformacionVentanaCuentas = {
      tipo_vista: 'editar',
      account,
    }
    const Ventana = this.matDialog.open(AccountsAddComponent, {
      width: '900px',
      data: informacion,
      disableClose: true,
    });

    Ventana.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.notificationService.Snack('Se actualizó al contacto con éxito', '');
        this.cargarInformacion();
      }
      if (res === false) {
        this.notificationService.Snack('Ocurrió un error al actualizar al contacto', '');
      }
    });
  }


  public eliminar(account: Account) {
    const ventana = this.matDialog.open(DeleteWindowComponent, {
      width: '600px',
      data: { object: 'la cuenta', value: account.companyName },
      disableClose: true,
    });

    ventana.afterClosed().subscribe((response) => {
      if (response === true) {
        this.cargando$.next(true);
        this.accountsService
          .delete(account.id, this.schema)
          .pipe(
            finalize(() => {
              this.cargando$.next(false);
            }),
          )
          .subscribe({
            next: (resultado) => {
              if (resultado > 0) {
                this.notificationService.Snack('Se eliminó la cuenta satisfactoriamente', '');
                this.cargarInformacion();
              } else {
                this.notificationService.Snack('Ocurrió un error al eliminar la cuenta', '');
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

export class AccountsDataSource implements DataSource<Account> {
  private informacionUsuarios$ = new BehaviorSubject<Account[]>([]);
  public cargandoInformacion$ = new BehaviorSubject<boolean>(false);
  public cargando$ = this.cargandoInformacion$.asObservable();
  public totalResultados$ = new BehaviorSubject<number>(0);

  constructor(private readonly accountsService: AccountsService) {}

  connect(): Observable<Account[]> {
    return this.informacionUsuarios$.asObservable();
  }

  disconnect() {
    this.informacionUsuarios$.complete();
    this.cargandoInformacion$.complete();
  }

  listarCuentas(document: string, companyName: string, sector: number | null, numeroPagina: number, totalPagina: number, schema: string) {
    this.cargandoInformacion$.next(true);
    this.accountsService
      .getAccounts(document, companyName, sector, numeroPagina, totalPagina, schema)
      .pipe(
        finalize(() => {
          this.cargandoInformacion$.next(false);
        }),
      )
      .subscribe((response: IRespuestaHttpEstandar<Account[]>) => {
        this.informacionUsuarios$.next(response.data);
      });
  }
}
