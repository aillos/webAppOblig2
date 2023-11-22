import { Component } from '@angular/core';
import { ReservationService } from './reservations.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservationdetails-component',
  templateUrl: './reservationdetails.component.html',
  styleUrls: ['./reservationdetails.component.css']
})

export class ReservationdetailsComponent {

  id: number = 0;
  reservation: any;
  constructor(
    private _reservationService: ReservationService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.id = +params['id'];
      this.loadItem(this.id);
    })
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
}
