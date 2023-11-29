import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { RReservation } from "./reservation";
import { ReservationService } from "./reservations.service";
import {Router} from "@angular/router";

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
  public imageObjects: Array<object> = [];

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  constructor(private reservationService: ReservationService, private _router:Router) {
  }

  //Sending us to reservations with filters in place
  navigateToReservations(){
    this._router.navigate(['/reservations'], {
    queryParams: {
        place: this.searchTerm,
        startDate: this.startDate,
        endDate: this.endDate
    }
    });
  }
  //Loading in reservations and updating the calendar events to reflect current reservations
  private loadReservations(): void {
    this.reservationService.getReservations().subscribe(data => {
      this.reservations = data;
      this.updateCalendarEvents();
    });
  }
  //Loading images for use in the image carousel
  private loadImages(): void {
    this.reservationService.getImages().subscribe(data => {
      this.imageObjects = data.map(img => ({
        image: img.FilePath,
        thumbImage: img.FilePath,
        title: img.ListingId,
        alt: img.ListingId
      }));
    });
  }

  ngOnInit(): void {
    this.loadImages();
    this.loadReservations();
    this.initializeCalendar();
  }

  //Settings for the calendar
  private initializeCalendar(): void {
    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: 'dayGridMonth',
      fixedWeekCount: false,
      timeFormat: 'H(:mm)',
      displayEventTime: false,
      selectable: true,
      select: this.handleDateSelect.bind(this),
      nowIndicator: true,
      events: [],
      weekNumberCalculation: 'ISO'
    };
  }

  //Updating calendar events and filtering by the "searchTerm"
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

  //Transforming the reservations to use for events, Also adding background color to indicate reservation on said dates.
  public transformToEvents(): any[] {
    return this.reservations.map(reservation => {
      let endDate = new Date(reservation.EndDate);
      endDate = new Date(endDate.setDate(endDate.getDate() + 1));

      return {
        //title: "Listing: " + reservation.ListingId, - OPTIONAL
        start: new Date(reservation.StartDate).toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        display: 'background',
        color: 'red',
        place: reservation.Place
      };
    });
  }


  private handleDateSelect(selectInfo: { startStr: string, endStr: string, start: Date, end: Date }): void {
    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(selectInfo.endStr);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (startDate < currentDate) {
      alert('The selected start date is in the past.');
    } else {
      this.startDate = selectInfo.startStr;
      endDate.setDate(endDate.getDate() - 1);
      this.endDate = endDate.toISOString().split('T')[0];
    }
  }
}
