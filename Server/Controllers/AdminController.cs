using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Database;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;

        public AdminController(DataContext context)
        {
            _context = context;
        }

        // Données du tableau de bord : compteurs et derniers emprunts
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var totalBooks = await _context.Livres.CountAsync();
            var totalAuteurs = await _context.Livres.Select(l => l.Auteur).Distinct().CountAsync();
            var totalUsers = await _context.Users.CountAsync();
            var totalEmprunts = await _context.Emprunts.CountAsync();

            var derniersEmprunts = await _context.Emprunts
                .OrderByDescending(e => e.DateEmprunt)
                .Take(5)
                .Select(e => new
                {
                    e.Id,
                    e.DateEmprunt,
                    e.DateRetour,
                    Livre = e.Livre.Titre,
                    Utilisateur = e.User.Username,
                })
                .ToListAsync();

            return Ok(new { totalBooks, totalAuteurs, totalUsers, totalEmprunts, derniersEmprunts });
        }
    }
}
