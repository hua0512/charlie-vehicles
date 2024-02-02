import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle} from "@angular/material/dialog";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {Component, Inject} from "@angular/core";


export interface DialogData {
  action: 'recharge' | 'vehicle';
}

@Component({
  selector: 'user-recharge-dialog',
  styleUrls: ['./user-recharge-dialog.component.css'],
  templateUrl: './user-recharge-dialog.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogClose, MatButton, MatDialogActions],
})
export class UserRechargeDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {

  }

}
