import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChargerPointService} from "../../services/ChargerPointService";
import {ChargerPoint, ChargerpointPower, ChargerpointStatus} from "../../models/chargerpoint.model";
import {MatProgressBar} from "@angular/material/progress-bar";
import {VehiclePlugtype} from "../../models/vehicle.model";

@Component({
  selector: 'app-chargerpoints-form',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCardModule,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatProgressBar,
  ],
  templateUrl: './chargerpoints-form.component.html',
  styleUrl: './chargerpoints-form.component.css'
})
export class ChargerpointsFormComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  plugTypes = Object.values(VehiclePlugtype);
  chargerTypes = Object.values(ChargerpointPower);
  statusTypes = Object.values(ChargerpointStatus);
  isLoading = false;

  constructor(private service: ChargerPointService, private snackBar: MatSnackBar, private fb: FormBuilder, private router: Router) {

  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      plugType: [null, [Validators.required]],
      power: [null, [Validators.required]],
      status: [null, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      let newChargePoint = this.form.value as ChargerPoint;
      console.log(newChargePoint);
      this.service.post(newChargePoint).subscribe(
        {
          next: (res) => {
            this.form.reset();
            this.isLoading = false;
            this.router.navigate(['/chargerpoints']).then(r => this.snackBar.open("Punto de carga creado", "Close", {
              duration: 3000,
            }))
          },
          error: (err) => {
            this.isLoading = false;
            this.snackBar.open('Error creating charger point', 'OK', {duration: 3000});
          }
        });
    }
  }
}
