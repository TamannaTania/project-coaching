using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectCoachingAPI.Data;
using ProjectCoachingAPI.Models;

namespace ProjectCoachingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuccessStudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SuccessStudentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SuccessStudent>>> GetSuccessStudents()
        {
            return await _context.SuccessStudents.OrderBy(s => s.OrderIndex).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<SuccessStudent>> PostSuccessStudent(SuccessStudent student)
        {
            _context.SuccessStudents.Add(student);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSuccessStudents", new { id = student.Id }, student);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSuccessStudent(int id, SuccessStudent student)
        {
            if (id != student.Id) return BadRequest();

            _context.Entry(student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SuccessStudentExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSuccessStudent(int id)
        {
            var student = await _context.SuccessStudents.FindAsync(id);
            if (student == null) return NotFound();

            _context.SuccessStudents.Remove(student);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool SuccessStudentExists(int id)
        {
            return _context.SuccessStudents.Any(e => e.Id == id);
        }
    }
}
