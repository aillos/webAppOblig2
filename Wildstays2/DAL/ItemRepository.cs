﻿using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using NuGet.Packaging;
using Wildstays2.Models;

namespace Wildstays2.DAL;

public class ItemRepository : IItemRepository
{
    private readonly DatabaseDbContext _db;
    private readonly IWebHostEnvironment _webHostEnvironment;

    private readonly ILogger<ItemRepository> _logger;

    public ItemRepository(DatabaseDbContext db, ILogger<ItemRepository> logger, IWebHostEnvironment webHostEnvironment)
    {
        _db = db;
        _logger = logger;
        _webHostEnvironment = webHostEnvironment;
    }

    //Same method as in the demo from module 6, gets all listings.
    public async Task<IEnumerable<Listing>?> GetAll()
    {
        try
        {
            return await _db.Listings.ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] failed to get all items, error message: {e}", e.Message);
            return null;
        }

    }
    //Same method as in the demo from module 6, gets a listing based on the item id.
    public async Task<Listing?> GetItemById(int id)
    {
        try
        {
            return await _db.Listings.FindAsync(id);
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] failed to get item by Id {ItemId:0000}, error message: {e}", id, e.Message);
            return null;
        }

    }

    //Same method as in module 6, but added in the image logic so that users can add multiple images/pictures
    public async Task<bool> Create(Listing listing)
    {
        try
        {
            _db.Listings.Add(listing);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Listing created successfully.");

            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] failed to create the listing {@listing}, error message: {e}", listing, e.Message);
            return false;
        }
    }

    //Action used for deleting images, used in the edit and delete methods for the listings/images
    public async Task<bool> DeleteImage(int Id)
    {
        try
        {
            //FInds the images associated with the listing
            var image = await _db.Images.FindAsync(Id);
            if (image != null)
            {
                //Finds the fullpath to the folder
                var folder = Path.Combine(_webHostEnvironment.WebRootPath);
                //Combines the path to the folder with the image and deletes it from the folder.
                File.Delete(folder + image.FilePath);

                //Removes the picture from the database.
                _db.Images.Remove(image);
                await _db.SaveChangesAsync();
                return true;
            }
            return false;
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] failed to delete the image, error message: {e}", e.Message);
            return false;
        }
    }


    //Modified the method from the module as i was getting detach issues when updating, similar to the delete method.
    public async Task<bool> Update(Listing existingListing, Listing updatedListing)
    {
        try
        {

            // Handle image upload, same as the create method
            

            // Update the properties of the existing listing with the new values
            existingListing.Name = updatedListing.Name;
            existingListing.Place = updatedListing.Place;
            existingListing.Description = updatedListing.Description;
            existingListing.Type = updatedListing.Type;
            existingListing.Price = updatedListing.Price;
            existingListing.Guests = updatedListing.Guests;
            existingListing.Bedrooms = updatedListing.Bedrooms;
            existingListing.Bathrooms = updatedListing.Bathrooms;
            existingListing.StartDate = updatedListing.StartDate;
            existingListing.EndDate = updatedListing.EndDate;

            // Add new images

            // Save the changes to the database
            await _db.SaveChangesAsync();

            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] failed to update the listing and images, error message: {e}", e.Message);
            return false;
        }
    }



    //Delete method, same as in module 6, but added the DeleteImage method to delete the images
    public async Task<bool> Delete(int id)
    {
        try
        {
            var listing = await _db.Listings.FindAsync(id);

            if (listing == null)
            {
                _logger.LogError("[ItemRepository] could not find the item with item Id {ItemId:0000}", id);
                return false;
            }

            // Gets images based on the listing id
            var images = await GetImagesByListingId(id);

            foreach (var image in images)
            {
                // Delete the image using the DeleteImage method
                await DeleteImage(image.Id);
            }

            // Remove the listing
            _db.Listings.Remove(listing);

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] Failed to delete the item with the Id {ItemId:0000}, error message: {e}", id, e.Message);
            return false;
        }
    }



    //Method to get a listing by userId, used to show only show a user their listings
    public async Task<IEnumerable<Listing>?> GetListingsByUserId(string userId)
    {
        try
        {
            //Lamda expression to fetch listings with userId matching the currently logged in users Id.
            return await _db.Listings.ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] Failed to get the listings based on the spescific user(Id), error message: {e}", e.Message);
            return null;
        }
    }


    //Method to get reservations by user id.
    public async Task<IEnumerable<Reservation>> GetReservationByUserId(string userId)
    {
        try
        {
            //Also lamda expressions to get reservations with the users userId, but also gets information from the listings database assosiated with the reservation.
            return await _db.Reservations.Include(r => r.Listing).ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] Failed to find the reservation based on UserID error message: {e}", e.Message);
            return null;
        }

    }
    
    public async Task<IEnumerable<Reservation>> GetReservationsByListingId(int listingId)
    {
        try
        {
            return await _db.Reservations.Where(r => r.ListingId == listingId).ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] Failed to find the reservation based on ListingID error message: {e}", e.Message);
            return null;
        }

    }
    //Method to get images based on the listind id
    public async Task<IEnumerable<Image>> GetImagesByListingId(int listingId)
    {
        try
        {
            // lambda expressioon to fetch Images with the specified ListingId
            return await _db.Images.Where(i => i.ListingId == listingId).ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] Failed to get images by ListingId {ListingId:0000}, error message: {e}", listingId, e.Message);
            return null;
        }
    }

    
    public async Task<IEnumerable<Image>> GetImages()
    {
        try
        {
            // fetching images
            return await _db.Images.ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] Failed to get images, error message: {e}", e.Message);
            return null;
        }
    }
    
    // IItemRepository
    public async Task<bool> CreateReservation(Reservation reservation)
    {
        try
        {
            // Check if the listing is available between the specified dates. 
            bool isAvailable = !_db.Reservations.Any(r =>
                r.ListingId == reservation.ListingId &&
                ((reservation.StartDate >= r.StartDate && reservation.StartDate <= r.EndDate) ||
                 (reservation.EndDate >= r.StartDate && reservation.EndDate <= r.EndDate)));

            if (isAvailable)
            {
                // Retrieve the associated listing
                var listing = await _db.Listings.FindAsync(reservation.ListingId);

                if (listing != null)
                {
                    // Set the 'Place' for the reservation based on the listing
                    reservation.Place = listing.Place;

                    _db.Reservations.Add(reservation);
                    await _db.SaveChangesAsync();
                    return true;
                }
            }

            return false; // Reservation not available or listing not found
        }
        catch (Exception e)
        {
            _logger.LogError("[ItemRepository] reservation creation failed, error message: {e}", e.Message);
            return false;
        }
    }

    //Checks if the startdate is after todays date
    public bool DateCheck(DateTime startDate)
    {
        return startDate.Date >= DateTime.Today;
    }

    //Cheks if the enddate is not before the startdate
    public bool StartEndCheck(DateTime startDate, DateTime endDate)
    {
        return startDate.Date <= endDate.Date;
    }


public async Task<IEnumerable<Listing>?> FilterListings(String? Place, int? AmountGuests, int? AmountBathrooms, int? AmountBedrooms, int? MinPrice, int? MaxPrice, DateTime? StartDate, DateTime? EndDate)
{
    try
    {
        // Begin with a query that includes all listings
        var query = _db.Listings.Where(l => true);

        if (Place != null)

        {
            //Display all the listings with places mathing the query in the filter.
            query = query.Where(l => l.Place == Place);
        }

        if (AmountGuests.HasValue)
        {
            //Displays all the listings that has the specified amount of guest queried or more.
            query = query.Where(l => l.Guests >= AmountGuests);
        }

        if (AmountBathrooms.HasValue)
        {
            query = query.Where(l => l.Bathrooms >= AmountBathrooms);
        }

        if (AmountBedrooms.HasValue)
        {
            query = query.Where(l => l.Bedrooms >= AmountBedrooms);
        }

        if (MinPrice.HasValue)
        {
            query = query.Where(l => l.Price >= MinPrice);
        }

        if (MaxPrice.HasValue)
        {
           //Displays all the listings that has the specified price queried or less.
           query = query.Where(l => l.Price <= MaxPrice);
        }

        List<int> reservedListingIds = new List<int>();

        if (StartDate.HasValue || EndDate.HasValue)
        {
            if (StartDate.HasValue && EndDate.HasValue) 
            {
                //Checks for listings that matches between the specified dates
                reservedListingIds = _db.Reservations
                    .Where(r => (StartDate.Value <= r.EndDate && EndDate.Value >= r.StartDate))
                    .Select(r => r.ListingId)
                    .ToList();
            }
            else if (StartDate.HasValue) //If only startDate has value
            {
                reservedListingIds = _db.Reservations
                    .Where(r => StartDate.Value <= r.EndDate)
                    .Select(r => r.ListingId)
                    .ToList();
            }
            else // If only Enddate has value
            {
                reservedListingIds = _db.Reservations
                    .Where(r => EndDate.Value >= r.StartDate)
                    .Select(r => r.ListingId)
                    .ToList();
            }

            query = query.Where(l => !reservedListingIds.Contains(l.Id));
        }

        return await query.ToListAsync();
    }
    catch (Exception e)
    {
        _logger.LogError("[ItemRepository] Failed to filter listings, error message: {e}", e.Message);
        return null;
    }
}


 public async Task<IEnumerable<Reservation>> GetReservations()
 {
     try
     {
         return await _db.Reservations.ToListAsync();
     }
     catch (Exception e)
     {
         _logger.LogError("[ItemRepository] reservations ToListAsync() failed when GetReservations(), error message: {e}", e.Message);
         return null;
     }
 }
 
 
 public async Task<IEnumerable<Reservation>?> GetReservationByPlace(string place)
 {
     try
     {
         return await _db.Reservations.Where(l => l.Place == place).ToListAsync();
     }
     catch (Exception e)
     {
         _logger.LogError("[ItemRepository] Failed to find the reservation based on Place error message: {e}", e.Message);
         return null;
     }

 }




}
