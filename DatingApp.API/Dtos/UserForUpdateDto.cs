using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForUpdateDto
    {
        public string Introducation { get; set; }
        public string LookingFor { get; set; }
        public string  Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

    }
}