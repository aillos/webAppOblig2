import {Component, ViewChild} from '@angular/core';
import { ReservationService } from './reservations.service';
import { ActivatedRoute, Router } from '@angular/router';
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {BookedReservations} from "./bookedReservations";
import {EventMountArg} from "@fullcalendar/core";
import {Image} from "angular-responsive-carousel";

@Component({
  selector: 'app-reservationdetails-component',
  templateUrl: './reservationdetails.component.html',
  styleUrls: ['./reservationdetails.component.css']
})

export class ReservationdetailsComponent {

  id: number = 0;
  reservation: any;
  public images: { path: string }[] = [];
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
      this.loadImages();
    });
    setTimeout(() => {
      this.updateCalendarEvents();
    },  200);
  }

  //Loading current reservations for the listingId
  private loadReservations(): void {
    this._reservationService.getReservationsByListingId(this.id).subscribe(data => {
      this.bookedReservation = data;
      console.log('Updated bookedReservation:', this.bookedReservation);
    }, error => {
      console.error('Error fetching reservations:', error);
    });
  }

  //Loading images corresponding with listingId
  private loadImages(): void{
    this._reservationService.getImagesById(this.id).subscribe(data => {
      this.images = data.map(img => ({ path: img.FilePath }));
    });
    console.log(this.images);
  }


  //Updating calendar to include events
  public updateCalendarEvents(): void {
    const events = this.transformToEvents();

    if (this.calendarComponent && this.calendarComponent.getApi()) {
      const calendarApi = this.calendarComponent.getApi();
      events.forEach(event => calendarApi.addEvent(event));
    }

  }


  //Transforming reservation to event
  public transformToEvents(): any[] {
    return this.bookedReservation.map(reservations => {
      let endDate = new Date(reservations.EndDate);
      endDate = new Date(endDate.setDate(endDate.getDate() + 1));

      return {
        title: "BOOKED",
        start: new Date(reservations.StartDate).toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        display: 'background',
        color: "#B22222",
      };
    });

  }

  //Getting the details for listing
  getDetails(id: number): void {
    this._reservationService.getListingDetails(id)
      .subscribe(data => {
        this.reservation = data;
      });
  }

  navigateToReservations() {
    this._router.navigate(['/reservations']);
  }

  //Calendar settings, background color is darker here as it only needs to indicate one reservation instead of many
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

  //Handling data select for calendar
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
