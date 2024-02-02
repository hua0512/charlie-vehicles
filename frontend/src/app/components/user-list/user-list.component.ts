import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {ReplaySubject} from "rxjs";
import {User} from "../../models/user.model";
import {UserService} from "../../services/UserService";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatListModule} from "@angular/material/list";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatOption, MatRippleModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {UserDeleteDialog} from "../user-delete-dialog/user-delete-dialog";
import {MatCardModule} from "@angular/material/card";
import {UserStatusComponentComponent} from "../user-status-component/user-status-component.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import {getDate} from "../../utils/utils";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSelect} from "@angular/material/select";

/**
 * UserListComponent is a component that displays a list of users in a table.
 * The table includes columns for the user's id, name, names, email, createdAt, updatedAt, status, and actions.
 * The actions column includes buttons for deleting a user.
 * The component includes a paginator and a sort header for navigating and sorting the table.
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [
    MatIconModule,
    MatChipsModule,
    RouterLink,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgOptimizedImage,
    NgIf,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatCardModule,
    UserStatusComponentComponent,
    MatProgressBar,
    RouterLinkActive,
    RouterOutlet,
    MatTooltip,
    MatSelect,
    MatOption,
  ],
  standalone: true
})
export class UserListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<User>;

  // flag to show/hide loading progress bar
  isLoadingResults = true;
  // data source for table
  dataSource = new MatTableDataSource<User>();
  // data stream that is used for table data source
  dataStream = new ReplaySubject<User[]>();

  // Columns displayed in the table.
  displayedColumns = ['id', 'name', 'names', 'email', 'createdAt', 'updatedAt', 'status', 'actions'];

  constructor(private userService: UserService, private _snackBar: MatSnackBar, private dialog: MatDialog) {
    this.dataStream.subscribe((data) => {
      this.dataSource.data = data;
    });
    // get users
    this.loadUsers()
    // bind sortData function to this
    this.sortData = this.sortData.bind(this);
    this.filterPredicate = this.filterPredicate.bind(this);
  }


  /**
   * Sets up the sorting, filtering, and pagination for the data source after the view has been initialized.
   *
   * @returns void
   */
  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
      // Subscribe to sort change to reset paginator on sort change
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.table) {
      this.table.dataSource = this.dataSource;
    }
    this.dataSource.sortData = this.sortData
    this.dataSource.filterPredicate = this.filterPredicate;
  }

  /**
   * Filter predicates that checks if the provided data matches the given filter.
   *
   * @param {Object} data - The data to be filtered.
   * @param {string} filter - The filter to be applied.
   * @return {boolean} - Returns true if the data matches the filter, otherwise false.
   */
  private filterPredicate(data: User, filter: string): boolean {
    const filterLower = filter.toLowerCase();
    console.log(filterLower);
    return data.name.toLowerCase().includes(filterLower) ||
      (data.firstName + ' ' + data.lastName).toLowerCase().includes(filterLower) ||
      data.email.toLowerCase().includes(filterLower) ||
      data.enabled.toString().toLowerCase().includes(filterLower) ||
      data.paymentCard?.toLowerCase().includes(filterLower) ||
      getDate(data.createdAt!).toLowerCase().includes(filterLower) ||
      getDate(data.updatedAt!).toLowerCase().includes(filterLower);
  }

  /** Simple sort comparator for example ID/Name columns (for client-side sorting). */
  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  /**
   * Sorts the data (client-side).
   * @param data The data to sort.
   * @param sort The sort object.
   */
  sortData(data: User[], sort: MatSort) {
    const dataSorted = data.slice();
    if (!sort.active || sort.direction === '') {
      return dataSorted;
    }

    return dataSorted.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compare(a.id!, b.id!, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'names':
          return this.compare(a.firstName + ' ' + a.lastName, b.firstName + ' ' + b.lastName, isAsc);
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'status':
          return this.compare(a.enabled.toString(), b.enabled.toString(), isAsc);
        case 'paymentCard':
          a.paymentCard = a.paymentCard || '';
          b.paymentCard = b.paymentCard || '';
          return this.compare(a.paymentCard, b.paymentCard, isAsc);
        case 'createdAt':
          return this.compare(a.createdAt!, b.createdAt!, isAsc);
        case 'updatedAt':
          return this.compare(a.updatedAt!, b.updatedAt!, isAsc);
        default:
          return 0;
      }
    });
  }


  /**
   * Opens a dialog to confirm the deletion of a user.
   * @param id The id of the user to delete.
   */
  requestDeleteUser(id: Number) {
    const dialogRef = this.dialog.open(UserDeleteDialog, {
      width: '250px',
      data: {id: id}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
      if (result) {
        this.deleteUser(id);
      }
    });
  }

  /**
   * Deletes a specific user.
   * @param id The id of the user to delete.
   */
  private deleteUser(id: Number) {
    console.log("Requesting delete user " + id);
    if (!id) {
      throw new Error('User id is required');
    }
    this.userService.deleteUser(id.valueOf()).subscribe(
      {
        next: () => {
          console.log("User deleted successfully");
          this.dataStream.next(this.dataSource.data.filter(user => user.id !== id));
          this.openSnackBar("Usuario eliminado", "Cerrar");
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar("Error al eliminar usuario : " + err, "Cerrar");
        }
      }
    );
  }

  /**
   * Loads users from the server.
   * If enable is not specified, all users are loaded.
   * If enable is specified, only users with the specified enabled value are loaded.
   *
   * @param {boolean} [enable] - Optional parameter to specify if only enabled users should be loaded.
   * @return {void} - Nothing.
   */
  private loadUsers(enable?: boolean): void {
    this.isLoadingResults = true;
    // clear data source
    this.dataSource.data = [];
    this.userService.getUsers(enable).subscribe(
      {
        next: (users) => {
          this.dataStream.next(users);
          this.isLoadingResults = false;
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar("Error al cargar usuarios", "Cerrar");
          this.isLoadingResults = false;
        }
      }
    );
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  /**
   * Applies a filter to the data source based on the value of a search input.
   *
   * @param filterValue The value of the search input.
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // Reset paginator on filter change
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  protected readonly getDate = getDate;

  /**
   * Filters the users based on their status.
   *
   * This method is used to filter the users based on their status. It accepts a string value which can be 'all', 'active', or 'inactive'.
   * If the value is 'all', it loads all users.
   * If the value is 'active', it loads only the users who are active.
   * If the value is 'inactive', it loads only the users who are inactive.
   *
   * @param {string} value - The status of the users to load. Can be 'all', 'active', or 'inactive'.
   */
  applyFilterByStatus(value: string) {
    console.log("Filtering by status: " + value);
    if (value == "all") {
      this.loadUsers();
    } else if (value == "enabled") {
      this.loadUsers(true);
    } else if (value == "disabled") {
      this.loadUsers(false);
    }
  }

}
