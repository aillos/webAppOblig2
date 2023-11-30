import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from './listings.service';

@Component({
  selector: "app-listings-listingform",
  templateUrl: "./listingform.component.html"
})
export class ListingformComponent {
  listingForm: FormGroup;
  isEditMode: boolean = false;
  ListingId: number = -1;

  constructor(
    private _formbuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _listingService: ListingService
  ) {
    this.listingForm = _formbuilder.group({
      name: [''],
      place: [''],
      description: [''],
      type: [''],
      price: [0],
      guests: [0],
      bedrooms: [0],
      bathrooms: [0],
      startDate: [null],
      endDate: [null],
      images: ['']  // Use FormArray for Images
    });
  }

  onSubmit() {
    console.log("ItemCreate form submitted:");
    console.log(this.listingForm);
    const newListing = this.listingForm.value;

    if (this.isEditMode) {
      this._listingService.updateListing(this.ListingId, newListing)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(['/listings']);
          }
          else {
            console.log('listing update failed');
          }
        });
    }
    else {
      this._listingService.createListing(newListing)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(['/listings']);
          }
          else {
            console.log('Listing creation failed');
          }
        });
    }
  }

  backToListings() {
    this._router.navigate(['/listings']);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      if (params['mode'] === 'create') {
        this.isEditMode = false; // Create mode
      } else if (params['mode'] === 'edit') {
        this.isEditMode = true; // Edit mode
        this.ListingId = +params['id']; // Convert to number
        this.loadListingForEdit(this.ListingId);
      }
    });
  }

  loadListingForEdit(Id: number) {
    this._listingService.getListingDetails(Id)
      .subscribe(
        (listing: any) => {
          console.log('Retrieved listing: ', listing);
          this.listingForm.patchValue({
            name: listing.name,
            place: listing.place,
            description: listing.description,
            type: listing.type,
            price: listing.price,
            guests: listing.guests,
            bedrooms: listing.bedrooms,
            bathrooms: listing.bathrooms,
            startDate: listing.startDate,
            endDate: listing.endDate,
            images: listing.images  // Make sure this matches the form control name
          });
        },
        (error: any) => {
          console.error('Error loading listing for edit:', error);
        }
      );


  }

}
