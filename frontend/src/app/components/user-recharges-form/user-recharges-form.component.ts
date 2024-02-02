import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {VehicleService} from "../../services/VehicleService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Vehicle} from "../../models/vehicle.model";
import {ChargerPoint, ChargerpointStatus} from "../../models/chargerpoint.model";
import {MatProgressBar} from "@angular/material/progress-bar";
import {GoogleMap, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {RechargeService} from "../../services/RechargeService";
import {MatDialog} from "@angular/material/dialog";
import {RechargeStatus} from "../../models/recharge.model";
import {UserRechargeDialog} from "../user-recharge-start-dialog/user-recharge-dialog.component";

@Component({
  selector: 'app-user-recharges-form',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
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
    MatCardFooter,
    MatProgressBar,
    GoogleMap,
    MapMarker,
    MapInfoWindow
  ],
  templateUrl: './user-recharges-form.component.html',
  styleUrl: './user-recharges-form.component.css'
})
export class UserRechargesFormComponent implements AfterViewInit {

  @ViewChild('map') map: GoogleMap | undefined;
  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow | undefined;

  userId: number = 0;
  form: FormGroup = new FormGroup({});
  vehicles: Vehicle[] = [];
  compatibleChargerPoints: ChargerPoint[] = [];
  loading: boolean = false;
  selectedChargerPoint: ChargerPoint | undefined;
  markerAdress: string = "";
  markerPower: string = "";

  constructor(private vehicleService: VehicleService, private rechargeService: RechargeService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.loadVehicle();
    this.form = this.fb.group({
      ['vehicleId']: [null, Validators.required],
      ['chargerpointId']: [null, Validators.required],
    });
  }


  private loadVehicle() {
    this.loading = true;
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (!id) {
        console.log("No user id provided");
        return;
      }
      this.userId = id;

      // load user vehicles
      this.vehicleService.getVehiclesByUser(this.userId).subscribe({
        next: (vehicles: Vehicle[]) => {
          this.vehicles = vehicles;
          this.loading = false;
        },
        error: (err: any) => {
          console.log(err);
          this.loading = false;
          this.snackBar.open("Error loading vehicles", "Close", {
            duration: 2000,
          });
        }
      })
    })

  }


  ngAfterViewInit(): void {
  }

  onSubmit() {
    const data = this.form.value;
    data['userId'] = +this.userId;
    console.log(data);
    this.rechargeService.newRecharge(this.form.value).subscribe({
        next: (recharge: any) => {
          this.snackBar.open("Recharge created", "Close", {
            duration: 2000,
          });
          const dialogRef = this.dialog.open(UserRechargeDialog, {
            data: 'recharge'
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed : ' + result);
            this.loading = true;
            if (result) {
              recharge.status = RechargeStatus.CHARGING;
              this.rechargeService.updateRecharge(recharge).subscribe({
                next: () => {
                  this.router.navigate(['users', this.userId, 'recharges', recharge.id]);
                },
                error: (err: any) => {
                  console.log(err);
                  this.snackBar.open("Error al comenzar la recarga", "Close", {
                    duration: 2000,
                  });
                  this.loading = false;
                }
              });
            } else {
              recharge.status = RechargeStatus.NOT_STARTED
              this.rechargeService.updateRecharge(recharge).subscribe({
                next: () => {
                  this.router.navigate(['users', this.userId, 'recharges', recharge.id]);
                },
                error: (err: any) => {
                  console.log(err);
                  this.snackBar.open("Error al comunicar con el servidor", "Close", {
                    duration: 2000,
                  });
                }
              });

            }
          })
        },
        error: (err: any) => {
          console.log(err);
          this.snackBar.open("Error creating recharge", "Close", {
            duration: 2000,
          });
        }
      }
    );
  }

  onVehicleChanged(value: number) {
    this.loading = true;
    console.log("vehicle changed: " + value);
    // load compatible chargerpoints
    this.vehicleService.getCompatibleChargerPoints(value).subscribe({
      next: (chargerPoints: ChargerPoint[]) => {
        this.compatibleChargerPoints = chargerPoints.filter(cp => cp.status == ChargerpointStatus.DISPONIBLE);
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
        this.snackBar.open("Error loading compatible chargerpoints", "Close", {
          duration: 2000,
        });
      }
    })
  }

  onChargerPointSelected(value: number) {
    console.log("chargerpoint selected: " + value);
    this.selectedChargerPoint = this.compatibleChargerPoints.find(cp => cp.id == value);
  }

  openInfoWindow(id: number | undefined) {
    if (!id) {
      return;
    }
    this.markerAdress = this.compatibleChargerPoints.find(cp => cp.id == id)!.address;
    this.markerPower = this.compatibleChargerPoints.find(cp => cp.id == id)!.power.toString();
    this.infoWindow?.open();
  }
}
