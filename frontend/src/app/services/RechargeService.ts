import {Injectable} from "@angular/core";
import {BaseService} from "./BaseService";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {catchError, Observable} from "rxjs";
import {Recharge} from "../models/recharge.model";

@Injectable({
  providedIn: 'root',
})
export class RechargeService extends BaseService {

  private static readonly RECHARGE_API_URL = `${environment.rechargeApiUrl}`;

  constructor(http: HttpClient) {
    super(http);
  }

  getRechargeByUser(userId: number) {
    if (!userId) {
      throw new Error('User id is required');
    }
    return this.http.get<Recharge[]>(RechargeService.RECHARGE_API_URL + `?userId=${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  getRechargeById(id: number): Observable<Recharge> {
    if (!id) {
      throw new Error('Recharge id is required');
    }
    return this.http.get<Recharge>(`${RechargeService.RECHARGE_API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  newRecharge(recharge: Recharge) {
    return this.http.post<Recharge>(RechargeService.RECHARGE_API_URL, recharge).pipe(
      catchError(this.handleError)
    );
  }

  updateRecharge(recharge: Recharge) {
    return this.http.put<Recharge>(`${RechargeService.RECHARGE_API_URL}/${recharge.id}`, recharge).pipe(
      catchError(this.handleError)
    );
  }
}
