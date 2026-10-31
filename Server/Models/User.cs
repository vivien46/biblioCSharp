using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        public string PasswordHash { get; set; }

        // Obligatoire et au bon format : une chaîne vide entrerait en conflit avec l'index unique
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public Role Role { get; set; }

        public ICollection<Emprunt> Emprunts { get; set; }
    }

    public enum Role
    {
        Admin = 1,
        User = 0,
    }
}