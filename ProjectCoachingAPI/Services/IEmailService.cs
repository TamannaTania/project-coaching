namespace ProjectCoachingAPI.Services
{
    public interface IEmailService
    {
        Task<(bool success, string message)> SendOtpEmailAsync(string toEmail, string toName, string otpCode, string purpose);
    }
}
