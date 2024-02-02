import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";
import {MatError, MatFormField, MatHint, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";
import {AuthService} from "../../services/AuthService";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatProgressBar,
    NgIf,
    MatInput,
    MatError,
    MatFormField,
    MatHint,
    MatLabel,
    MatButton,
    MatIcon,
    MatIconButton,
    MatSuffix,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = false;

  constructor(private formBuilder: FormBuilder, private service: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: [null, [Validators.required, Validators.maxLength(50)]]
    });

    if (this.service.isLoggedin()) {
      this.router.navigateByUrl('/users');
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    // Perform login action here
    console.log(this.loginForm.value);
    this.isLoading = true;
    this.service.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (response) => {
        console.log(response);
        this.isLoading = false;
        if (this.service.redirectUrl) {
          this.router.navigateByUrl(this.service.redirectUrl);
        } else {
          this.router.navigateByUrl('/users');
        }
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
        this.snackBar.open('Error: ' + error, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });
  }
}
