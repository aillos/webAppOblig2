namespace Wildstays2.Models;

public class ListingsAndReservations
{
    public Listing Listing { get; set; }
    public IEnumerable<Reservation> Reservations { get; set; }
}