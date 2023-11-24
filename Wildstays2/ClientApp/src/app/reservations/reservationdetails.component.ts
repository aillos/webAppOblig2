import {Component, ViewChild} from '@angular/core';
import { ReservationService } from './reservations.service';
import { ActivatedRoute, Router } from '@angular/router';
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {BookedReservations} from "./bookedReservations";

@Component({
  selector: 'app-reservationdetails-component',
  templateUrl: './reservationdetails.component.html',
  styleUrls: ['./reservationdetails.component.css']
})

export class ReservationdetailsComponent {

  id: number = 0;
  reservation: any;
  public calendarOptions: any;
  public startDate: string = '';
  public endDate: string = '';
  public bookedReservation: BookedReservations[] = [];

  @ViewChild('calendar2') calendarComponent!: FullCalendarComponent;
  constructor(
    private _reservationService: ReservationService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.id = +params['id'];
      this.loadItem(this.id);
      this.loadReservations();
    });
    this.initializeCalendar();
  }

  private loadReservations(): void {
    this._reservationService.getReservationsByListingId(this.id).subscribe(data => {
      this.bookedReservation = data;
      console.log('Updated bookedReservation:', this.bookedReservation);
      this.updateCalendarEvents();
    }, error => {
      console.error('Error fetching reservations:', error);
    });
  }



  public updateCalendarEvents(): void {
    const events = this.transformToEvents();

    if (this.calendarComponent && this.calendarComponent.getApi()) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      events.forEach(event => calendarApi.addEvent(event));
    }
  }



  public transformToEvents(): any[] {
    return this.bookedReservation.map(reservations => {
      let endDate = new Date(reservations.EndDate);
      endDate = new Date(endDate.setDate(endDate.getDate() + 1));

      return {
        title: "Listing: " + reservations.ListingId,
        start: new Date(reservations.StartDate).toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        display: 'background',
        color: 'red',
      };
    });
  }

  loadItem(id: number) {
    this._reservationService.getReservationById(id)
      .subscribe(
        (data: any) => {
          this.reservation = data;
        },
        error => {
          console.error('Error fetching reservation:', error);
        }
      );
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
      nowIndicator: true,
      events: []
    };
  }

  private handleDateSelect(selectInfo: { startStr: string, endStr: string, start: Date, end: Date }): void {
    const startDate = new Date(selectInfo.startStr);
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    if (startDate < currentDate) {
      alert('The selected start date is in the past.');
    } else {
      this.startDate = selectInfo.startStr;
      this.endDate = selectInfo.endStr;
    }
  }
}
