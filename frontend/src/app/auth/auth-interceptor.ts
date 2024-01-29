import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from "../services/AuthService";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Exclude certain URLs
    if (!req.url.includes('/login')) {
      const token = localStorage.getItem('token');
      if (token) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(cloned).pipe(
          catchError((error: HttpErrorResponse) => {
            console.log("error happened in interceptor : " + error.status);
            if (error.status === 401) {
              // Clear any stored user data
              this.authService.logout()

              // Redirect to the login page
            //   get root url and add the login page URL, then navigate to that page
              this.router.parseUrl("/login");

            }
            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(req);
  }
}
