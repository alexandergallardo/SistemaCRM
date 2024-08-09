import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AccountsService } from '../../../../core/services/accounts.service';
import { MatSelectModule } from '@angular/material/select';
import { CustomAttribute, Lead } from '../../../../core/models/person.models';
import { PersonService } from '../../../../core/services/person.service';
import { Account } from '../../../../core/models/account.models';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AuthService } from '../../../../core/services/auth.service';
import { EstadoGlobal, obtenerUsuario } from '../../../../core/reducers/estado-global.reducer';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-leads-add',
  standalone: true,
  imports: [MatInputModule, MatAutocompleteModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule],
  templateUrl: './leads-add.component.html',
  styleUrl: './leads-add.component.scss'
})
export class LeadsAddComponent implements AfterViewInit, OnInit {
  public cargando$ = new BehaviorSubject<boolean>(false);
  public leadForm = this.crearFormulario();
  public leads: Array<Lead> = [];
  public accounts: Array<Account> = [];
  private schema: string = '';
  private attributeIds: { [key: string]: number } = {};

  constructor(
    private readonly personService: PersonService,
    private readonly accountsService: AccountsService,
    private readonly matDialogRef: MatDialogRef<LeadsAddComponent>,
    private readonly authService: AuthService,
    private store: Store<EstadoGlobal>
  ) {}

  ngOnInit() {
    this.inicializarSchema();
    this.listarClientes();
    this.cargarAttributeIds();
    this.obtenerUsuario();
  }

  ngAfterViewInit() {
    this.leadForm
      .get('accountName')!
      .valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => {
          this.listarCliente(this.leadForm.get('accountName')!.value!.toUpperCase());
        }),
      )
      .subscribe();
  }

  private obtenerUsuario() {
    this.store.select(obtenerUsuario).subscribe((usuario) => {
      if (usuario) {
        console.log(usuario.id);
        this.leadForm.patchValue({
          salesAgentId: usuario.id
        });
      }
    });
  }
  
  private crearFormulario() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      email: new FormControl('', []),
      mobile: new FormControl(null, [Validators.required]),
      accountId: new FormControl<number | null>(null, []),
      personType: new FormControl('lead', [Validators.required]),
      salesAgentId: new FormControl<number | null>(null, [Validators.required]),
      accountName: new FormControl('', []),
      leadStatus: new FormControl('', []),
      leadSource: new FormControl('', []),
      leadRating: new FormControl('', []),
    });
  }

  private cargarAttributeIds() {
    this.personService.getAttributeIds(this.schema).subscribe({
        next: (ids) => {
            this.attributeIds = ids;
            console.log('Attribute IDs: ', this.attributeIds);
        },
        error: (error) => {
            console.error('Error al cargar IDs de atributos: ', error);
        }
    });
}

  public listarCliente(nombre: string) {
    this.accountsService.getAccounts('', nombre, null, 1, 5, this.schema).subscribe((res) => {
      this.accounts = res.data;
    });
  }

  public clienteSeleccionado(account: Account) {
    this.leadForm.get('accountId')!.setValue(account.id);
    this.leadForm.get('accountName')!.setValue(account.companyName);
  }

  public removerCliente() {
    this.leadForm.get('accountId')!.setValue(null);
    this.leadForm.get('accountName')!.setValue('');
    this.listarCliente('');
  }

  public guardar() {
    if (this.leadForm.valid) {
      this.cargando$.next(true);

      if (!this.attributeIds || Object.keys(this.attributeIds).length === 0) {
        console.error('No se han asignado IDs de atributos. Revisa la carga de IDs.');
        return;
      }

      const customAttributes: CustomAttribute[] = [
        { attributeId: this.attributeIds['Estado del lead'], value: this.leadForm.value.leadStatus as string },
        { attributeId: this.attributeIds['Fuente del lead'], value: this.leadForm.value.leadSource as string },
        { attributeId: this.attributeIds['Valoracion del lead'], value: this.leadForm.value.leadRating as string },
      ].filter(attr => attr.value !== null && attr.value !== undefined && attr.value !== '') as CustomAttribute[];


      if (customAttributes.length === 0) {
        console.error('No se han asignado valores válidos para los atributos.');
        return;
      }

      this.personService
        .create(
          this.leadForm.value.name!,
          this.leadForm.value.position!,
          this.leadForm.value.email!,
          this.leadForm.value.mobile!,
          this.leadForm.value.accountId!,
          this.leadForm.value.personType!,
          this.leadForm.value.salesAgentId!,
          customAttributes as CustomAttribute[],
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
            console.error('Error al guardar lead:', error);
            this.matDialogRef.close(false);
          }
        });
    }
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
  }
    
  private listarClientes() {
    this.accountsService.getAccounts('','',null,1,5, this.schema).subscribe((resultado) => {
      this.accounts = resultado.data;
    });
  }
      
  public cerrarVentana() {
    this.matDialogRef.close();
  }
}
