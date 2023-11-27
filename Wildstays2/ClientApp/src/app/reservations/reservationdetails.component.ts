import {Component, ViewChild} from '@angular/core';
import { ReservationService } from './reservations.service';
import { ActivatedRoute, Router } from '@angular/router';
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {BookedReservations} from "./bookedReservations";
import {EventMountArg} from "@fullcalendar/core";

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
      this.getDetails(this.id);
      this.initializeCalendar();
      this.loadReservations();
    });
    setTimeout(() => {
      this.updateCalendarEvents();
    },  200);
  }

  private loadReservations(): void {
    this._reservationService.getReservationsByListingId(35).subscribe(data => {
      this.bookedReservation = data;
      console.log('Updated bookedReservation:', this.bookedReservation);
    }, error => {
      console.error('Error fetching reservations:', error);
    });
  }



  public updateCalendarEvents(): void {
    const events = this.transformToEvents();

    if (this.calendarComponent && this.calendarComponent.getApi()) {
      const calendarApi = this.calendarComponent.getApi();
      events.forEach(event => calendarApi.addEvent(event));
    }

  }



  public transformToEvents(): any[] {
    return this.bookedReservation.map(reservations => {
      let endDate = new Date(reservations.EndDate);
      endDate = new Date(endDate.setDate(endDate.getDate() + 1));

      return {
        title:"BOOKED",
        start: new Date(reservations.StartDate).toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        display: 'background',
        color: "#B22222",
      };
    });

  }

  getDetails(id: number): void {
    this._reservationService.getListingDetails(id)
      .subscribe(data => {
        this.reservation = data;
      });
  }

  private initializeCalendar(): void {
    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: 'dayGridMonth',
      fixedWeekCount: false,
      displayEventTime: false,
      selectable: true,
      select: this.handleDateSelect.bind(this),
      nowIndicator: true,
      events: [],
      weekNumberCalculation: 'ISO',
      eventDidMount: function (info: EventMountArg) {
        if (info.event.display === 'background') {
          info.el.style.opacity = '0.8';
        }
      },
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
