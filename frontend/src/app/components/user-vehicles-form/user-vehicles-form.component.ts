import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardHeader, MatCardModule,} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {UserStatusComponentComponent} from "../user-status-component/user-status-component.component";
import {VehicleService} from "../../services/VehicleService";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatProgressBar} from "@angular/material/progress-bar";
import {VehiclePlugtype} from "../../models/vehicle.model";

@Component({
  selector: 'app-user-vehicles-form',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDivider,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule,
    UserStatusComponentComponent,
    MatCardHeader,
    MatSelect,
    MatOption,
    NgForOf,
    RouterLink,
    MatProgressBar
  ],
  templateUrl: './user-vehicles-form.component.html',
  styleUrl: './user-vehicles-form.component.css'
})
export class UserVehiclesFormComponent implements OnInit {
  plugTypes = Object.values(VehiclePlugtype)

  isLoading = false;
  form: FormGroup = new FormGroup({});
  userId: number = 0;


  constructor(private service: VehicleService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.loadVehicle();
  }

  private loadVehicle() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (!id) {
        console.log("No user id provided");
        return;
      }
      this.userId = id;
    })
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      carRegistration: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      brand: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      model: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      capacity: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      plugType: [null, [Validators.required]]
    });
  }

  protected readonly VehiclePlugtype = VehiclePlugtype;

  onSubmit() {
    const formValue = this.form.value;
    formValue.userId = this.userId;
    console.log(formValue);
    this.isLoading = true;
    this.service.postVehicle(formValue).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/users/' + this.userId + '/vehicles']).then(r => this.snackBar.open("Vehículo creado", "Close", {
          duration: 2000,
        }));
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open("Error en crear vehiculo: " + err, "Close", {
          duration: 2000,
        });
      }
    })
  }

}
