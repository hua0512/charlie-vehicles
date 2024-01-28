import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {Component} from "@angular/core";


@Component({
  selector: 'user-delete-dialog',
  styleUrls: ['./user-delete-dialog.css'],
  templateUrl: './user-delete-dialog.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class UserDeleteDialog {
  constructor(public dialog: MatDialog) {

  }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(UserDeleteDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

}
