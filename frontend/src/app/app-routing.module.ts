import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserListComponent} from "./components/user-list/user-list.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {UserVehiclesListComponent} from "./components/user-vehicles-list/user-vehicles-list.component";
import {UserVehiclesFormComponent} from "./components/user-vehicles-form/user-vehicles-form.component";
import {ChargerpointsListComponent} from "./components/chargerpoints-list/chargerpoints-list.component";
import {ChargerpointsFormComponent} from "./components/chargerpoints-form/chargerpoints-form.component";
import {LoginComponent} from "./components/login/login.component";
import {authGuard} from "./auth/auth.guard";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {UserRechargesListComponent} from "./components/user-recharges-list/user-recharges-list.component";
import {UserRechargesFormComponent} from "./components/user-recharges-form/user-recharges-form.component";
import {UserRechargeInfoComponent} from "./components/user-recharges-info/user-recharge-info.component";


const routes: Routes = [
  {
    path: 'users',
    canActivate: [authGuard],
    children: [
      {
        path: ':id/edit',
        component: UserProfileComponent,
      },
      {
        path: ':id/vehicles',
        component: UserVehiclesListComponent,
      },
      {
        path: ':id/vehicles/new',
        component: UserVehiclesFormComponent,
      },
      {
        path: 'new',
        component: UserProfileComponent,
      },
      {
        path: ':id/recharges',
        component: UserRechargesListComponent,
      },
      {
        path: ':id/recharges/new',
        component: UserRechargesFormComponent,
      },
      {
        path: ':id/recharges/:rechargeId',
        component: UserRechargeInfoComponent,
      },
      {
        path: '',
        component: UserListComponent,
      }
    ]
  },
  {
    path: "chargerpoints",
    canActivate: [authGuard],
    children: [
      {
        path: 'new',
        component: ChargerpointsFormComponent,
      },
      {
        path: '',
        component: ChargerpointsListComponent,
      }
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
