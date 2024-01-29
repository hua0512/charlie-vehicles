import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {throwError} from "rxjs";


export class BaseService {

  constructor(protected http: HttpClient) {
  }

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      if (error.error) {
        console.error(`Backend returned code ${error.status}, body was: ${error.error.message}`);
        if (error.error.message) {
          return throwError(() => error.error.message);
        }
        return throwError(() => error.error);
      } else {
        console.error(`Backend returned code ${error.status}, body was: ${error.message}`);
        return throwError(() => error.message);
      }
    }
    // Return an observable with a user-facing error message.
    return throwError(() => 'Something bad happened; please try again later.');
  }
}
