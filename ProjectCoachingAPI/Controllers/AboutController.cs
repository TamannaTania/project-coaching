using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectCoachingAPI.Data;
using ProjectCoachingAPI.Models;

namespace ProjectCoachingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AboutController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AboutController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<AboutContent>> GetAbout()
        {
            var about = await _context.AboutContents.FirstOrDefaultAsync();
            if (about == null)
            {
                about = new AboutContent 
                { 
                    Title = "About PhysicsAcademy", 
                    Description = "We are dedicated to providing the best physics education for HSC and Admission candidates.", 
                    ImageUrl = "https://images.unsplash.com/photo-1524169358666-79f22534bc6e?auto=format&fit=crop&q=80&w=800" 
                };
                _context.AboutContents.Add(about);
                await _context.SaveChangesAsync();
            }
            return about;
        }

        [HttpPost]
        public async Task<IActionResult> UpdateAbout(AboutContent content)
        {
            var about = await _context.AboutContents.FirstOrDefaultAsync();
            if (about == null)
            {
                _context.AboutContents.Add(content);
            }
            else
            {
                about.Title = content.Title;
                about.Description = content.Description;
                about.ImageUrl = content.ImageUrl;
            }
            await _context.SaveChangesAsync();
            return Ok(about);
        }
    }
}
