import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {Recharge, RechargePayment, RechargeStatus} from "../../models/recharge.model";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {RechargeService} from "../../services/RechargeService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChargerPoint} from "../../models/chargerpoint.model";
import {GoogleMap, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {ChargerPointService} from "../../services/ChargerPointService";
import {getDate} from "../../utils/utils";
import {catchError} from "rxjs/operators";
import {of, zip} from "rxjs";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-user-recharge-info',
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
    GoogleMap,
    MapInfoWindow,
    MapMarker,
    RouterLink,
    MatCardFooter,
    MatProgressBar
  ],
  templateUrl: './user-recharge-info.component.html',
  styleUrl: './user-recharge-info.component.css'
})
export class UserRechargeInfoComponent {

  @ViewChild(GoogleMap, {static: false}) map!: GoogleMap;
  @ViewChild(MapInfoWindow, {static: false}) infoWindow!: MapInfoWindow;

  // current recharge
  recharge: Recharge | undefined;
  //  current recharge id
  rechargeId: number | undefined;
  // current chargerpoint
  chargerpoint: ChargerPoint | undefined;
  // show completed info
  shouldShow: boolean = false;
  isLoading = true;

  constructor(private router: Router, private route: ActivatedRoute, private rechargeService: RechargeService, private chargerPointService: ChargerPointService, private snackBar: MatSnackBar) {
    this.loadRecharge();
  }


  private loadRecharge() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      let id = params['rechargeId'];
      if (!id) {
        console.log("No recharge id provided");
        this.snackBar.open('No recharge id provided', 'Close');
        return;
      }
      this.rechargeId = id;
      console.log("Loading recharge with id " + id);
      let rechargeObservable =  this.rechargeService.getRechargeById(id).pipe(
        catchError(err => {
          return of(null);
        })
      )
      let chargerPointObservable = this.chargerPointService.getAll().pipe(
        catchError(err => {
          return of(null);
        })
      )

      zip(rechargeObservable, chargerPointObservable).subscribe({
        next: ([recharge, chargerpoints]) => {
          this.isLoading = false;
          if (!recharge || !chargerpoints) {
            this.snackBar.open('Error loading recharge data', 'Close');
            return;
          }
          this.recharge = recharge;
          this.chargerpoint = chargerpoints.find(cp => cp.id == this.recharge?.chargerpointId);
          // refresh status
          this.calcTotal();
        },
        error: err => {
          this.isLoading = false;
          this.snackBar.open('Error loading recharge : ' + err, 'Close');
        }
      });
    });
  }

  // finish recharge
  finishRecharge() {
    if (!this.rechargeId) {
      throw new Error("Recharge id is required");
    }
    // do nothing if recharge is already completed or its payment is cancelled
    if (!this.shouldShowSubmit()) return

    this.recharge!.status = RechargeStatus.COMPLETED

    this.rechargeService.updateRecharge(this.recharge!).subscribe({
      next: () => {
        this.snackBar.open('Recarga terminada', 'Cerrar');
        this.loadRecharge();
      },
      error: err => {
        this.snackBar.open('Error al finalizar recarga', 'Cerrar');
      }
    })
  }

  // calculate total price
  calcTotal(): string {
    if (!this.recharge) {
      return "";
    }
    if (this.recharge.status != RechargeStatus.COMPLETED) return "";

    let start = new Date(this.recharge.dateStart!);
    let end = new Date(this.recharge.dateEnd!);
    let diff = end.getTime() - start.getTime();
    let diffHours = diff / (1000 * 3600);
    // precio tiempo * kw * precio kw
    let total = diffHours * this.recharge.kw * this.recharge!.price
    this.shouldShow = true;
    // 2 decimals + euro symbol
    return total.toFixed(2) + " €";
  }

  openInfoWindow(id: number | undefined) {
    this.infoWindow.open();
  }


  // whether to show submit button
  shouldShowSubmit(): boolean {
    if (!this.recharge) {
      console.log("No recharge");
      return false;
    }
    return this.recharge.status != RechargeStatus.COMPLETED && this.recharge.payment != RechargePayment.CANCELLED;
  }

  protected readonly getDate = getDate;
}
