using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Wildstays2.Models;

namespace Wildstays2.Models
{
    public class Reservation
    {
        [Required]
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Start Date is required.")]
        [Display(Name = "Start Date")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [JsonPropertyName("StartDate")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End Date is required.")]
        [Display(Name = "End Date")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [JsonPropertyName("EndDate")]
        public DateTime EndDate { get; set; }

        [JsonPropertyName("ListingId")]
        public int ListingId { get; set; }
        //Incoreperates the listings view so that they can work together.

        [JsonPropertyName("Listing")]
        public Listing Listing { get; set; }

        [JsonPropertyName("Place")]
        public string Place { get; set; }
    }
}
