import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {NgForOf, NgIf} from "@angular/common";
import {MatFabButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {MatInput} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDivider} from "@angular/material/divider";
import {MatRipple} from "@angular/material/core";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChargerPointService} from "../../services/ChargerPointService";
import {RechargeService} from "../../services/RechargeService";
import {Recharge, RechargePayment, RechargeStatus} from "../../models/recharge.model";
import {VehicleService} from "../../services/VehicleService";
import {UserService} from "../../services/UserService";
import {User} from "../../models/user.model";
import {getDate} from '../../utils/utils';

import {catchError, of, zip} from "rxjs";

@Component({
  selector: 'app-user-recharges-list',
  standalone: true,
  imports: [MatCardModule,
    NgIf,
    MatFabButton,
    MatFormFieldModule,
    MatIcon,
    RouterModule,
    MatInput,
    MatSelectModule,
    MatDivider,
    MatSort,
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatSortHeader,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRipple,
    MatRow,
    MatRowDef,
    MatPaginator,
    NgForOf,
    MatProgressBar,],
  templateUrl: './user-recharges-list.component.html',
  styleUrl: './user-recharges-list.component.css'
})
export class UserRechargesListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Recharge>;

  // loading flag
  isLoadingResults = true;
  // data source for table
  dataSource = new MatTableDataSource<Recharge>();
  displayedColumns = ['id', 'vehicleId', 'chargerpointId', 'price', 'kw', 'status', 'payment', 'dateStart', 'dateEnd'];
  protected rechargeStatues = Object.values(RechargeStatus).filter(value => typeof value === 'string');
  protected paymentStatus = Object.values(RechargePayment).filter(value => typeof value === 'string');
  id: number = 0;
  showAllow: boolean = false;
  user: User | undefined;
  vehicles: number = 0


  constructor(private service: RechargeService, private userService: UserService, private vehicleService: VehicleService, private ChargerpointService: ChargerPointService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
    this.loadUserId()
    // load data
    this.loadData();
    // bind sortData function to this
    this.sortData = this.sortData.bind(this);
    // bind filterPredicate function to this
    this.filterPredicate = this.filterPredicate.bind(this);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    // Subscribe to sort change to reset paginator on sort change
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.sortData = this.sortData
    this.dataSource.filterPredicate = this.filterPredicate;
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

  private loadData() {
    this.isLoadingResults = true;
    let userObservable = this.userService.getUser(this.id).pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
    let vehiclesObservable = this.vehicleService.getVehiclesByUser(this.id).pipe(
      catchError(err => {
        console.log(err);
        return of([]);
      })
    );
    let rechargesObservable = this.service.getRechargeByUser(this.id).pipe(
      catchError(err => {
        console.log(err);
        return of([]);
      })
    );
    zip(userObservable, vehiclesObservable, rechargesObservable).subscribe(([user, vehicles, recharges]) => {
      if (user != null && vehicles != null && recharges != null) {
        this.user = user;
        this.vehicles = vehicles.length
        this.showAllow = user.paymentCard != null && vehicles.length > 0
        recharges.forEach(recharge => {
          console.log(recharge);
        });
        this.dataSource.data = recharges;
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
        this.showSnackBar("Error al cargar datos");
      }
    });

  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000
    });
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    // Reset paginator on filter change
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private filterPredicate(data: Recharge, filter: string): boolean {
    const filterLower = filter.toLowerCase();
    console.log(filterLower);
    return data.id?.toString().toLowerCase().includes(filterLower) ||
      data.vehicleId.toString().toLowerCase().includes(filterLower) ||
      data.chargerpointId.toString().toLowerCase().includes(filterLower) ||
      data.price.toString().toLowerCase().includes(filterLower) ||
      data.payment.toString().toLowerCase().includes(filterLower) ||
      data.kw?.toString().toLowerCase().includes(filterLower) ||
      data.status.toString().toLowerCase().includes(filterLower);
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private sortData(data: Recharge[], sort: MatSort) {
    const dataSorted = data.slice();
    if (!sort.active || sort.direction === '') {
      return dataSorted;
    }

    return dataSorted.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compare(a.id!, b.id!, isAsc);
        case 'vehicleId':
          return this.compare(a.vehicleId, b.vehicleId, isAsc);
        case 'chargerpointId':
          return this.compare(a.chargerpointId, b.chargerpointId, isAsc);
        case 'price':
          return this.compare(a.price, b.price, isAsc);
        case 'payment':
          return this.compare(a.payment, b.payment, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        case 'kw':
          return this.compare(a.kw, b.kw, isAsc);
        default:
          return 0;
      }
    });
  }


  applyFilterByState(value: string) {
    const filterLower = value.toLowerCase();
    if (filterLower === 'all') {
      this.dataSource.filter = ''; // reset filter
    } else {
      this.dataSource.filter = value.trim().toLowerCase();
    }
    // Reset paginator on filter change
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  shouldGoToAdd() {
    if (this.user?.paymentCard != null && this.vehicles > 0) {
      this.router.navigate(['users', this.id, 'recharges', 'new']);
      return
    }
    this.showSnackBar('Se debe tener una tarjeta de pago y al menos un vehiculo para poder recargar')
  }

  protected readonly getDate = getDate;
}
