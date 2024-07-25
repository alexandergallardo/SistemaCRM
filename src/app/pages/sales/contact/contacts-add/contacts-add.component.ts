import { AfterViewInit, Component } from '@angular/core';
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
import { ValidadorUrl } from '../../../../shared/validators/url.validator';
import { Contact, CustomAttribute } from '../../../../core/models/person.models';
import { PersonService } from '../../../../core/services/person.service';
import { Account } from '../../../../core/models/account.models';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-contacts-add',
  standalone: true,
  imports: [MatInputModule, MatAutocompleteModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule],
  templateUrl: './contacts-add.component.html',
  styleUrl: './contacts-add.component.scss'
})
export class ContactsAddComponent implements AfterViewInit {
  public cargando$ = new BehaviorSubject<boolean>(false);
  public contactForm = this.crearFormulario();
  public contacts: Array<Contact> = [];
  public accounts: Array<Account> = [];

  constructor(
    private readonly personService: PersonService,
    private readonly accountsService: AccountsService,
    private readonly matDialogRef: MatDialogRef<ContactsAddComponent>,
  ) {}

  ngOnInit() {
    this.listarClientes();
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

  private crearFormulario() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      email: new FormControl('', []),
      mobile: new FormControl('', [Validators.required]),
      accountId: new FormControl<number | null>(null, []),
      personType: new FormControl('contacto', [Validators.required]),
      salesAgentId: new FormControl(2, [Validators.required]),
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

  public listarCliente(nombre: string) {
    this.accountsService.getAccounts('', nombre, '', 1, 5).subscribe((res) => {
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

  public guardar() {
    if (this.contactForm.valid) {
    this.cargando$.next(true);

    const customAttributes = [
      { attributeId: 19, value: this.contactForm.value.linkedin },
      { attributeId: 20, value: this.contactForm.value.facebook },
      { attributeId: 21, value: this.contactForm.value.instagram },
      { attributeId: 25, value: this.contactForm.value.esPrincipal ? 'true' : 'false'},
      { attributeId: 26, value: this.contactForm.value.tipoDecisor },
      { attributeId: 27, value: this.contactForm.value.area },
      { attributeId: 28, value: this.contactForm.value.gerencia }
    ].filter(attr => attr.value !== null && attr.value !== undefined && attr.value !== '');

    console.log('Custom Attributes:', customAttributes);

      this.personService
        .create(
          this.contactForm.value.name!,
          this.contactForm.value.position!,
          this.contactForm.value.email!,
          this.contactForm.value.mobile!,
          this.contactForm.value.accountId!,
          this.contactForm.value.personType!,
          this.contactForm.value.salesAgentId!,
          customAttributes as CustomAttribute[],
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

        
  private listarClientes() {
    this.accountsService.getAccounts('','','',1,5).subscribe((resultado) => {
      this.accounts = resultado.data;
    });
  }
      
  public cerrarVentana() {
    this.matDialogRef.close();
  }
}
