import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {User} from '../models/user.model';
import {environment} from "../environments/environment";
import {BaseService} from "./BaseService";

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  private apiBaseUrl = `${environment.userApiUrl}/users`;

  constructor(http: HttpClient) {
    super(http);
    console.log("apiBaseUrl: " + this.apiBaseUrl)
  }

  getUsers(enable?: boolean): Observable<User[]> {
    let url = `${this.apiBaseUrl}`;
    if (enable != undefined) {
      url += `?enable=${enable}`;
    }
    return this.http.get<User[]>(url);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiBaseUrl}/?email=${email}`).pipe(
      catchError(this.handleError)
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiBaseUrl}/${id}`);
  }

  postUser(user: User): Observable<User> {
    if (user.id) {
      delete user.id;
    }
    this.removeDateFields(user);
    return this.http.post<User>(`${this.apiBaseUrl}`, user).pipe(
      catchError(this.handleError)
    );
  }

  putUser(user: User): Observable<User> {
    this.removeDateFields(user);
    return this.http.put<User>(`${this.apiBaseUrl}/${user.id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  private removeDateFields(user: User): User {
    if (user.createdAt) {
      delete user.createdAt;
    }
    if (user.updatedAt) {
      delete user.updatedAt;
    }
    return user;
  }

  deleteUser(id: number): Observable<void> {
    if (!id) {
      throw new Error('User id is required');
    }
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
