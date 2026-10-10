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
            return await _context.FreeClasses.OrderByDescending(f => f.DateAdded).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<FreeClass>> PostFreeClass(FreeClass freeClass)
        {
            freeClass.DateAdded = DateTime.UtcNow;
            _context.FreeClasses.Add(freeClass);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetFreeClasses", new { id = freeClass.Id }, freeClass);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFreeClass(int id, FreeClass freeClass)
        {
            if (id != freeClass.Id) return BadRequest();

            _context.Entry(freeClass).State = EntityState.Modified;
            
            // Keep original date added
            _context.Entry(freeClass).Property(x => x.DateAdded).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FreeClassExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
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

        private bool FreeClassExists(int id)
        {
            return _context.FreeClasses.Any(e => e.Id == id);
        }
    }
}
