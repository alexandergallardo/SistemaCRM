import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { ValidadorUrl } from '../../../../shared/validators/url.validator';
import { Contact, CustomAttribute } from '../../../../core/models/person.models';
import { PersonService } from '../../../../core/services/person.service';
import { Account } from '../../../../core/models/account.models';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AuthService } from '../../../../core/services/auth.service';
import { EstadoGlobal, obtenerUsuario } from '../../../../core/reducers/estado-global.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-contacts-add',
  standalone: true,
  imports: [MatInputModule, MatAutocompleteModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule],
  templateUrl: './contacts-add.component.html',
  styleUrl: './contacts-add.component.scss'
})
export class ContactsAddComponent implements OnInit, AfterViewInit {
  public cargando$ = new BehaviorSubject<boolean>(false);
  public contactForm = this.crearFormulario();
  public contacts: Array<Contact> = [];
  public accounts: Array<Account> = [];
  private schema: string = '';
  private attributeIds: { [key: string]: number } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InformacionVentanaContactos,
    private readonly personService: PersonService,
    private readonly accountsService: AccountsService,
    private readonly matDialogRef: MatDialogRef<ContactsAddComponent>,
    private readonly authService: AuthService,
    private store: Store<EstadoGlobal>
  ) {}

  ngOnInit() {
    this.inicializarSchema();
    this.listarClientes();
    this.cargarAttributeIds();
    this.obtenerUsuario();
    if (this.data.tipo_vista === 'editar') {
      this.asignarInformacion(this.data.contact!);
    }
  }

  ngAfterViewInit() {
    this.contactForm
      .get('accountName')!
      .valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => {
          this.listarCliente(this.contactForm.get('accountName')!.value!.toUpperCase());
        }),
      )
      .subscribe();
  }

  private inicializarSchema() {
    this.schema = this.authService.getSchema() || '';
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

  private obtenerUsuario() {
    this.store.select(obtenerUsuario).subscribe((usuario) => {
      if (usuario) {
        console.log(usuario.id);
        this.contactForm.patchValue({
          salesAgentId: usuario.id
        });
      }
    });
  }

  private crearFormulario() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      accountId: new FormControl<number | null>(null, []),
      personType: new FormControl('contacto', [Validators.required]),
      salesAgentId: new FormControl<number | null>(null, [Validators.required]),
      linkedin: new FormControl('', [ValidadorUrl]),
      facebook: new FormControl('', [ValidadorUrl]),
      instagram: new FormControl('', [ValidadorUrl]),
      esPrincipal: new FormControl(false, []),
      tipoDecisor: new FormControl('', []),
      area: new FormControl('', []),
      gerencia: new FormControl('', []),
      accountName: new FormControl('', []),
    });
  }

  private asignarInformacion(informacion: Contact) {
    this.contactForm.get('name')?.setValue(informacion.name);
    this.contactForm.get('position')?.setValue(informacion.position);
    this.contactForm.get('area')?.setValue(informacion.area);
    this.contactForm.get('gerencia')?.setValue(informacion.management);
    this.contactForm.get('tipoDecisor')?.setValue(informacion.decisionMakingType);
    this.contactForm.get('accountId')?.setValue(informacion.accountId);
    this.contactForm.get('accountName')?.setValue(informacion.accountName);
    this.contactForm.get('mobile')?.setValue(informacion.mobile);
    this.contactForm.get('email')?.setValue(informacion.email);
    this.contactForm.get('linkedin')?.setValue(informacion.linkedin);
    this.contactForm.get('facebook')?.setValue(informacion.facebook);
    this.contactForm.get('instagram')?.setValue(informacion.instagram);
  }

  public listarCliente(nombre: string) {
    this.accountsService.getAccounts('', nombre, null, 1, 5, this.schema).subscribe((res) => {
      this.accounts = res.data;
    });
  }

  public clienteSeleccionado(account: Account) {
    this.contactForm.get('accountId')!.setValue(account.id);
    this.contactForm.get('accountName')!.setValue(account.companyName);
  }

  public removerCliente() {
    this.contactForm.get('accountId')!.setValue(null);
    this.contactForm.get('accountName')!.setValue('');
    this.listarCliente('');
  }

  private crear() {
    if (this.contactForm.valid) {
      this.cargando$.next(true);

      if (!this.attributeIds || Object.keys(this.attributeIds).length === 0) {
        console.error('No se han asignado IDs de atributos. Revisa la carga de IDs.');
        return;
      }

      const customAttributes: CustomAttribute[] = [
        { attributeId: this.attributeIds['Linkedin'], value: this.contactForm.value.linkedin as string },
        { attributeId: this.attributeIds['Facebook'], value: this.contactForm.value.facebook as string },
        { attributeId: this.attributeIds['Instagram'], value: this.contactForm.value.instagram as string },
        { attributeId: this.attributeIds['Es principal'], value: this.contactForm.value.esPrincipal ? 'true' : 'false' },
        { attributeId: this.attributeIds['Tipo de decisor'], value: this.contactForm.value.tipoDecisor as string },
        { attributeId: this.attributeIds['Area'], value: this.contactForm.value.area?.toUpperCase() as string },
        { attributeId: this.attributeIds['Gerencia'], value: this.contactForm.value.gerencia?.toUpperCase() as string }
      ].filter(attr => attr.value !== null && attr.value !== undefined && attr.value !== '') as CustomAttribute[];

      if (customAttributes.length === 0) {
        console.error('No se han asignado valores válidos para los atributos.');
        return;
      }

      this.personService
        .create(
          this.contactForm.value.name!.toUpperCase(),
          this.contactForm.value.position!.toUpperCase(),
          this.contactForm.value.email!,
          this.contactForm.value.mobile!,
          this.contactForm.value.accountId!,
          this.contactForm.value.personType!,
          this.contactForm.value.salesAgentId!,
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
            console.error('Error al guardar contacto:', error);
            this.matDialogRef.close(false);
          }
        });
    }
  }

  private actualizar() {
    if (this.contactForm.valid) {
      this.cargando$.next(true);

      if (!this.attributeIds || Object.keys(this.attributeIds).length === 0) {
        console.error('No se han asignado IDs de atributos. Revisa la carga de IDs.');
        return;
      }

      const customAttributes: CustomAttribute[] = [
        { attributeId: this.attributeIds['Linkedin'], value: this.contactForm.value.linkedin as string },
        { attributeId: this.attributeIds['Facebook'], value: this.contactForm.value.facebook as string },
        { attributeId: this.attributeIds['Instagram'], value: this.contactForm.value.instagram as string },
        { attributeId: this.attributeIds['Es principal'], value: this.contactForm.value.esPrincipal ? 'true' : 'false' },
        { attributeId: this.attributeIds['Tipo de decisor'], value: this.contactForm.value.tipoDecisor as string },
        { attributeId: this.attributeIds['Area'], value: this.contactForm.value.area?.toUpperCase() as string },
        { attributeId: this.attributeIds['Gerencia'], value: this.contactForm.value.gerencia?.toUpperCase() as string }
      ].filter(attr => attr.value !== null && attr.value !== undefined && attr.value !== '') as CustomAttribute[];

      if (customAttributes.length === 0) {
        console.error('No se han asignado valores válidos para los atributos.');
        return;
      }

      this.personService
        .update(
          this.data.contact!.id,
          this.contactForm.value.name!.toUpperCase(),
          this.contactForm.value.position!.toUpperCase(),
          this.contactForm.value.email!,
          this.contactForm.value.mobile!,
          this.contactForm.value.accountId!,
          this.contactForm.value.personType!,
          this.contactForm.value.salesAgentId!,
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
            console.error('Error al guardar contacto:', error);
            this.matDialogRef.close(false);
          }
        });
    }
  }

  public guardar() {
    if (this.data.tipo_vista === 'editar') {
      this.actualizar();
    } else {
      this.crear();
    }
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

export type InformacionVentanaContactos = {
  tipo_vista: 'crear' | 'editar';
  contact?: Contact;
};
