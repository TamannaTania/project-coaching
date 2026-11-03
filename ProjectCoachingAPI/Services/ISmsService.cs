using System.Threading.Tasks;

namespace ProjectCoachingAPI.Services
{
    public interface ISmsService
    {
        Task<(bool success, string message)> SendSmsAsync(string phone, string messageText);
        Task<(bool success, string message)> SendOtpSmsAsync(string phone, string otpCode);
    }
}
