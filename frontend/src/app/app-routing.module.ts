import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserListComponent} from "./components/user-list/user-list.component";
import {UserEditComponent} from "./components/user-edit/user-edit.component";


const routes: Routes = [
  {path: 'users', component: UserListComponent},
  {path: 'users/:id/edit', component: UserEditComponent},
  {path: 'users/new', component: UserEditComponent},
  {path: '', redirectTo: '/users', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
