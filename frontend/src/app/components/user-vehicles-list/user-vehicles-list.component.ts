import {Component, forwardRef, HostListener, OnInit} from '@angular/core';
import {VehicleService} from "../../services/VehicleService";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCardContent, MatCardModule, MatCardTitle} from "@angular/material/card";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {Vehicle} from "../../models/vehicle.model";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-user-vehicles',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatCardContent,
    MatCardTitle,
    MatCardModule,
    MatButton,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatProgressSpinner,
    MatProgressBar
  ],
  templateUrl: './user-vehicles-list.component.html',
  styleUrl: './user-vehicles-list.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserVehiclesListComponent),
      multi: true,
    }
  ]
})
export class UserVehiclesListComponent implements OnInit {
  // data
  dataStream: Vehicle[] = [];
  // filtered data
  filteredDataStream: Vehicle[] = [];
  // filter
  filter = new FormControl();

  isLoading = false;
  // current user id
  protected id: number = 0;

  constructor(private service: VehicleService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    // load user id
    this.loadUserId();
    // load vehicles data
    this.loadVehicles();
  }


  ngOnInit() {
    // subscribe to filter input field
    this.filter.valueChanges.subscribe(value => {
      this.applyFilter(value);
    });
  }

  private loadUserId() {
    this.route.paramMap.subscribe(
      {
        next: (params) => {
          this.id = Number(params.get('id'));
          console.log("Id: " + this.id);
        },
        error: (err) => console.log("Error al leer id para editar: " + err)
      }
    )
  }

  private loadVehicles() {
    this.isLoading = true;
    this.service.getVehiclesByUser(this.id).subscribe(
      {
        next: (vehicles) => {
          this.dataStream = vehicles;
          this.filteredDataStream = [...this.dataStream];
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.showSnackBar("Error al cargar los vehículos");
          this.isLoading = false;
        }
      }
    );
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 2000,
    });
  }

  applyFilter(value: string) {
    if (value) {
      this.filteredDataStream = this.dataStream.filter(vehicle => this.filterPredicate(vehicle, value));
    } else {
      // if no filter, return default data stream
      this.filteredDataStream = this.dataStream;
    }
  }

  private filterPredicate(data: Vehicle, filter: string): boolean {
    if (filter == null) {
      return false;
    }
    const lowerCaseFilter: string = filter.toLowerCase();
    return data.brand.toLowerCase().includes(lowerCaseFilter)
      || data.model.toLowerCase().includes(lowerCaseFilter)
      || data.carRegistration.toLowerCase().includes(lowerCaseFilter)
      || data.plugType.toString().toLowerCase().includes(lowerCaseFilter)
      || data.id!.toString().toLowerCase().includes(lowerCaseFilter);
  }

  getRandomLightColor(): string {
    // return a random super light color
    const colors: string[] = ["#E8F5E9", "#F1F8E9", "#F9FBE7", "#FFFDE7", "#FFF8E1", "#FFF3E0", "#FBE9E7", "#EFEBE9", "#FAFAFA", "#ECEFF1"];
    const randomIndex: number = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }


  getNumberOfColumns(): number {
    const width = window.innerWidth;

    if (width < 600) {
      return 1;
    } else if (width < 900) {
      return 2;
    } else {
      return 4;
    }
  }

  cols: number = this.getNumberOfColumns();

  // update number of columns when window is resized
  @HostListener('window:resize')
  onResize() {
    this.cols = this.getNumberOfColumns();
  }


  /**
   * Deletes a vehicle with the given id.
   *
   * @param {number} id - The id of the vehicle to be deleted.
   * @return {void}
   */
  deleteVehicle(id: number) {
    this.isLoading = true;
    this.service.deleteVehicle(id).subscribe({
      next: () => {
        this.showSnackBar("Vehículo eliminado");
        this.loadVehicles();
        this.isLoading = false;
      },
      error: (err) => {
        this.showSnackBar("Error al eliminar vehículo: " + err);
        this.isLoading = false;
      }
    })
  }
}
