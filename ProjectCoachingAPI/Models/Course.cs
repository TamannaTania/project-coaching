namespace ProjectCoachingAPI.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Badge { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty; // Keep for backward compatibility/preview
        
        // Relationship to features
        public List<CourseFeature> Features { get; set; } = new List<CourseFeature>();
        
        // Relationship to Chapters
        public List<CourseChapter> Chapters { get; set; } = new List<CourseChapter>();
    }

    public class CourseFeature
    {
        public int Id { get; set; }
        public string FeatureText { get; set; } = string.Empty;
        
        // Foreign Key
        public int CourseId { get; set; }
        public Course? Course { get; set; }
    }
}
