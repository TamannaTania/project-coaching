namespace ProjectCoachingAPI.Models.DTOs
{
    public class SendOtpDto
    {
        public string Email { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string Purpose { get; set; } = "Register"; // "Register" or "ResetPassword"
    }

    public class VerifyOtpDto
    {
        public string Email { get; set; } = string.Empty;
        public string OtpCode { get; set; } = string.Empty;
        public string Purpose { get; set; } = "Register";
    }
}
