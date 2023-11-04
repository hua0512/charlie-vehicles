import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ReplaySubject} from "rxjs";
import {User} from "../../models/user.model";
import {UserService} from "../../services/UserService";
import {MatChipSelectionChange} from "@angular/material/chips";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<User>;

  isLoadingResults = true;

  dataSource = new MatTableDataSource<User>();
  // dataSource = new UserListDatasource();
  dataStream = new ReplaySubject<User[]>();

  displayedColumns = ['id', 'name', 'names', 'email', 'status', 'createdAt', 'updatedAt', 'actions'];

  constructor(private userService: UserService) {
    this.dataStream.subscribe((data) => {
      this.dataSource.data = data;
    });
    // get users and delay results to simulate slow connection
    this.loadUsers()
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    // Subscribe to sort change to reset paginator on sort change
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.dataSource.sortData = this.sortData
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = ((data: User, filter: string) => {
      const filterLower = filter.toLowerCase();
      return data.name.toLowerCase().includes(filterLower) ||
        (data.firstName + ' ' + data.lastName).toLowerCase().includes(filterLower) ||
        data.email.toLowerCase().includes(filterLower) ||
        data.enabled.toString().toLowerCase().includes(filterLower) ||
        data.paymentCard?.toLowerCase().includes(filterLower) ||
        data.createdAt!.toString().toLowerCase().includes(filterLower) ||
        data.updatedAt!.toString().toLowerCase().includes(filterLower);
    });
    this.table.dataSource = this.dataSource;
  }

  /**
   * Sorts the data (client-side).
   * @param data
   * @param sort
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
          return compare(a.id!, b.id!, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'names':
          return compare(a.firstName + ' ' + a.lastName, b.firstName + ' ' + b.lastName, isAsc);
        case 'email':
          return compare(a.email, b.email, isAsc);
        case 'status':
          return compare(a.enabled.toString(), b.enabled.toString(), isAsc);
        case 'paymentCard':
          if (a.paymentCard == null) {
            a.paymentCard = '';
          }
          if (b.paymentCard == null) {
            b.paymentCard = '';
          }
          return compare(a.paymentCard, b.paymentCard, isAsc);
        case 'createdAt':
          return compare(new Date(a.createdAt!).getTime(), new Date(b.createdAt!).getTime(), isAsc);
        case 'updatedAt':
          return compare(new Date(a.updatedAt!).getTime(), new Date(b.updatedAt!).getTime(), isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Deletes a specific user.
   * @param id The id of the user to delete.
   */
  deleteUser(id: Number) {
    console.log("Requesting delete user " + id);
    this.userService.deleteUser(id.valueOf()).subscribe((user) => {
      this.dataStream.next(this.dataSource.data.filter(user => user.id !== id));
    });
  }

  /**
   * Returns a formatted date.
   * @param isoDate The date in ISO 8601 format.
   */
  getDate(isoDate: string) {
    // createdAt is a string in format ISO 8601
    return new Date(isoDate).toLocaleString('es-ES', {hour12: false});
  }

  loadUsers(enable?: boolean) {
    this.isLoadingResults = true;
    this.userService.getUsers(enable).subscribe((users) => {
      setTimeout(() => {
        this.dataStream.next(users);
        this.isLoadingResults = false;
      }, 0);
    });
  }

  onChipSelectionChanged($event: MatChipSelectionChange) {
    if ($event.selected) {
      if ($event.source.value === "Activos") {
        this.loadUsers(true);
      } else if ($event.source.value === "Inactivos") {
        this.loadUsers(false);
      }
    } else {
      this.loadUsers();
    }
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
