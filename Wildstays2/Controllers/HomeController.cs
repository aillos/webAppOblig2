using Microsoft.AspNetCore.Mvc;
using Wildstays2.DAL;
using System.Threading.Tasks;

namespace Wildstays2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    private readonly IItemRepository _itemRepository;

    public HomeController(IItemRepository itemRepository)
    {
        _itemRepository = itemRepository;
    }

    [HttpGet("reservations")]
    public async Task<IActionResult> GetReservations()
    {
        var reservations = await _itemRepository.GetReservations();
        return Ok(reservations);
    }
}