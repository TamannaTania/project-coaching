namespace ProjectCoachingAPI.Models
{
    public class SuccessStudent
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string Batch { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int OrderIndex { get; set; } = 0;
    }
}
