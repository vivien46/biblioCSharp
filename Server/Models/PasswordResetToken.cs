namespace Server.Models
{
    // Jeton de réinitialisation du mot de passe : seul le hash est stocké, jamais le jeton lui-même
    public class PasswordResetToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string TokenHash { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
