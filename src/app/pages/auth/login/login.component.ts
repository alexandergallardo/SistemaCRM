import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatIconModule, MatProgressSpinnerModule, MatGridListModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public hide = true;
  public loginForm = this.crearFormulario();

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  private crearFormulario() {
    return new FormGroup({
      schema: new FormControl('', []),
      email: new FormControl('', []),
      password: new FormControl('', []),
    })
  }

  public login() {
    if (this.loginForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    this.authService.login(
      this.loginForm.value.schema!, 
      this.loginForm.value.email!, 
      this.loginForm.value.password!,
    ).subscribe((response) => {
      if (response) {
        localStorage.setItem('schema', response.schema);
        this.router.navigate(['/sales/accounts']);
      } else {
        alert('Login failed');
      }
    });
  }
}
