using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Database;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly Cloudinary _cloudinary;

        public BookController(DataContext context, IConfiguration configuration)
        {
            _context = context;

            var account = new Account(
                configuration["Cloudinary:CloudName"],
                configuration["Cloudinary:ApiKey"],
                configuration["Cloudinary:ApiSecret"]
            );
            _cloudinary = new Cloudinary(account);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddLivre([FromForm] Livre livre, [FromForm] IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return BadRequest("Image is missing");

            using var stream = imageFile.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(imageFile.FileName, stream),
                Folder = "bibliocsharp/livres"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
                return StatusCode(500, uploadResult.Error.Message);

            livre.ImageUrl = uploadResult.SecureUrl.ToString();

            _context.Livres.Add(livre);
            await _context.SaveChangesAsync();

            return Ok(livre);
        }

        [HttpGet()]
        public async Task<IActionResult> GetLivres()
        {
            try
            {
                List<Livre> livres = await _context.Livres
                    .OrderBy(l => l.Id)
                    .ToListAsync();

                return Ok(livres);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message,
                    inner = ex.InnerException?.Message,
                    type = ex.GetType().FullName
                });
            }
            // List<Livre> livres = await _context.Livres.OrderBy(l => l.Id).ToListAsync();
            // return Ok(livres);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLivre(int id)
        {
            var livre = await _context.Livres.FindAsync(id);
            if (livre == null)
                return NotFound("Livre non trouvé");

            return Ok(livre);
        }

        [HttpGet("previous/{id}")]
        public async Task<IActionResult> GetPreviousBook(int id)
        {
            var currentBook = await _context.Livres.FindAsync(id);
            if (currentBook == null)
                return NotFound("Livre actuel non trouvé");

            var livre = await _context.Livres
                .Where(l => l.Id < id)
                .OrderByDescending(l => l.Id)
                .FirstOrDefaultAsync();

            if (livre == null)
                return NotFound("Livre précédent non trouvé");

            return Ok(livre);
        }

        [HttpGet("next/{id}")]
        public async Task<IActionResult> GetNextBook(int id)
        {
            var currentBook = await _context.Livres.FindAsync(id);
            if (currentBook == null)
                return NotFound("Livre actuel non trouvé");

            var livre = await _context.Livres
                .Where(l => l.Id > id)
                .OrderBy(l => l.Id)
                .FirstOrDefaultAsync();

            if (livre == null)
                return NotFound("Livre suivant non trouvé");

            return Ok(livre);
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] string titre, [FromForm] string auteur, [FromForm] string editeur, [FromForm] int annee, [FromForm] string isbn, [FromForm] IFormFile? image)
        {
            try
            {
                var bookToUpdate = await _context.Livres.FindAsync(id);
                if (bookToUpdate == null)
                    return NotFound("Livre non trouvé");

                if (image != null && image.Length > 0)
                {
                    using var stream = image.OpenReadStream();
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(image.FileName, stream),
                        Folder = "bibliocsharp/livres"
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.Error != null)
                        return StatusCode(500, uploadResult.Error.Message);

                    bookToUpdate.ImageUrl = uploadResult.SecureUrl.ToString();
                }

                bookToUpdate.Titre = titre;
                bookToUpdate.Auteur = auteur;
                bookToUpdate.Editeur = editeur;
                bookToUpdate.Annee = annee;
                bookToUpdate.ISBN = isbn;

                await _context.SaveChangesAsync();
                return Ok(bookToUpdate);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur : {ex.Message}");
                return StatusCode(500, "Erreur interne du serveur");
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var book = await _context.Livres.FindAsync(id);
            if (book == null)
                return NotFound("Livre à supprimer non trouvé");

            _context.Livres.Remove(book);
            await _context.SaveChangesAsync();
            return Ok(book);
        }
    }
}