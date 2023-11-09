using System.Text.Json.Serialization;
using Wildstays2.Models;

namespace Wildstays2.Models
{
    public class Image
    {
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [JsonPropertyName("FilePath")]
        public string FilePath { get; set; }

        [JsonPropertyName("ListingId")]
        public int ListingId { get; set; }

        [JsonPropertyName("Listing")]
        public Listing Listing { get; set; }
    }

}
