﻿using Wildstays2.Models;

namespace Wildstays2.DAL;

public interface IItemRepository
{
    Task<IEnumerable<Listing>> GetAll();
    Task<Listing?> GetItemById(int id);
    Task<IEnumerable<Listing>> GetListingsByUserId(string userId);
    Task<IEnumerable<Reservation>> GetReservationByUserId(string userId);
    Task<IEnumerable<Reservation>> GetReservationByPlace(string place);
    Task<bool> Create(Listing listing, List<IFormFile> Images);
    Task<bool> Update(Listing existingListing, Listing updatedListing, List<IFormFile> newImages, int? imageToDeleteId);
    Task<bool> Delete(int id);
    Task<bool> DeleteImage(int imageId);
    Task<IEnumerable<Image>> GetImagesByListingId(int listingId);


    Task<bool> CreateReservation(Reservation reservation);
    bool DateCheck(DateTime startDate);
    bool StartEndCheck(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Listing>> FilterListings(String? Place, int? AmountGuests, int? AmountBathrooms, int? AmountBedrooms,int? MinPrice, int? MaxPrice, DateTime? StartDate, DateTime? EndDate );

    Task<IEnumerable<Image>> GetImages();
    Task<IEnumerable<Reservation>> GetReservations();

}


