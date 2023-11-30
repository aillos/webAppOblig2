using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Wildstays2.DAL;
using Wildstays2.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Reflection;

namespace Wildstays2.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class ListingsController : Controller
    {
        private readonly IItemRepository _itemRepository;

        //Adds logging as in the modules.
        private readonly ILogger<ListingsController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;

        public ListingsController(IItemRepository itemRepository,
            ILogger<ListingsController> logger,
            UserManager<ApplicationUser> userManager)
        {
            _itemRepository = itemRepository;
            _logger = logger;
            _userManager = userManager;
        }



        // GET: Listings
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User);

            //If a user is not logged in
            //Gets all the listings for a user.
            var listings = await _itemRepository.GetListingsByUserId(user.Id);
            return Ok(listings);
        }

        // GET: Listings/Details/5
        [HttpGet("details/{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var listing = await _itemRepository.GetItemById(id);
            if (listing == null)
            {
                return NotFound();
            }

            return Ok(listing);
        }

        // GET: Listings/Create
        public IActionResult Create()
        {
            return Ok();
        }

        // POST: Listings/Create
        [HttpPost]
        [HttpPost("create")]
        public async Task<IActionResult> Create(Listing listing, List<IFormFile> Images)
        {
            if (ModelState.IsValid)
            {

                // Check if the start date is after today's date
                if (!_itemRepository.DateCheck(listing.StartDate))
                {
                    ModelState.AddModelError("StartDate", "Start Date cannot be before today's date.");
                    return Ok(listing);
                }

                // Check if the end date is before the start date
                if (!_itemRepository.StartEndCheck(listing.StartDate, listing.EndDate))
                {
                    ModelState.AddModelError("EndDate", "End Date cannot be before Start Date.");
                    return Ok(listing);
                }

                //Set User Id
                // Create the listing
                bool returnOk = await _itemRepository.Create(listing, Images);
                if (returnOk)
                {
                    _logger.LogDebug("Image url", Images);
                    return RedirectToAction(nameof(Index));
                }
            }
            return Ok(listing);
        }

        // GET: Listings/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var listing = await _itemRepository.GetItemById(id);
            if (listing == null)
            {
                return NotFound();
            }

            return Ok(listing);
        }


        [HttpPost]
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, Listing listing, List<IFormFile> Images, int? deleteImage, string submit)
        {
            //If the listing is not found
            if (id != listing.Id)
            {
                _logger.LogWarning("Wrong ID: {ListingId}. Returning NotFound.", id);
                return NotFound();
            }
            
            //Gets the listings by the listing.id
            var existingListing = await _itemRepository.GetItemById(listing.Id);

            if (existingListing == null)
            {
                _logger.LogWarning("This listing is not available listing ID: {ListingId}. Returning Forbid.", id);
                return Forbid();
            }

            try
            {
                //If the delete image button is tapped
                if (deleteImage.HasValue)
                {
                    // Delete the image
                    bool imageDeleted = await _itemRepository.DeleteImage(deleteImage.Value);
 
                }

                if (ModelState.IsValid)
                {

                    // Update the UserId so that it matches.

                    var result = await _itemRepository.Update(existingListing, listing, Images, null); // Pass null for imageToDeleteId

                    if (result)
                    {
                        _logger.LogInformation("Listing details and images updated successfully for listing ID: {ListingId}. Redirecting to Edit.", id);
                        return RedirectToAction("Edit", new { id = existingListing.Id });
                    }
                    else
                    {
                        _logger.LogError("Failed to update listing and images for listing ID: {ListingId}.");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in Edit for listing ID: {ListingId}.", id);
            }
            return Ok(existingListing);
        }




        
        public async Task<IActionResult> Delete(int id)
        {
            var listing = await _itemRepository.GetItemById(id);
            if (listing == null)
            {
                return NotFound();
            }

            return Ok(listing);
        }



        // POST: Listings/Delete/5
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var listing = await _itemRepository.GetItemById(id);

            // Checks that listing exists, and the user is the same user that made the listing.
            if (listing == null)
            {
                return NotFound();
            }

            // Method to delete reservation
            bool returnOk = await _itemRepository.Delete(id);

            // If there was a problem deleting the reservation.
            if (!returnOk)
            {
                _logger.LogError("[ListingsController] Listing deletion failed for the Id {Id:0000}", id);
                return BadRequest("Listing deletion failed");
            }

            return RedirectToAction(nameof(Index));
        }


        // GET: Listings/MyReservations
        //Controller to show the user their reservations.
        [Authorize]
        public async Task<IActionResult> Reservation()
        {
            //Gets the user information
            var user = await _userManager.GetUserAsync(User);
            //If a user is not logged in they are returned to the login screen.
            if (user == null)
            {
                return RedirectToAction("Login", "Identity/Account");
            }
            //Gets reservations based on UserID
            var reservations = await _itemRepository.GetReservationByUserId(user.Id);
            return View(reservations);
        }

    }
}