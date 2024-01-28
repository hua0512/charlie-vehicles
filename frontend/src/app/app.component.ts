import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {MediaMatcher} from "@angular/cdk/layout";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'CharlieBackend';

  pageTitle = '';
  mobileQuery: MediaQueryList;

  links = [
    {name: "Usuarios", isActive: true, url: "/users"},
    //{name: "Mis vehículos", isActive: false, url: "/vehicles"},
    {name: "Puntos de carga", isActive: false, url: "/chargerpoints"},
  ]

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      let url = (event as NavigationEnd).url;
      this.pageTitle = this.mapRouteToTitle(url)
      console.log(this.pageTitle);
    });
  }


  mapRouteToTitle(route: string): string {
    if (route === '/users') {
      return 'Gestión de Usuarios';
    } else if (route.startsWith("/users") && route.endsWith("edit")) {
      return 'Perfil del Usuario';
    } else if (route.startsWith("/users") && route.endsWith("vehicles/new")) {
      return 'Nuevo Vehículo';
    } else if (route === '/users/new') {
      return 'Nuevo Usuario';
    } else if (route === '/vehicles') {
      return 'Mis vehículos';
    } else {
      return 'CharlieBackend';
    }
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


}
