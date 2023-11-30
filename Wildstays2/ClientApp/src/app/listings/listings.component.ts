import { Component, OnInit } from '@angular/core';
import { Listing } from './listing';
import { Router } from '@angular/router';
import { ListingService } from './listings.service';

@Component({
  selector: 'app-listings-component',
  templateUrl: './listings.component.html',
})
export class ListingsComponent implements OnInit {
  viewTitle: string = 'Table';
  displayImage: boolean = true;
  listings: Listing[] = [];

  constructor(private _router: Router, private _listingService: ListingService) { }

  deleteListing(listing: Listing): void {
    const confirmDelete = confirm(`Are you sure you want to delete "${listing.name}"?`);
    if (confirmDelete) {
      this._listingService.deleteListing(listing.id).subscribe(
        (response) => {
          if (response.success) {
            console.log(response.message);
            this.listings = this.listings.filter((i) => i !== listing);
          }
        },
        (error) => {
          console.error('Error deleting listing:', error);
        }
      );
    }
  }

  getListings(): void {
    this._listingService.getListings().subscribe((data) => {
      console.log('All', JSON.stringify(data));
      this.listings = data;
    });
  }

  toggleImage(): void {
    this.displayImage = !this.displayImage;
  }

  navigateToListingForm() {
    this._router.navigate(['/listingform']);
  }

  ngOnInit(): void {
    this.getListings();
  }
}
