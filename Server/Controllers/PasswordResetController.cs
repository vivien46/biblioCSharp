using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Database;
using Server.Models;
using Server.Security;
using Server.Services;
using System.Security.Cryptography;
using System.Text;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/user")]
    [AllowAnonymous]
    public class PasswordResetController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly EmailService _email;
        private readonly IConfiguration _configuration;

        public PasswordResetController(DataContext context, EmailService email, IConfiguration configuration)
        {
            _context = context;
            _email = email;
            _configuration = configuration;
        }

        // Réponse identique que l'email existe ou non, pour ne pas révéler les comptes
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromForm] string email)
        {
            var message = "Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé.";

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return Ok(new { message });

            // Un seul lien actif à la fois : on supprime les anciens
            var anciens = await _context.PasswordResetTokens.Where(t => t.UserId == user.Id).ToListAsync();
            _context.PasswordResetTokens.RemoveRange(anciens);

            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
                .Replace('+', '-').Replace('/', '_').TrimEnd('=');

            _context.PasswordResetTokens.Add(new PasswordResetToken
            {
                UserId = user.Id,
                TokenHash = HashToken(token),
                ExpiresAt = DateTime.UtcNow.AddHours(1),
            });
            await _context.SaveChangesAsync();

            var lien = $"{_configuration["Frontend:BaseUrl"]}/api/user/reset-password?token={token}";
            try
            {
                await _email.SendAsync(
                    user.Email,
                    "Réinitialisation de votre mot de passe",
                    $"Pour choisir un nouveau mot de passe, ouvrez ce lien (valable 1 heure) :\n{lien}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Erreur d'envoi d'email : {e.Message}");
            }

            return Ok(new { message });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromForm] string token, [FromForm] string newPassword)
        {
            if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 8)
                return BadRequest("Le mot de passe doit contenir au moins 8 caractères.");

            var reset = await _context.PasswordResetTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.TokenHash == HashToken(token));

            if (reset == null || reset.ExpiresAt < DateTime.UtcNow)
                return BadRequest("Lien invalide ou expiré.");

            reset.User.PasswordHash = PasswordHelper.Hash(newPassword);

            // Usage unique : on supprime tous les jetons de ce compte
            var tous = await _context.PasswordResetTokens.Where(t => t.UserId == reset.UserId).ToListAsync();
            _context.PasswordResetTokens.RemoveRange(tous);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Votre mot de passe a été modifié. Vous pouvez vous connecter." });
        }

        private static string HashToken(string token) =>
            Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token))).ToLowerInvariant();
    }
}
