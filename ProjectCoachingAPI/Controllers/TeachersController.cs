using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectCoachingAPI.Data;
using ProjectCoachingAPI.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace ProjectCoachingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeachersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Teachers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers()
        {
            return await _context.Teachers.OrderByDescending(t => t.Id).ToListAsync();
        }

        // GET: api/Teachers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);

            if (teacher == null)
            {
                return NotFound();
            }

            return teacher;
        }

        // POST: api/Teachers
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Teacher>> PostTeacher(Teacher teacher)
        {
            // Force values to be at least empty string to satisfy NOT NULL constraints
            // if the database schema was generated before they were made nullable
            teacher.Designation = teacher.Designation ?? string.Empty;
            teacher.Subject = teacher.Subject ?? string.Empty;
            teacher.ImageUrl = teacher.ImageUrl ?? string.Empty;
            teacher.Bio = teacher.Bio ?? string.Empty;
            teacher.FacebookUrl = teacher.FacebookUrl ?? string.Empty;
            teacher.LinkedInUrl = teacher.LinkedInUrl ?? string.Empty;
            
            teacher.CreatedAt = DateTime.UtcNow;

            _context.Teachers.Add(teacher);
            
            try 
            {
                await _context.SaveChangesAsync();
            }
            catch(Exception ex) 
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }

            return CreatedAtAction("GetTeacher", new { id = teacher.Id }, teacher);
        }

        // PUT: api/Teachers/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutTeacher(int id, Teacher teacher)
        {
            if (id != teacher.Id)
            {
                return BadRequest();
            }

            teacher.Designation = teacher.Designation ?? string.Empty;
            teacher.Subject = teacher.Subject ?? string.Empty;
            teacher.ImageUrl = teacher.ImageUrl ?? string.Empty;
            teacher.Bio = teacher.Bio ?? string.Empty;
            teacher.FacebookUrl = teacher.FacebookUrl ?? string.Empty;
            teacher.LinkedInUrl = teacher.LinkedInUrl ?? string.Empty;

            _context.Entry(teacher).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeacherExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Teachers/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
            {
                return NotFound();
            }

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeacherExists(int id)
        {
            return _context.Teachers.Any(e => e.Id == id);
        }
    }
}
