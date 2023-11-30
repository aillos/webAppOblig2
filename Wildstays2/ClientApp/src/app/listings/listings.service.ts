import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { Listing } from './listing';
import {IImages} from "../reservations/images";

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private baseUrl = 'api/listings';

  constructor(private _http: HttpClient) {}

  updateListingEdit(id: number, listing: Listing, images: File[], deleteImageId?: number): Observable<any> {
    const formData = new FormData();
    formData.append('listing', JSON.stringify(listing));
    images.forEach((file, index) => formData.append(`Images[${index}]`, file, file.name));

    if (deleteImageId !== undefined) {
      formData.append('deleteImage', deleteImageId.toString());
    }

    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
    return this._http.put(`${this.baseUrl}/edit/${id}`, formData, { headers });
  }

  updateListing(Id: number, newListing: any): Observable<any> {
    const url = `${this.baseUrl}/update/${Id};`
    newListing.Id = Id;
    return this._http.put<any>(url, newListing).pipe(
      catchError((error) => {
        console.error('Error updating listing:', error);
        return throwError('Listing update failed');
      })
    );
  }

  getListingDetails(id: number): Observable<any> {
    return this._http.get(`${this.baseUrl}/details/${id}`);
  }

  deleteImage(listingId: number, imageId: number): Observable<any> {
    const url = `${this.baseUrl}/edit/${listingId}?deleteImage=${imageId}`;

    return this._http.delete(url);
  }

  getImagesById(Id: number): Observable<IImages[]> {
    const url = `${this.baseUrl}/images/${Id}`;
    return this._http.get<IImages[]>(url);
  }

  deleteListing(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/delete/${id}`);
  }

  getListings(): Observable<Listing[]> {
    return this._http.get<Listing[]>(this.baseUrl);
  }

  createListing(newListing: Listing): Observable<any> {
    const createUrl = 'api/listing/create';
    return this._http.post<any>(createUrl, newListing).pipe(
      catchError((error) => {
        console.error('Error creating listing:', error);
        return throwError('Listing creation failed');
      })
    );
  }
}
