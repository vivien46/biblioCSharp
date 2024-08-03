using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Database;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpruntController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public EmpruntController(DataContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostEnvironment;

        }

        [HttpGet]
        public async Task<ActionResult<List<Emprunt>>> GetEmprunts()
        {
            var emprunts = await _context.Emprunts
                .Include(e => e.User)
                .Include(e => e.Livre)
                .ToListAsync();
            return Ok(emprunts);

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Emprunt>> GetEmprunt(int id)
        {
            var emprunt = await _context.Emprunts
                .Include(e => e.User)
                .Include(e => e.Livre)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (emprunt == null)
            {
                return NotFound("Emprunt non trouvé");
            }

            return Ok(emprunt);
        }

        [HttpPost("add")]
        public async Task<ActionResult<Emprunt>> CreateEmprunt([FromForm] DateTime DateEmprunt, [FromForm] DateTime DateRetour, [FromForm] string LivreTitre, [FromForm] string Username)
        {
            DateEmprunt = DateTime.SpecifyKind(DateEmprunt, DateTimeKind.Local).ToUniversalTime();
            DateRetour = DateTime.SpecifyKind(DateRetour, DateTimeKind.Local).ToUniversalTime();

            var livre = await _context.Livres.FirstOrDefaultAsync(l => l.Titre == LivreTitre);
            if (livre == null)
            {
                return BadRequest("Livre non trouvé.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == Username);
            if (user == null)
            {
                return BadRequest("Utilisateur non trouvé.");
            }

            var emprunt = new Emprunt
            {
                DateEmprunt = DateEmprunt,
                DateRetour = DateRetour,
                LivreId = livre.Id,
                UserId = user.Id
            };

            if (emprunt == null)
            {
                return BadRequest("Emprunt non valide.");
            }

            _context.Emprunts.Add(emprunt);
            await _context.SaveChangesAsync();

            emprunt.DateEmprunt = emprunt.DateEmprunt.ToLocalTime();
            emprunt.DateRetour = emprunt.DateRetour.ToLocalTime();

            return CreatedAtAction(nameof(GetEmprunt), new { id = emprunt.Id }, emprunt);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateEmprunt(int id, [FromForm] Emprunt emprunt)
        {
            if (id != emprunt.Id)
            {
                return BadRequest("ID de l'emprunt ne correspond pas.");
            }

            var existingEmprunt = await _context.Emprunts.FindAsync(id);
            if (existingEmprunt == null)
            {
                return NotFound("Emprunt non trouvé.");
            }

            existingEmprunt.LivreId = emprunt.LivreId;
            existingEmprunt.UserId = emprunt.UserId;
            existingEmprunt.DateEmprunt = emprunt.DateEmprunt;
            existingEmprunt.DateRetour = emprunt.DateRetour;

            _context.Entry(existingEmprunt).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmpruntExists(id))
                {
                    return NotFound("Emprunt non trouvé.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEmprunt(int id)
        {
            var emprunt = await _context.Emprunts.FindAsync(id);
            if (emprunt == null)
            {
                return NotFound("Emprunt non trouvé.");
            }

            _context.Emprunts.Remove(emprunt);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmpruntExists(int id)
        {
            return _context.Emprunts.Any(e => e.Id == id);
        }

    }
}