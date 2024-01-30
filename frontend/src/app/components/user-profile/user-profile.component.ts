import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from "../../services/UserService";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {User} from "../../models/user.model";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe, NgIf} from "@angular/common";
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {UserStatusComponentComponent} from "../user-status-component/user-status-component.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [
    MatListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    RouterLink,
    NgIf,
    MatCard,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    UserStatusComponentComponent,
    MatProgressSpinner,
  ],
  standalone: true
})
export class UserProfileComponent implements OnInit, AfterViewInit {

  myForm: FormGroup = new FormGroup({});
  operation!: string;
  id!: number;
  user: User = {
    id: 0,
    name: '',
    firstName: '',
    lastName: '',
    password: '',
    email: '',
    enabled: false,
    paymentCard: '',
    createdAt: '',
    updatedAt: ''
  };

  hide = true;
  hidePayment = true;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private ruta: ActivatedRoute, private router: Router, private _snackBar: MatSnackBar) {

  }


  // Inicializa el formulario
  private _initForm() {
    this.myForm = this.fb.group({
      id: [this.user.id],
      name: [this.user.name, [Validators.required, Validators.minLength(6)]],
      firstName: [this.user.firstName, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      lastName:
        [this.user.lastName, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      password:
        ["", [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      email:
        [this.user.email, [Validators.required, Validators.email, Validators.maxLength(30)]],
      // add a validator to check paymentcard format
      paymentCard: [this.user.paymentCard, [Validators.maxLength(16), Validators.minLength(16), Validators.pattern("^[0-9]*$")]],
      createdAt: [this.getDate(this.user.createdAt)],
      updatedAt: [this.getDate(this.user.updatedAt)]
    })
  }

  ngOnInit() {
    this._initForm();
    this.operation = this.ruta.snapshot.url[this.ruta.snapshot.url.length - 1].path;
    // estamos en editar
    if (this.operation == "edit") {
      this.ruta.paramMap.subscribe(
        {
          next: (params) => {
            this.id = Number(params.get('id'));
          },
          error: (err) => console.log("Error al leer id para editar: " + err)
        }
      )
      this.loading = true;
      this.userService.getUser(this.id).subscribe(
        {
          next: (user) => {
            this.user = user;
            console.log("User: " + JSON.stringify(this.user));
            this._initForm();
            // password is not required to change
            this.myForm.get('password')?.removeValidators(Validators.required);
            this.myForm.get('password')?.removeValidators(Validators.minLength(6));
            this.myForm.get('password')?.updateValueAndValidity();
            this.loading = false;
          },
          error: (err) => console.log("Error: " + err)
        },
      )
    } else if (this.operation == "new") {
      // estamos en creacion de un nuevo usuario
      this.user = {
        id: 0,
        name: '',
        firstName: '',
        lastName: '',
        password: '',
        email: '',
        enabled: false,
        paymentCard: '',
        createdAt: '',
        updatedAt: ''
      };
    }
  }

  ngAfterViewInit(): void {

  }

  private hasChanged: boolean = false;

  onSubmit() {
    console.log("Enviado formulario");
    console.warn(this.myForm.value);

    // obtenemos datos del formulario
    // solo actualizamos los campos que se han modificado
    // solo se puede modificar email, contraseña y tarjeta de pago
    let formEmail = this.myForm.value.email;
    let formPassword = this.myForm.value.password;
    let formPayment = this.myForm.value.paymentCard;


    if (this.operation == "new") {
      this.user.name = this.myForm.value.name
      this.user.firstName = this.myForm.value.firstName;
      this.user.lastName = this.myForm.value.lastName;
      this.user.password = formPassword
      this.user.email = formEmail;
      this.user.paymentCard = formPayment;
      this.loading = true;
      this.userService.postUser(this.user).subscribe(
        {
          next: (user) => {
            console.log("User created: " + JSON.stringify(user));
            this.router.navigate(['/users']).then(r => console.log("Navegando a /users"));
            this.loading = false;
          },
          error: (err) => {
            this._snackBar.open("Error al crear usuario: " + err, "Cerrar", {duration: 3000});
            this.loading = false;
          }
        }
      )
      return;
    }

    // check if password is not empty
    if (formPassword != null && formPassword != "") {
      this.user.password = formPassword;
      this.hasChanged = true;
    }

    if (formEmail != this.user.email) {
      this.user.email = formEmail;
      this.hasChanged = true;
    }
    if (formPayment != this.user.paymentCard) {
      this.user.paymentCard = formPayment;
      this.hasChanged = true;
    }
    if (this.hasChanged) {
      this.loading = true;
      this.userService.putUser(this.user).subscribe(
        {
          next: (user) => {
            console.log("User updated: " + JSON.stringify(user));
            this.router.navigate(['/users']).then(r => console.log("Navegando a /users"));
            let msg = "Se ha creado el usuario correctamente";
            if (this.id) {
              msg = "Usuario " + this.id + " actualizado correctamente";
            }
            this._snackBar.open(msg, "Cerrar", {duration: 3000});
            this.loading = false;
          },
          error: (err) => {
            this._snackBar.open("Error al actualizar usuario: " + err, "Cerrar", {
              duration: 3000,
              verticalPosition: "top"
            });
            this.loading = false;
          }
        }
      )
    } else {
      this._snackBar.open("No se ha modificado ningún campo", "Cerrar", {duration: 3000});
    }
  }

  /**
   * Returns a formatted date.
   * @param isoDate The date in ISO 8601 format.
   */
  protected getDate(isoDate: string | undefined) {
    if (!isoDate) {
      return '';
    }
    // createdAt is a string in format ISO 8601
    return new Date(isoDate).toLocaleString('es-ES', {hour12: false});
  }

  getHintLabel(number: number) {
    return this.id ? 'No modificable' : 'Máximo ' + number + ' caracteres'
  }

  getPasswordLabel() {
    return this.id ? 'Nueva contraseña' : 'Contraseña'
  }
}
