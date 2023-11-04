import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {environment} from "../environments/environment";
import {BaseService} from "./BaseService";

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  private apiBaseUrl = environment.apiBaseUrl + "users";


  constructor(http: HttpClient) {
    super(http);
  }

  getUsers(enable? : boolean): Observable<User[]> {
    if (enable != undefined) {
      return this.http.get<User[]>(`${this.apiBaseUrl}?enable=${enable}`);
    }
    return this.http.get<User[]>(`${this.apiBaseUrl}`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiBaseUrl}/${id}`);
  }

  postUser(user: User): Observable<User> {
    if (user.id) {
      delete user.id;
    }
    this.removeDateFields(user);
    return this.http.post<User>(`${this.apiBaseUrl}`, user);
  }

  putUser(user: User): Observable<User> {
    this.removeDateFields(user);
    return this.http.put<User>(`${this.apiBaseUrl}/${user.id}`, user);
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

  deleteUser(id: number): Observable<User> {
    if (!id) {
      throw new Error('User id is required');
    }
    return this.http.delete<User>(`${this.apiBaseUrl}/${id}`);
  }
}
