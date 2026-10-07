using Microsoft.EntityFrameworkCore;
using ProjectCoachingAPI.Models;

namespace ProjectCoachingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseFeature> CourseFeatures { get; set; }
        public DbSet<CourseChapter> CourseChapters { get; set; }
        public DbSet<CourseContent> CourseContents { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<FreeClass> FreeClasses { get; set; }
        public DbSet<AboutContent> AboutContents { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
    }
}


