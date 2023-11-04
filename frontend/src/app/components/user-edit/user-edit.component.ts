import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from "../../services/UserService";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../models/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, AfterViewInit {

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

  constructor(private fb: FormBuilder, private userService: UserService, private ruta: ActivatedRoute, private router: Router, private _snackBar: MatSnackBar) {

  }

  // Inicializa el formulario
  private _initForm() {
    this.myForm = this.fb.group({
      name: [this.user.name, [Validators.required, Validators.minLength(4)]],
      firstName: [this.user.firstName, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      lastName:
        [this.user.lastName, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      password:
        [this.user.password, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      email:
        [this.user.email, [Validators.required, Validators.email, Validators.maxLength(100)]],
      paymentCard: [this.user.paymentCard],
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
      this.userService.getUser(this.id).subscribe(
        {
          next: (user) => {
            this.user = user;
            console.log("User: " + JSON.stringify(this.user));
            this._initForm();
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

  onSubmit() {
    console.log("Enviado formulario");
    console.log(this.myForm.value);
  }

  onUpdated() {
    // obtenemos datos del formulario
    // solo actualizamos los campos que se han modificado
    // solo se puede modificar email, contraseña y tarjeta de pago
    let formEmail = this.myForm.get('email')?.value;
    let formPassword = this.myForm.get('password')?.value;
    let formPayment = this.myForm.get('paymentCard')?.value;


    if (this.operation == "new") {
      this.user.name = this.myForm.get('name')?.value;
      this.user.firstName = this.myForm.get('firstName')?.value;
      this.user.lastName = this.myForm.get('lastName')?.value;
      this.user.password = formPassword
      this.user.email = formEmail;
      this.user.paymentCard = formPayment;
      this.userService.postUser(this.user).subscribe(
        {
          next: (user) => {
            console.log("User created: " + JSON.stringify(user));
            this.router.navigate(['/users']).then(r => console.log("Navegando a /users"));
          },
          error: (err) => this._snackBar.open("Error al crear usuario: " + err.message, "Cerrar", {duration: 3000})
        }
      )
      return;
    }

    let hasChanged = false;
    if (formPassword != this.user.password) {
      this.user.password = formPassword;
      hasChanged = true;
    }
    if (formEmail != this.user.email) {
      this.user.email = formEmail;
      hasChanged = true;
    }
    if (formPayment != this.user.paymentCard) {
      this.user.paymentCard = formPayment;
      hasChanged = true;
    }
    if (hasChanged) {
      this.userService.putUser(this.user).subscribe(
        {
          next: (user) => {
            console.log("User updated: " + JSON.stringify(user));
            this.router.navigate(['/users']).then(r => console.log("Navegando a /users"));
          },
          error: (err) => this._snackBar.open("Error al actualizar usuario: " + err.message, "Cerrar", {duration: 3000})
        }
      )
    } else {
      this._snackBar.open("No se ha modificado ningún campo", "Cerrar", {duration: 3000});
    }
  }
}
