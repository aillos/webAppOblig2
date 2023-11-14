import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../styles.css']
})
export class HomeComponent {
  public searchTerm: string = '';
  public startDate: string = '';
  public endDate: string = '';
  public reservations: any[] = []; // Replace 'any' with appropriate type for reservations

  calendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
  };

  ngOnInit(): void {
    // Load initial data here, e.g., this.loadReservations();
  }

  private loadReservations(): void {
    // Fetch reservations from a service and populate the 'resnpmervations' array
    // Example: this.reservationService.getReservations().subscribe(data => this.reservations = data);
  }

  onSearch(): void {
    // Add logic to handle search
    // Example: filter the reservations based on the search term
  }

  onSelectDates(startDate: string, endDate: string): void {
    this.startDate = startDate;
    this.endDate = endDate;
    // Add logic to handle date selection
  }
}
