using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wildstays2.DAL;
using Wildstays2.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;


namespace Wildstays2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : Controller
    {
        private readonly IItemRepository _itemRepository;
        private readonly ILogger<ListingsController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;

        public ReservationsController(IItemRepository itemRepository,
            ILogger<ListingsController> logger,
            UserManager<ApplicationUser> userManager)
        {
            _itemRepository = itemRepository;
            _logger = logger;
            _userManager = userManager;
        }

        

        // Index
        [HttpGet("index")]
        public async Task<IActionResult> Index(String? Place, int? AmountGuests, int? AmountBathrooms, int? AmountBedrooms, int? MinPrice, int? MaxPrice, DateTime? StartDate, DateTime? EndDate)
        {
            //Returnes the listings with filters, if any, see the method in Itemrepository for further information.
            var listings = await _itemRepository.FilterListings(Place, AmountGuests, AmountBathrooms, AmountBedrooms, MinPrice, MaxPrice, StartDate, EndDate);

            return Ok(listings);
        }



        // Detail action, same as in listingscontroller, but has reservations in it
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
        
        [HttpGet("res/{id}")]
        public async Task<IActionResult> GetReservationsByListingId(int id)
        {
            var reservations = await _itemRepository.GetReservationsByListingId(id);
            _logger.LogInformation(reservations.ToString());
            return Ok(reservations);
        }
        
        [HttpGet("images/{id}")]
        public async Task<IActionResult> GetImagesByListingId(int id)
        {
            var images = await _itemRepository.GetImagesByListingId(id);
            return Ok(images);
        }
        
        [Authorize]
        [HttpPost("userReservation")]
        public async Task<IActionResult> UserReservations()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return RedirectToRoute("Identity/Account/Login");
            }

            var reservations = await _itemRepository.GetReservationByUserId(user.Id);
            return Ok(reservations);
        }
    }
    
}
