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
        public DbSet<User> Users { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
    }
}
