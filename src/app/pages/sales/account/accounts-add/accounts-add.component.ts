import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { BehaviorSubject, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SectorsService } from '../../../../core/services/sectors.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AccountsService } from '../../../../core/services/accounts.service';
import { Sector } from '../../../../core/models/sector.models';
import { MatSelectModule } from '@angular/material/select';
import { ValidadorUrl } from '../../../../shared/validators/url.validator';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/users.models';
import { EstadoGlobal, obtenerUsuario } from '../../../../core/reducers/estado-global.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-accounts-add',
  standalone: true,
  imports: [MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule],
  templateUrl: './accounts-add.component.html',
  styleUrl: './accounts-add.component.scss'
})
export class AccountsAddComponent implements OnInit{
  public cargando$ = new BehaviorSubject<boolean>(false);
  public accountForm = this.crearFormulario();
  public sectors: Array<Sector> = [];
  private schema: string = '';

  constructor(
    private readonly accountsService: AccountsService,
    private readonly sectorsService: SectorsService,
    private readonly matDialogRef: MatDialogRef<AccountsAddComponent>,
    private readonly authService: AuthService,
    private store: Store<EstadoGlobal>
  ) {}

  ngOnInit() {
    this.inicializarSchema();
    this.listarSectores();
    this.obtenerUsuario();
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }

  private obtenerUsuario() {
    this.store.select(obtenerUsuario).subscribe((usuario) => {
      if (usuario) {
        console.log(usuario.id);
        this.accountForm.patchValue({
          salesAgentId: usuario.id
        });
      } else {console.log('gaaa')}
    });
  }

  private crearFormulario() {
    return new FormGroup({
      document: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      businessGroup: new FormControl('', []),
      sectorId: new FormControl(null, [Validators.required]),
      numberOfEmployees: new FormControl(null, []),
      tradeName: new FormControl('', []),
      legalAddress: new FormControl('', []),
      description: new FormControl('', []),
      salesAgentId: new FormControl<number | null>(null, [Validators.required]),
      website: new FormControl('', [ValidadorUrl]),
      facebook: new FormControl('', [ValidadorUrl]),
      instagram: new FormControl('', [ValidadorUrl]),
      linkedin: new FormControl('', [ValidadorUrl]),
    });
  }

  public guardar() {
    if (this.accountForm.valid) {
    this.cargando$.next(true);

      this.accountsService
        .create(
          this.accountForm.value.document!,
          this.accountForm.value.companyName!,
          this.accountForm.value.businessGroup!,
          this.accountForm.value.sectorId!,
          this.accountForm.value.numberOfEmployees!,
          this.accountForm.value.tradeName!,
          this.accountForm.value.legalAddress!,
          this.accountForm.value.description!,
          this.accountForm.value.salesAgentId!,
          this.accountForm.value.website!,
          this.accountForm.value.facebook!,
          this.accountForm.value.instagram!,
          this.accountForm.value.linkedin!,
          this.schema
        )
        .pipe(
          finalize(() => {
            this.cargando$.next(false);
          })
        )
        .subscribe({
          next: (response) => {
            this.matDialogRef.close(true);
          },
          error: (error) => {
            console.error('Error al guardar cuenta:', error);
            this.matDialogRef.close(false);
          }
        });
    }
  }

        
  private listarSectores() {
    this.sectorsService.getSectors('',1,100, this.schema).subscribe((resultado) => {
      this.sectors = resultado.data;
    });
  }
      
  public cerrarVentana() {
    this.matDialogRef.close();
  }
}

