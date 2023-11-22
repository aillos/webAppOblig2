import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RReservation } from './reservation';

@Injectable({
  providedIn: 'root'
})

export class ReservationService {

  private baseUrl = 'api/reservations';

  constructor(private _http: HttpClient) { }

  getReservations(): Observable<RReservation[]> {
    return this._http.get<RReservation[]>(this.baseUrl);
  }

  getReservationById(Id: number): Observable<any> {
    const url = `${this.baseUrl}/${Id}`;
    return this._http.get(url);
  }
}
