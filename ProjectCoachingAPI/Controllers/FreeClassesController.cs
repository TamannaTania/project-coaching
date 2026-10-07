using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectCoachingAPI.Data;
using ProjectCoachingAPI.Models;

namespace ProjectCoachingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FreeClassesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FreeClassesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FreeClass>>> GetFreeClasses()
        {
            return await _context.FreeClasses.OrderBy(f => f.OrderIndex).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<FreeClass>> PostFreeClass(FreeClass freeClass)
        {
            _context.FreeClasses.Add(freeClass);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetFreeClasses", new { id = freeClass.Id }, freeClass);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFreeClass(int id)
        {
            var freeClass = await _context.FreeClasses.FindAsync(id);
            if (freeClass == null) return NotFound();

            _context.FreeClasses.Remove(freeClass);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
