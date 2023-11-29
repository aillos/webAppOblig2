// Import ElementRef and Renderer2 from '@angular/core'
import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
import { ReservationService } from './reservations.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})

export class ReservationsComponent implements OnInit {
  reservations: any[] = [];
  filters: any = {}; // Object to store filter values
  isFilterFormVisible = false; // Set it to false by default
  public imageObjects: Array<object> = [];

  constructor(
    private _reservationService: ReservationService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Initial load of reservations
    this.getIndexListings();
    this.route.queryParams.subscribe(params => {

      this.filters.place = params['place'] || '';
      this.filters.startDate = params['startDate'] || '';
      this.filters.endDate = params['endDate'] || '';

      this.applyFilters();
    });
  }

  getIndexListings(): void {
    this._reservationService.getIndexListings().subscribe(data => {
      this.reservations = data;
      this.reservations.forEach(reservation => {
        this.loadImagesForReservation(reservation);
        console.log(this.reservations);
      });
    });
  }

  private loadImagesForReservation(reservation: any): void {
    this._reservationService.getImagesById(reservation.Id).subscribe(images => {
      reservation.images = images.map(img => ({ path: img.FilePath }));
    });
  }

  // Initialize isFilterFormVisible to false in your component


  toggleFilterForm() {
    // Toggle visibility using Angular Renderer
    this.isFilterFormVisible = !this.isFilterFormVisible;
  }


  applyFilters() {
    // Other reset logic for different filters can be added here

    // Call API with filters
    this._reservationService.getFilteredReservations(this.filters).subscribe(
      (data: any) => {
        // Handle the filtered data
        this.reservations = data;
      },
      (error) => {
        console.error('Error fetching filtered reservations:', error);
      }
    );
  }


}
