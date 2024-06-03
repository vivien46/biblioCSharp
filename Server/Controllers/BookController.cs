using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Database;
using Microsoft.AspNetCore.Http;
using System.Reflection;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public BookController(DataContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostEnvironment;

        }

        [HttpPost("add")]
        public async Task<IActionResult> AddLivre([FromForm] Livre livre, [FromForm] IFormFile image)
        {
             if (image == null || image.Length == 0)
                return BadRequest("Image is missing");

            var imagePath = Path.Combine(_hostingEnvironment.WebRootPath, "assets/images/Livres");

            if (!Directory.Exists(imagePath))
                Directory.CreateDirectory(imagePath);

            var fileName = Path.GetFileName(image.FileName);
            var fullPath = Path.Combine(imagePath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
            await image.CopyToAsync(stream);
            }

            livre.ImageUrl = image.FileName; // Store only the file name in the database
            _context.Livres.Add(livre);
            await _context.SaveChangesAsync();

            return Ok(livre);
        }

        [HttpGet()]
        public async Task<IActionResult> GetLivres()
        {
            List<Livre> livres = await _context.Livres.OrderBy(Livre => Livre.Id).ToListAsync();
            return Ok(livres);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLivre(int id)
        {
            var livre = await _context.Livres.FindAsync(id);
            if (livre == null)
            {
                return NotFound("Livre non trouvé");
            }

            return Ok(livre);
        }

        [HttpGet("image/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var imagePath = Path.Combine(_hostingEnvironment.WebRootPath, "assets/images/Livres", fileName);
            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound("Image non trouvée");
            }

            var image = System.IO.File.OpenRead(imagePath);
            return File(image, "image/jpeg");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] Livre livre, [FromForm] IFormFile image)
        {
            var bookToUpdate = await _context.Livres.FindAsync(id);

            if (bookToUpdate == null)
            {
                return NotFound("Livre non trouvé");
            }

            if( image != null && image.Length > 0)
            {
                var imagePath = Path.Combine(_hostingEnvironment.WebRootPath, "assets/Images/Livres");

                if (!Directory.Exists(imagePath))
                    Directory.CreateDirectory(imagePath);

                var fileName = Path.GetFileName(image.FileName);
                var fullPath = Path.Combine(imagePath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                bookToUpdate.ImageUrl = $"/assets/Images/Livres/{fileName}";
            }

            bookToUpdate.Titre = livre.Titre;
            bookToUpdate.Auteur = livre.Auteur;
            bookToUpdate.Editeur = livre.Editeur;
            bookToUpdate.Annee = livre.Annee;
            bookToUpdate.ISBN = livre.ISBN;

            await _context.SaveChangesAsync();

            return Ok(bookToUpdate);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var book = await _context.Livres.FindAsync(id);
            if (book == null)
            {
                return NotFound("Livre à supprimer non trouvé");
            }

            _context.Livres.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(book);
        }
    }
}
