import { Component, OnInit } from '@angular/core';
import { RReservation } from './reservation';
import { ReservationService } from './reservations.service';

@Component({
  selector: 'app-reservations-component',
  templateUrl: './reservations.component.html',
})

export class ReservationsComponent implements OnInit {
  reservations: RReservation[] = [];

  constructor(
    private _reservationService: ReservationService) { }

  getReservations(): void {
    this._reservationService.getReservations()
      .subscribe(data => {
        this.reservations = data;
      });
  }
  ngOnInit(): void {
    this.getReservations();
  }
}
