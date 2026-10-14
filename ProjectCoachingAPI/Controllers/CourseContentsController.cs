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

        [HttpPut("chapters/{id}")]
        public async Task<IActionResult> PutChapter(int id, CourseChapter chapter)
        {
            if (id != chapter.Id && chapter.Id != 0)
            {
                chapter.Id = id;
            }

            var existing = await _context.CourseChapters.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = chapter.Title;
            existing.OrderIndex = chapter.OrderIndex;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpPut("contents/{id}")]
        public async Task<IActionResult> PutContent(int id, CourseContent content)
        {
            if (id != content.Id && content.Id != 0)
            {
                content.Id = id;
            }

            var existing = await _context.CourseContents.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = content.Title;
            existing.Type = content.Type;
            existing.Url = content.Url;
            existing.OrderIndex = content.OrderIndex;
            if (content.ChapterId > 0)
            {
                existing.ChapterId = content.ChapterId;
            }

            await _context.SaveChangesAsync();
            return Ok(existing);
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
