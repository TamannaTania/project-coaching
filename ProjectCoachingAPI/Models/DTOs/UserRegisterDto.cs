namespace ProjectCoachingAPI.Models.DTOs
{
    public class UserRegisterDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Username { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string Password { get; set; } = string.Empty;
    }
}
