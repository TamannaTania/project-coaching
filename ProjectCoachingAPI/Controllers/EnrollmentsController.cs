using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ProjectCoachingAPI.Data;
using ProjectCoachingAPI.Models;
using System.Security.Claims;

namespace ProjectCoachingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EnrollmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EnrollmentsController(AppDbContext context)
        {
            _context = context;
        }

        public class PaymentDto {
            public string phone { get; set; } = "";
            public string trxId { get; set; } = "";
        }

        [HttpPost("{courseId}")]
        public async Task<IActionResult> Enroll(int courseId, [FromBody] PaymentDto dto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if(string.IsNullOrEmpty(email)) return Unauthorized();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return Unauthorized();
            var userId = user.Id;
            
            var existing = await _context.Enrollments.FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);
            if (existing != null) return BadRequest(new { message = "Already requested or enrolled" });

            var enrollment = new Enrollment { 
                UserId = userId, 
                CourseId = courseId,
                PaymentPhone = dto.phone,
                TrxId = dto.trxId,
                Status = "Pending"
            };
            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Payment submitted for review!" });
        }

        [HttpGet("check/{courseId}")]
        public async Task<IActionResult> CheckEnrollment(int courseId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if(string.IsNullOrEmpty(email)) return Ok(new { isEnrolled = false, status = "None" });
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return Ok(new { isEnrolled = false, status = "None" });
            var userId = user.Id;
            var enrollment = await _context.Enrollments.FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);
            if (enrollment == null) return Ok(new { isEnrolled = false, status = "None" });
            
            return Ok(new { isEnrolled = enrollment.Status == "Approved", status = enrollment.Status });
        }

        // --- Get My Courses for Profile Page ---
        [HttpGet("mycourses")]
        public async Task<IActionResult> GetMyCourses()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if(string.IsNullOrEmpty(email)) return Unauthorized();
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return Unauthorized();

            var enrollments = await _context.Enrollments
                .Include(e => e.Course)
                .Where(e => e.UserId == user.Id)
                .OrderByDescending(e => e.EnrollmentDate)
                .Select(e => new {
                    courseId = e.CourseId,
                    title = e.Course.Title,
                    imageUrl = e.Course.ImageUrl,
                    status = e.Status, // "Pending", "Approved", "Rejected"
                    trxId = e.TrxId,
                    enrollmentDate = e.EnrollmentDate
                })
                .ToListAsync();

            return Ok(enrollments);
        }

        // --- Admin Endpoints ---
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllEnrollments()
        {
            // In a real app, verify admin role here
            var enrollments = await _context.Enrollments
                .Include(e => e.User)
                .Include(e => e.Course)
                .OrderByDescending(e => e.EnrollmentDate)
                .Select(e => new {
                    id = e.Id,
                    userName = e.User.Name,
                    courseTitle = e.Course.Title,
                    phone = e.PaymentPhone,
                    trxId = e.TrxId,
                    status = e.Status,
                    date = e.EnrollmentDate
                })
                .ToListAsync();
            return Ok(enrollments);
        }

        [HttpPut("admin/approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null) return NotFound();
            enrollment.Status = "Approved";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Approved" });
        }

        [HttpPut("admin/reject/{id}")]
        public async Task<IActionResult> Reject(int id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null) return NotFound();
            enrollment.Status = "Rejected";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Rejected" });
        }

        [HttpGet("admin/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalStudents = await _context.Users.CountAsync(u => u.Role == "Student");
            var totalEnrollments = await _context.Enrollments.CountAsync(e => e.Status == "Approved");
            var pendingRequests = await _context.Enrollments.CountAsync(e => e.Status == "Pending");

            // Course-wise enrollments for graph
            var courseStats = await _context.Enrollments
                .Where(e => e.Status == "Approved")
                .GroupBy(e => e.Course.Title)
                .Select(g => new {
                    CourseName = g.Key,
                    EnrolledCount = g.Count()
                })
                .ToListAsync();

            return Ok(new {
                totalStudents,
                totalEnrollments,
                pendingRequests,
                courseStats
            });
        }
    }
}
