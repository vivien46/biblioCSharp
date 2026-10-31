using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Database;
using Server.Security;
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
            // Le champ PasswordHash reçoit le mot de passe en clair : on le hache ici
            user.PasswordHash = PasswordHelper.Hash(user.PasswordHash);

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

                if (email != null && !new EmailAddressAttribute().IsValid(email))
                    return BadRequest("Email invalide");

                if (username != null && string.IsNullOrWhiteSpace(username))
                    return BadRequest("Le nom d'utilisateur est obligatoire");

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

                if (!PasswordHelper.VerifyAndUpgrade(userToUpdate, oldPassword))
                {
                    return BadRequest("L'ancien mot de passe est incorrect");
                }

                userToUpdate.PasswordHash = PasswordHelper.Hash(newPassword);

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
