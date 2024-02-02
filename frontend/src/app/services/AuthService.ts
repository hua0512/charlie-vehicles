import {Injectable} from "@angular/core";
import {catchError, Observable, tap} from "rxjs";
import {environment} from "../environments/environment";
import {BaseService} from "./BaseService";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  isLogged = false;
  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  constructor(http: HttpClient) {
    super(http);
  }

  login(email: string, password: string): Observable<{ expires_at: string, token: string }> {
    return this.http.post<{ expires_at: string, token: string }>(`${environment.loginApiUrl}`, {email, password}).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        // timestamp when the token will expire
        localStorage.setItem('expires_at', response.expires_at);
        console.log(response.expires_at)
        this.isLogged = true;
      }),
      catchError(this.handleError)
    );
  }

  private getExpirationTimestamp(): number {
    const expiresAt = localStorage.getItem('expires_at');
    if (expiresAt) {
      return parseInt(expiresAt);
    }
    return 0;
  }

  isLoggedin() {
    return this.isLogged || localStorage.getItem("token") != null || this.getExpirationTimestamp() > Date.now();
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
  }
}
