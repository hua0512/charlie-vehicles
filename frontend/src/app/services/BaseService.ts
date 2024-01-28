import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {throwError} from "rxjs";


export class BaseService {

    private _corsHeaders = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': '*',
    });

    constructor(protected http: HttpClient) {
        httpOptions: {
            headers: this._corsHeaders;
        }

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
        return throwError(() => error.error.message);
      }
    }
    // Return an observable with a user-facing error message.
    return throwError(() => 'Something bad happened; please try again later.');
  }
}
