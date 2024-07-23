using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Database;
using Microsoft.EntityFrameworkCore;


namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpruntController : ControllerBase
    {
        private readonly DataContext _context;
        public EmpruntController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddEmprunt([FromBody]Emprunt emprunt)
        {
            if(emprunt == null)
            {
                return BadRequest("Données invalides");
            }

            var livreExists = await _context.Livres.AnyAsync(l => l.Id == emprunt.LivreId);
            var userExists = await _context.Users.AnyAsync(u => u.Id == emprunt.UserId);

            if (!livreExists)
            {
                return NotFound($"Livre avec l'ID {emprunt.LivreId} non trouvé");
            }

            if (!userExists)
            {
                return NotFound($"Utilisateur avec l'ID {emprunt.UserId} non trouvé");
            }

            try
            {
            _context.Emprunts.Add(emprunt);
            await _context.SaveChangesAsync();

            return Ok(emprunt);
        }
        catch (DbUpdateException ex)
        {
            return StatusCode(500, $"Erreur lors de l'ajout de l'emprunt: {ex.Message}");
        }
        catch (Exception ex)
        {
            return BadRequest($"Erreur lors de l'ajout de l'emprunt: {ex.Message}");
        }
    }

        [HttpGet()]
        public async Task<IActionResult> GetEmprunts()
        {
            List<Emprunt> emprunts = await _context.Emprunts.OrderBy(Emprunt => Emprunt.Id).ToListAsync();
            return Ok(emprunts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmprunt(int id)
        {
            var emprunt = await _context.Emprunts.FindAsync(id);
            if (emprunt == null)
            {
                return NotFound("Emprunt non trouvé");
            }

            return Ok(emprunt);
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] DateTime dateEmprunt, [FromForm] DateTime dateRetour, [FromForm] int livreId, [FromForm] int userId)
        {
            if(dateEmprunt > dateRetour)
            {
                return BadRequest("La date d'emprunt ne peut pas être supérieure à la date de retour");
            }

            try
            {
                var empruntToUpdate = await _context.Emprunts.FindAsync(id);

                if (empruntToUpdate == null)
                {
                    return NotFound("Emprunt non trouvé");
                }

                var livre = await _context.Livres.FindAsync(livreId);
                if (livre == null)
                {
                    return NotFound("Livre non trouvé");
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound("Utilisateur non trouvé");
                }

                empruntToUpdate.DateEmprunt = dateEmprunt;
                empruntToUpdate.DateRetour = dateRetour;
                empruntToUpdate.LivreId = livreId;
                empruntToUpdate.UserId = userId;

                await _context.SaveChangesAsync();

                return Ok(empruntToUpdate);
            }
            catch (Exception e)
            {
                return BadRequest($"Erreur lors de la modification de l'emprunt: {e.Message}");
            }
        }
    }
}