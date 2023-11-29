import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RReservation } from './reservation';
import {BookedReservations} from "./bookedReservations";
import {IImages} from "./images";

@Injectable({
  providedIn: 'root'
})

export class ReservationService {

  private baseUrl = 'api/reservations';

  constructor(private _http: HttpClient) { }

  getReservations(): Observable<RReservation[]> {
    return this._http.get<RReservation[]>(this.baseUrl);
  }

    getFilteredReservations(filterOptions: any): Observable<RReservation[]> {
    let params = new HttpParams();

    // Handle 'All' case for Place filter
    if (filterOptions.place !== undefined && filterOptions.place !== 'All') {
      params = params.set('Place', filterOptions.place);
    }

    // Handle 'All' case for AmountGuests filter
    if (filterOptions.amountGuests !== undefined && filterOptions.amountGuests !== 'All') {
      params = params.set('AmountGuests', filterOptions.amountGuests);
    }

    params = params
      .set('AmountBathrooms', filterOptions.amountBathrooms || '')
      .set('AmountBedrooms', filterOptions.amountBedrooms || '')
      .set('MinPrice', filterOptions.minPrice || '')
      .set('MaxPrice', filterOptions.maxPrice || '')
      .set('StartDate', filterOptions.startDate ? filterOptions.startDate.toISOString() : '')
      .set('EndDate', filterOptions.endDate ? filterOptions.endDate.toISOString() : '');

    return this._http.get<RReservation[]>(`${this.baseUrl}/index`, { params });
  }

  //Getting all listings
  getIndexListings(): Observable<RReservation[]> {
    return this._http.get<RReservation[]>(`${this.baseUrl}/index`);
  }

  //Getting details about listing
  getListingDetails(id: number): Observable<any> {
    return this._http.get(`${this.baseUrl}/details/${id}`);
  }

  //Getting reservations by ListingId
  getReservationsByListingId(Id: number): Observable<BookedReservations[]> {
    const url = `${this.baseUrl}/res/${Id}`;
    return this._http.get<BookedReservations[]>(url);
  }

  //Getting images based on listingId
  getImagesById(Id: number): Observable<IImages[]> {
    const url = `${this.baseUrl}/images/${Id}`;
    return this._http.get<IImages[]>(url);
  }


}
