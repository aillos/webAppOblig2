using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Wildstays2.Models;

namespace Wildstays2.Models
{
    public class Listing
    {
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        //Checks that string is smaller that 100 characters.
        [StringLength(100, ErrorMessage = "Name must be less than 100 characters.")]
        [JsonPropertyName("Name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Place is required.")]
        [JsonPropertyName("Place")]
        public string Place { get; set; }

        [JsonPropertyName("Description")]
        public string Description { get; set; }

        [JsonPropertyName("Type")]
        public string? Type { get; set; }

        [Required(ErrorMessage = "Price is required.")]
        //Cheks that the price is between 1 and the max int value.
        [Range(1, int.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        [JsonPropertyName("Price")]
        public int Price { get; set; }

        [Required(ErrorMessage = "Guests is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Guests must be greater than 0.")]
        [JsonPropertyName("Guests")]
        public int Guests { get; set; }

        [Required(ErrorMessage = "Bedrooms is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Bedrooms must be greater than 0.")]
        [JsonPropertyName("Bedrooms")]
        public int Bedrooms { get; set; }

        [Required(ErrorMessage = "Bathrooms is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Bathrooms must be greater than 0.")]
        [JsonPropertyName("Bathrooms")]
        public int Bathrooms { get; set; }

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
        // Iput validation was not working, therefor it is in the views instead
        //The field will only show image files in your computer.

        public Listing()
        {
        }
    }
}
