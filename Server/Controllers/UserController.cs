using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Database;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq.Expressions;


namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        public UserController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            var hashedBytes = SHA512.HashData(Encoding.UTF8.GetBytes(user.PasswordHash));
            user.PasswordHash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpGet()]
        public async Task<IActionResult> GetUsers()
        {
            List<User> users = await _context.Users.OrderBy(User => User.Id).ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Utilisateur non trouvé");
            }

            return Ok(user);
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] string username, [FromForm] string email, [FromForm] Role role)
        {
            try
            {
                var userToUpdate = await _context.Users.FindAsync(id);

                if (userToUpdate == null)
                {
                    return NotFound();
                }

                userToUpdate.Username = username ?? userToUpdate.Username;
                userToUpdate.Email = email ?? userToUpdate.Email;
                userToUpdate.Role = role != default ? role : userToUpdate.Role;

                if (Enum.IsDefined(typeof(Role), role))
                {
                    userToUpdate.Role = role;
                }
                else
                {
                    return BadRequest("Role invalide");
                }

                await _context.SaveChangesAsync();

                return Ok(userToUpdate);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Erreur: {e.Message}");
                return BadRequest(e.Message);
            }
        }

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

            return Ok(user);
        }
    }
}