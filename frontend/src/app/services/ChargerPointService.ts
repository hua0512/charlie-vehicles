import {Injectable} from "@angular/core";
import {BaseService} from "./BaseService";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {ChargerPoint} from "../models/chargerpoint.model";

@Injectable({
  providedIn: 'root',
})
export class ChargerPointService extends BaseService {

  private apiBaseUrl = `${environment.userApiUrl}chargerpoints`;

  constructor(http: HttpClient) {
    super(http);
  }


  getAll()  : Observable<ChargerPoint[]>{
    return this.http.get<ChargerPoint[]>(this.apiBaseUrl).pipe(
      catchError(this.handleError)
    );
  }

  post(chargerPoint: ChargerPoint)  : Observable<ChargerPoint>{
    return this.http.post<ChargerPoint>(this.apiBaseUrl, chargerPoint).pipe(
      catchError(this.handleError)
    );
  }

  put(chargerPoint: ChargerPoint)  : Observable<ChargerPoint>{
    return this.http.put<ChargerPoint>(this.apiBaseUrl, chargerPoint).pipe(
      catchError(this.handleError)
    );
  }

  patch(chargerPoint: ChargerPoint)  : Observable<ChargerPoint>{
    return this.http.patch<ChargerPoint>(this.apiBaseUrl, chargerPoint).pipe(
      catchError(this.handleError)
    );
  }

  getChargerPointsForVehicle(vehicleId: number)  : Observable<ChargerPoint[]>{
    return this.http.get<ChargerPoint[]>(`${environment.userApiUrl}${vehicleId}/chargerpoints`).pipe(
      catchError(this.handleError)
    );
  }

}
