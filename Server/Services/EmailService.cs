using System.Net;
using System.Net.Mail;

namespace Server.Services
{
    // Envoi d'emails via SMTP (Mailtrap en développement : les emails sont capturés, pas envoyés)
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendAsync(string to, string subject, string body)
        {
            var smtp = _configuration.GetSection("Smtp");

            using var client = new SmtpClient(smtp["Host"], int.Parse(smtp["Port"] ?? "2525"))
            {
                Credentials = new NetworkCredential(smtp["Username"], smtp["Password"]),
                EnableSsl = true,
            };

            using var message = new MailMessage(smtp["From"], to, subject, body);
            await client.SendMailAsync(message);
        }
    }
}
