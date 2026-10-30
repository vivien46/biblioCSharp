using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Database;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq.Expressions;


namespace Server.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        public UserController(DataContext context)
        {
            _context = context;
        }

        private bool IsAdmin() => User.IsInRole(Role.Admin.ToString());

        private bool IsOwnerOrAdmin(int id) =>
            IsAdmin() || User.FindFirstValue(ClaimTypes.NameIdentifier) == id.ToString();

        // Renvoie le profil sans le hash du mot de passe
        private static object ToDto(User user) => new { user.Id, user.Username, user.Email, user.Role };

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            var hashedBytes = SHA512.HashData(Encoding.UTF8.GetBytes(user.PasswordHash));
            user.PasswordHash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();

            // Un inscrit ne peut jamais se déclarer admin
            user.Id = 0;
            user.Role = Role.User;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(ToDto(user));
        }

        [Authorize(Roles = "Admin")]
        [HttpGet()]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.OrderBy(u => u.Id).ToListAsync();
            return Ok(users.Select(ToDto));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            if (!IsOwnerOrAdmin(id))
                return Forbid();

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Utilisateur non trouvé");
            }

            return Ok(ToDto(user));
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] string username, [FromForm] string email, [FromForm] Role? role)
        {
            if (!IsOwnerOrAdmin(id))
                return Forbid();

            try
            {
                var userToUpdate = await _context.Users.FindAsync(id);

                if (userToUpdate == null)
                {
                    return NotFound();
                }

                // Seul un admin peut changer un rôle
                if (role.HasValue && role.Value != userToUpdate.Role)
                {
                    if (!IsAdmin())
                        return Forbid();

                    if (!Enum.IsDefined(typeof(Role), role.Value))
                        return BadRequest("Role invalide");

                    userToUpdate.Role = role.Value;
                }

                userToUpdate.Username = username ?? userToUpdate.Username;
                userToUpdate.Email = email ?? userToUpdate.Email;

                await _context.SaveChangesAsync();

                return Ok(ToDto(userToUpdate));
            }
            catch (Exception e)
            {
                Console.WriteLine($"Erreur: {e.Message}");
                return BadRequest(e.Message);
            }
        }

        [HttpPut("change-password/{id}")]
        public async Task<IActionResult> ChangePassword(int id, [FromForm] string oldPassword, [FromForm] string newPassword)
        {
            if (!IsOwnerOrAdmin(id))
                return Forbid();

            try
            {
                var userToUpdate = await _context.Users.FindAsync(id);

                if (userToUpdate == null)
                {
                    return NotFound();
                }

                var oldHashedBytes = SHA512.HashData(Encoding.UTF8.GetBytes(oldPassword));
                var oldHashedPassword = BitConverter.ToString(oldHashedBytes).Replace("-", "").ToLower();

                if (oldHashedPassword != userToUpdate.PasswordHash)
                {
                    return BadRequest("L'ancien mot de passe est incorrect");
                }

                var newHashedBytes = SHA512.HashData(Encoding.UTF8.GetBytes(newPassword));
                userToUpdate.PasswordHash = BitConverter.ToString(newHashedBytes).Replace("-", "").ToLower();

                await _context.SaveChangesAsync();

                return Ok(ToDto(userToUpdate));
            }
            catch (Exception e)
            {
                Console.WriteLine($"Erreur: {e.Message}");
                return BadRequest(e.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(ToDto(user));
        }
    }
}
