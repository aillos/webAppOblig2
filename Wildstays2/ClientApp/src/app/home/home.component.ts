import { Component, OnInit } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../styles.css']
})
export class HomeComponent implements OnInit {
  public searchTerm: string = '';
  public startDate: string = '';
  public endDate: string = '';
  public reservations: any[] = []; // Replace 'any' with the appropriate type for reservations
  public calendarOptions: any;

 // constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    //this.loadReservations();
    this.initializeCalendar();
  }

 /* private loadReservations(): void {
    // Fetch reservations from a service and populate the 'reservations' array
    this.reservationService.getReservations().subscribe(data => {
      this.reservations = data;
      this.updateCalendarEvents();
    });
  }*/

  private initializeCalendar(): void {
    this.calendarOptions = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
      ],
      initialView: 'dayGridMonth',
      selectable: true,
      select: this.handleDateSelect.bind(this)
    };
  }

  private handleDateSelect(selectInfo: any): void {
    const startDate = selectInfo.startStr;
    const endDate = selectInfo.endStr;
    this.startDate = startDate;
    this.endDate = endDate;

    const eventsDuringSelection = this.reservations.filter(reservation => {
      const eventStart = new Date(reservation.start);
      const eventEnd = new Date(reservation.end);
      return eventStart < selectInfo.end && eventEnd > selectInfo.start;
    });

    if (eventsDuringSelection.length > 0) {
      alert('Selection includes a reserved date!');
    }
  }

  private updateCalendarEvents(): void {
    // Update the calendar with events from the reservations array
  }

  public onSearch(): void {
    // Filter reservations based on the search term and update the calendar
  }
}
