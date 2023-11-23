import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { RReservation } from "./reservation";
import { ReservationService } from "./reservations.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../styles.css']
})
export class HomeComponent implements OnInit {
  public searchTerm: string = '';
  public startDate: string = '';
  public endDate: string = '';
  public calendarOptions: any;
  public reservations: RReservation[] = [];

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  constructor(private reservationService: ReservationService) {}

  private loadReservations(): void {
    this.reservationService.getReservations().subscribe(data => {
      this.reservations = data;
      this.updateCalendarEvents();
    });
  }

  ngOnInit(): void {
    this.loadReservations();
    this.initializeCalendar();
  }

  private initializeCalendar(): void {
    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: 'dayGridMonth',
      fixedWeekCount: false,
      timeFormat: 'H(:mm)',
      displayEventTime: false,
      selectable: true,
      select: this.handleDateSelect.bind(this),
      events: []
    };
  }

  public updateCalendarEvents(): void {
    const events = this.searchTerm
      ? this.transformToEvents().filter(event => event.place.toLowerCase() === this.searchTerm.toLowerCase())
      : [];

    if (this.calendarComponent && this.calendarComponent.getApi()) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      events.forEach(event => calendarApi.addEvent(event));
    }
  }



  public transformToEvents(): any[] {
    return this.reservations.map(reservation => {
      let endDate = new Date(reservation.EndDate);
      endDate = new Date(endDate.setDate(endDate.getDate() + 1));

      return {
        title: "Listing: " + reservation.Id,
        start: new Date(reservation.StartDate).toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        display: 'background',
        color: 'red',
        place: reservation.Place
      };
    });
  }


  private handleDateSelect(selectInfo: any): void {
    const startDate = selectInfo.startStr;
    const endDate = selectInfo.endStr;
    this.startDate = startDate;
    this.endDate = endDate;

    const eventsDuringSelection = this.reservations.filter(reservation => {
      const eventStart = new Date(reservation.StartDate);
      const eventEnd = new Date(reservation.EndDate);
      return eventStart < selectInfo.end && eventEnd > selectInfo.start;
    });

    if (eventsDuringSelection.length > 0) {
      alert('Selection includes a reserved date!');
    }
  }
}
