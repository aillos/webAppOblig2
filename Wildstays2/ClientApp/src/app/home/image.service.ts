import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RReservation } from './reservation';
import {IImages} from "./images";

@Injectable({
  providedIn: 'root'
})

export class ImageService {

  private baseUrl = 'api/home/images';

  constructor(private _http: HttpClient) { }

  getImages(): Observable<IImages[]> {
    return this._http.get<IImages[]>(this.baseUrl);
  }
}
