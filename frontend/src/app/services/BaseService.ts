import {HttpClient, HttpHeaders} from "@angular/common/http";


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
}
