import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RReservation } from './reservation';
import {IImages} from "../reservations/images";

@Injectable({
  providedIn: 'root'
})

export class ReservationService {

  private baseUrl = 'api/home/reservations';

  constructor(private _http: HttpClient) { }

  //Getting all reservations
  getReservations(): Observable<RReservation[]> {
    return this._http.get<RReservation[]>(this.baseUrl);
  }

  //Getting all images
  getImages(): Observable<IImages[]> {
    return this._http.get<IImages[]>('api/home/images');
  }
}
