import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserListComponent} from "./components/user-list/user-list.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {UserVehiclesListComponent} from "./components/user-vehicles-list/user-vehicles-list.component";
import {UserVehiclesFormComponent} from "./components/user-vehicles-form/user-vehicles-form.component";
import {ChargerpointsListComponent} from "./components/chargerpoints-list/chargerpoints-list.component";
import {ChargerpointsFormComponent} from "./components/chargerpoints-form/chargerpoints-form.component";


const routes: Routes = [
  {path: 'users', component: UserListComponent},
  {path: 'users/:id/edit', component: UserProfileComponent},
  {path: 'users/new', component: UserProfileComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'users/:id/vehicles', component: UserVehiclesListComponent},
  {path: 'users/:id/vehicles/new', component: UserVehiclesFormComponent},
  {path: 'chargerpoints', component: ChargerpointsListComponent},
  {path: 'chargerpoints/new', component: ChargerpointsFormComponent},
  {path: '', redirectTo: '/users', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
