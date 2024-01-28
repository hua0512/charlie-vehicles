import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-user-status-component',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './user-status-component.component.html',
  styleUrl: './user-status-component.component.css'
})
export class UserStatusComponentComponent {

  @Input() status: boolean = false;

  getClass() {
    return this.status ? 'status-success' : 'status-failed';
  }

  getText() {
    return this.status ? 'Activo' : 'Inactivo';
  }
}
