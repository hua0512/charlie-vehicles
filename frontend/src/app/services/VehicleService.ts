import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {catchError, Observable, throwError} from "rxjs";
import {Vehicle} from "../models/vehicle.model";
import {BaseService} from "./BaseService";

@Injectable({
  providedIn: 'root',
})
export class VehicleService extends BaseService {

  private apiBaseUrl = `${environment.userApiUrl}vehicles`;

  constructor(http: HttpClient) {
    super(http);
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiBaseUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  getVehicle(id: number): Observable<Vehicle> {
    if (!id) {
      throw new Error('Vehicle id is required');
    }
    return this.http.get<Vehicle>(`${this.apiBaseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  postVehicle(vehicle: Vehicle): Observable<Vehicle> {
    if (vehicle.id) {
      delete vehicle.id;
    }
    return this.http.post<Vehicle>(`${this.apiBaseUrl}`, vehicle).pipe(
      catchError(this.handleError)
    );
  }

  deleteVehicle(id: number): Observable<void> {
    if (!id) {
      throw new Error('Vehicle id is required');
    }
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getVehiclesByUser(userId: number): Observable<Vehicle[]> {
    if (!userId) {
      throw new Error('User id is required');
    }
    return this.http.get<Vehicle[]>(`${environment.userApiUrl}users/${userId}/vehicles`).pipe(
      catchError(this.handleError)
    );
  }
}
