using System;
using System.ComponentModel.DataAnnotations;

namespace ProjectCoachingAPI.Models
{
    public class Teacher
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Designation { get; set; }
        
        public string Subject { get; set; }

        public string ImageUrl { get; set; }

        public string Bio { get; set; }
        
        public string FacebookUrl { get; set; }
        public string LinkedInUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
