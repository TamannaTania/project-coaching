namespace ProjectCoachingAPI.Models
{
    public class CourseChapter
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public int OrderIndex { get; set; }

        // Foreign Key
        public int CourseId { get; set; }
        public Course? Course { get; set; }

        // Relationship to Contents
        public List<CourseContent> Contents { get; set; } = new List<CourseContent>();
    }

    public class CourseContent
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Video" or "PDF"
        public string Url { get; set; } = string.Empty;
        public int OrderIndex { get; set; }

        // Foreign Key
        public int ChapterId { get; set; }
        public CourseChapter? Chapter { get; set; }
    }
}
