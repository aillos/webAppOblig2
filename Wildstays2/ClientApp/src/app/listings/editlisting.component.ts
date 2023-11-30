import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ListingService } from './listings.service';
import { Listing } from './listing';
import { IImages } from '../reservations/images';

@Component({
  selector: 'app-listing-edit',
  templateUrl: './editlisting.component.html'
})
export class ListingEditComponent implements OnInit {
  id: number = 0;
  images: IImages[] = [];
  imageInputs: File[] = [];
  errorMessage: string = '';
  submitted = false;
  listing!: Listing;

  constructor(
    private listingService: ListingService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    // Use a '+' to coerce the string from paramMap.get to a number.
    this.id = +this._route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.loadListing(this.id);
      this.loadImages(this.id);
    }
  }

  addImageInput() {
    this.imageInputs.push(new File([], ''));
  }

  handleImageChange(event: any, index?: number): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        if (index !== undefined) {
          this.imageInputs[index] = file;
        } else {
          this.imageInputs.push(file);
        }
      }
    }
  }

  deleteImage(imageId: number): void {
    this.listingService.deleteImage(this.id, imageId).subscribe(
      () => {
        this.images = this.images.filter(image => image.Id !== imageId);
      },
      error => {
        console.error(error);
        this.errorMessage = error.message;
      }
    );
  }


  loadListing(id: number) {
    this.listingService.getListingDetails(id).subscribe(
      data => {
        this.listing = data;
        console.log(this.listing)
      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }

  loadImages(id: number) {
    this.listingService.getImagesById(id).subscribe(
      data => {
        this.images = data;
      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }

  onSubmit(): void {
    this.listingService.updateListingEdit(this.id, this.listing, this.imageInputs).subscribe(() => {
      this._router.navigate(['/listings']);
    });
  }

  deleteListing() {
    this.listingService.deleteListing(this.id).subscribe(
      () => {

      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }

  backToList(){
    this._router.navigate(['/listings']);
  }

}
