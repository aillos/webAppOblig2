import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { FullCalendarModule } from "@fullcalendar/angular";
import { ReservationsComponent } from './reservations/reservations.component';
import { ReservationdetailsComponent } from './reservations/reservationdetails.component';
import {NgOptimizedImage} from "@angular/common";
import { ConvertToCurrency } from './shared/convert-to-currency.pipe';
import { NgImageSliderModule } from 'ng-image-slider';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ReservationsComponent,
    ReservationdetailsComponent,
    ConvertToCurrency
  ],
    imports: [
        BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
        HttpClientModule,
        FormsModule,
        FullCalendarModule,
        NgImageSliderModule,
        RouterModule.forRoot([
            {path: '', component: HomeComponent, pathMatch: 'full'},
            {path: 'reservations', component: ReservationsComponent},
            {path: 'reservationdetails', component: ReservationdetailsComponent},
            {path: 'reservations/details/:id', component: ReservationdetailsComponent },
        ]),
        NgOptimizedImage
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
