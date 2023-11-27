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
  place: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(
    private _reservationService: ReservationService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Initial load of reservations
    this.loadReservations();
    this.route.queryParams.subscribe(params => {
      this.filters.place = params['searchTerm'] || '';
      this.filters.startDate = params['startDate'] || '';
      this.filters.endDate = params['endDate'] || '';

      this.applyFilters();
    });
  }

  loadReservations() {
    this._reservationService.getReservations().subscribe(
      (data: any) => {
        this.reservations = data;
      },
      error => {
        console.error('Error fetching reservations:', error);
      }
    );
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
