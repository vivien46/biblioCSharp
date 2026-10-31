using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    // Données envoyées à l'inscription : le mot de passe est en clair (HTTPS) et haché par le serveur
    public class RegisterRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
