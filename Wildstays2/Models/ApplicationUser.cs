using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace Wildstays2.DAL
{
    //Applicationuser extends Identityuser, the default user model when using ApsNetCore.Identity.
    public class ApplicationUser : IdentityUser
    {
        [JsonPropertyName("Gender")]
        public string Gender { get; set; }

        [JsonPropertyName("FirstName")]
        public string FirstName { get; set; }

        [JsonPropertyName("LastName")]
        public string LastName { get; set; }

        [JsonPropertyName("Age")]
        public int Age { get; set; }
    }
}
