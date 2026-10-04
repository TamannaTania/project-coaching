using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectCoachingAPI.Data;
using ProjectCoachingAPI.Models;

namespace ProjectCoachingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin")] // Let's keep it open for testing first, or uncomment if admin system is fully ready
    public class CourseContentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CourseContentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("chapters")]
        public async Task<ActionResult<CourseChapter>> PostChapter(CourseChapter chapter)
        {
            _context.CourseChapters.Add(chapter);
            await _context.SaveChangesAsync();
            return Ok(chapter);
        }

        [HttpPost("contents")]
        public async Task<ActionResult<CourseContent>> PostContent(CourseContent content)
        {
            _context.CourseContents.Add(content);
            await _context.SaveChangesAsync();
            return Ok(content);
        }

        [HttpDelete("chapters/{id}")]
        public async Task<IActionResult> DeleteChapter(int id)
        {
            var chapter = await _context.CourseChapters.FindAsync(id);
            if (chapter == null) return NotFound();
            _context.CourseChapters.Remove(chapter);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("contents/{id}")]
        public async Task<IActionResult> DeleteContent(int id)
        {
            var content = await _context.CourseContents.FindAsync(id);
            if (content == null) return NotFound();
            _context.CourseContents.Remove(content);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
