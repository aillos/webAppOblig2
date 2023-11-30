export interface Listing {
  id: number;
  name: string;
  place: string;
  description: string;
  type: string;
  price: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  startDate: Date;
  endDate: Date;
  images: string;
}
