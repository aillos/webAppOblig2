import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { RReservation } from "./reservation";
import { ReservationService } from "./reservations.service";
import {Router} from "@angular/router";
import {ImageService} from "./image.service";
import {IImages} from "./images";

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
  public images: { path: string }[] = [];

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  constructor(private reservationService: ReservationService, private _router:Router, private imageService: ImageService) {
  }

  navigateToReservations(){
    this._router.navigate(['/reservations'])
  }
  private loadReservations(): void {
    this.reservationService.getReservations().subscribe(data => {
      this.reservations = data;
      this.updateCalendarEvents();
    });
  }
  private loadImages(): void {
    this.imageService.getImages().subscribe(data => {
      this.images = data.map(img => ({ path: img.FilePath }));
    });
  }

  ngOnInit(): void {
    this.loadImages();
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
      nowIndicator: true,
      events: [],
      weekNumberCalculation: 'ISO'
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
        //title: "Listing: " + reservation.ListingId,
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
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    if (startDate < currentDate) {
      alert('The selected start date is in the past.');
    } else {
      this.startDate = selectInfo.startStr;
      this.endDate = selectInfo.endStr;
    }
  }


  public onSearch(){}
}
