import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {NgForOf, NgIf} from "@angular/common";
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {MatInput} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatDivider} from "@angular/material/divider";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {ChargerPoint, ChargerpointStatus} from "../../models/chargerpoint.model";
import {ChargerPointService} from "../../services/ChargerPointService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatRipple} from "@angular/material/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-chargerpoints-list',
  standalone: true,
  imports: [
    MatCardModule,
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
    MatProgressBar,
  ],
  templateUrl: './chargerpoints-list.component.html',
  styleUrl: './chargerpoints-list.component.css'
})
export class ChargerpointsListComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ChargerPoint>;

  // loading flag
  isLoadingResults = false;
  // data source for table
  dataSource = new MatTableDataSource<ChargerPoint>();
  displayedColumns = ['id', 'address', 'latitude', 'longitude', 'plugType', 'power', 'status']
  // array of possible values for status filter
  protected chargerpointStatus = Object.values(ChargerpointStatus);

  constructor(private dataService: ChargerPointService, private snackBar: MatSnackBar) {
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

  private loadData() {
    this.isLoadingResults = true;
    // get all data from server
    this.dataService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoadingResults = false;
      },
      error: (err) => {
        console.log(err);
        this.showSnackBar('Error loading data');
        this.isLoadingResults = false;
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


  private filterPredicate(data: ChargerPoint, filter: string): boolean {
    const filterLower = filter.toLowerCase();
    console.log(filterLower);
    return data.id?.toString().toLowerCase().includes(filterLower) ||
      data.address.toLowerCase().includes(filterLower) ||
      data.latitude.toString().toLowerCase().includes(filterLower) ||
      data.longitude.toString().toLowerCase().includes(filterLower) ||
      data.plugType.toString().toLowerCase().includes(filterLower) ||
      data.power.toString().toLowerCase().includes(filterLower) ||
      data.status.toString().toLowerCase().includes(filterLower);
  }

  /** Simple sort comparator for example ID/Name columns (for client-side sorting). */
  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private sortData(data: ChargerPoint[], sort: MatSort) {
    const dataSorted = data.slice();
    if (!sort.active || sort.direction === '') {
      return dataSorted;
    }

    return dataSorted.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compare(a.id!, b.id!, isAsc);
        case 'address':
          return this.compare(a.address, b.address, isAsc);
        case 'longitude':
          return this.compare(a.longitude, b.longitude, isAsc);
        case 'latitude':
          return this.compare(a.latitude, b.latitude, isAsc);
        case 'plugType':
          return this.compare(a.plugType, b.plugType, isAsc);
        case 'power':
          return this.compare(a.power, b.power, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
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
}
