using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectCoachingAPI.Data;
using ProjectCoachingAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ProjectCoachingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CoursesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
            return await _context.Courses.Include(c => c.Features).ToListAsync();
        }

        // GET: api/Courses/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourse(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Features)
                .Include(c => c.Chapters)
                    .ThenInclude(ch => ch.Contents)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
            {
                return NotFound();
            }

            var enrolledCount = await _context.Enrollments.CountAsync(e => e.CourseId == id && e.Status == "Approved");

            // Check if user is logged in and enrolled
            bool isEnrolled = false;
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                var userEmail = User.FindFirstValue(ClaimTypes.Email);
                if (!string.IsNullOrEmpty(userEmail))
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                    if (user != null)
                    {
                        var enrollment = await _context.Enrollments.FirstOrDefaultAsync(e => e.UserId == user.Id && e.CourseId == id && e.Status == "Approved");
                        if (enrollment != null || user.Role == "Admin")
                        {
                            isEnrolled = true;
                        }
                    }
                }
            }

            // If not enrolled, hide URLs from contents
            var chapters = course.Chapters.OrderBy(c => c.OrderIndex).Select(ch => new {
                ch.Id,
                ch.Title,
                ch.OrderIndex,
                Contents = ch.Contents.OrderBy(co => co.OrderIndex).Select(co => new {
                    co.Id,
                    co.Title,
                    co.Type,
                    co.OrderIndex,
                    // Send URL only if enrolled!
                    Url = isEnrolled ? co.Url : "" 
                }).ToList()
            }).ToList();

            return Ok(new {
                course.Id,
                course.Title,
                course.Description,
                course.Badge,
                course.Price,
                course.ImageUrl,
                course.Features,
                enrolledCount = enrolledCount,
                chapters = chapters,
                isEnrolled = isEnrolled
            });
        }

        [HttpPost]
        public async Task<ActionResult<Course>> PostCourse(Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCourses), new { id = course.Id }, course);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(int id, Course course)
        {
            if (id != course.Id) return BadRequest();
            _context.Entry(course).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
