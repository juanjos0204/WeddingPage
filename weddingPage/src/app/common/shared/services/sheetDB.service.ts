// sheetdb.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SheetdbService {

  private apiUrl = 'https://sheetdb.io/api/v1/lcm6km17fryvf';

  constructor(private http: HttpClient) { }

  postGuestData(attendance: string, name: string, email?: string, cellphone?: string, companion?: string): Observable<any> {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {
      data: [
        {
          id: "INCREMENT",
          nombre: name,
          email: email || null,
          telefono: cellphone || null,
          asiste: attendance,
          acompañante: companion || null
        }
      ]
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
