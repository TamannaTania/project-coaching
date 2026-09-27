namespace ProjectCoachingAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        
        // "Admin" or "Student"
        public string Role { get; set; } = "Student"; 

        // To track the allowed device
        public string? DeviceId { get; set; }
    }
}
