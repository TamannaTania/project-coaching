using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ProjectCoachingAPI.Services
{
    public class SmsService : ISmsService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<SmsService> _logger;
        private readonly HttpClient _httpClient;

        public SmsService(IConfiguration config, ILogger<SmsService> logger)
        {
            _config = config;
            _logger = logger;
            _httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };
        }

        public async Task<(bool success, string message)> SendOtpSmsAsync(string phone, string otpCode)
        {
            string msg = $"Physics Classroom: Your verification code (OTP) is {otpCode}. Valid for 10 minutes. Please do not share this code with anyone.";
            return await SendSmsAsync(phone, msg);
        }

        public async Task<(bool success, string message)> SendSmsAsync(string phone, string messageText)
        {
            try
            {
                var section = _config.GetSection("SmsSettings");
                bool isEnabled = bool.TryParse(section["Enabled"], out bool en) && en;
                string apiKey = section["ApiKey"] ?? "";
                string provider = (section["Provider"] ?? "Greenweb").Trim();
                string senderId = section["SenderId"] ?? "";

                if (!isEnabled || string.IsNullOrWhiteSpace(apiKey))
                {
                    _logger.LogInformation("SMS Gateway is currently disabled or API Key is missing. Message to {Phone}: {Message}", phone, messageText);
                    return (false, "SMS Gateway বর্তমানে কনফিগার করা হয়নি।");
                }

                string cleanPhone = phone.Trim();
                if (cleanPhone.StartsWith("+88")) cleanPhone = cleanPhone.Substring(3);
                else if (cleanPhone.StartsWith("88")) cleanPhone = cleanPhone.Substring(2);

                if (!cleanPhone.StartsWith("01") || cleanPhone.Length != 11)
                {
                    return (false, "সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রয়োজন।");
                }

                string url;
                if (provider.Equals("BulkSMSBD", StringComparison.OrdinalIgnoreCase))
                {
                    // BulkSMSBD standard API endpoint
                    url = $"http://bulksmsbd.net/api/smsapi?api_key={apiKey}&type=text&number={cleanPhone}&senderid={senderId}&message={Uri.EscapeDataString(messageText)}";
                }
                else
                {
                    // Default to Greenweb BD API endpoint
                    url = $"http://api.greenweb.com.bd/api.php?token={apiKey}&to={cleanPhone}&message={Uri.EscapeDataString(messageText)}";
                }

                var response = await _httpClient.GetAsync(url);
                string responseBody = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("SMS sent successfully to {Phone}: {Response}", cleanPhone, responseBody);
                    return (true, "SMS সফলভাবে পাঠানো হয়েছে।");
                }
                else
                {
                    _logger.LogWarning("SMS API error for {Phone}: {Status} - {Response}", cleanPhone, response.StatusCode, responseBody);
                    return (false, "SMS গেটওয়ে রেসপন্স এরর: " + responseBody);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send SMS to {Phone}", phone);
                return (false, "SMS পাঠাতে সমস্যা হয়েছে: " + ex.Message);
            }
        }
    }
}
