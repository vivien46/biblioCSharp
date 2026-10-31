using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Server.Models;

namespace Server.Security
{
    // Hachage des mots de passe avec PBKDF2 et sel (ASP.NET Core Identity).
    // Les anciens hashs SHA512 sans sel sont acceptés une fois, puis convertis au login.
    public static class PasswordHelper
    {
        private static readonly PasswordHasher<User> Hasher = new();

        public static string Hash(string password) => Hasher.HashPassword(null!, password);

        // Renvoie true si le mot de passe est correct.
        // Si le hash est ancien ou doit être renforcé, user.PasswordHash est mis à jour (à sauvegarder par l'appelant).
        public static bool VerifyAndUpgrade(User user, string password)
        {
            if (IsLegacySha512(user.PasswordHash))
            {
                if (!LegacySha512Matches(user.PasswordHash, password))
                    return false;

                user.PasswordHash = Hash(password);
                return true;
            }

            var result = Hasher.VerifyHashedPassword(null!, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
                return false;

            if (result == PasswordVerificationResult.SuccessRehashNeeded)
                user.PasswordHash = Hash(password);

            return true;
        }

        // L'ancien format : 128 caractères hexadécimaux (SHA512)
        private static bool IsLegacySha512(string stored) =>
            stored.Length == 128 && stored.All(Uri.IsHexDigit);

        private static bool LegacySha512Matches(string stored, string password)
        {
            var computed = Convert.ToHexString(SHA512.HashData(Encoding.UTF8.GetBytes(password))).ToLowerInvariant();
            return CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(computed),
                Encoding.UTF8.GetBytes(stored));
        }
    }
}
