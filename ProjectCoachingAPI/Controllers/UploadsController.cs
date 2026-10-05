using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ProjectCoachingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            try
            {
                var webRootPath = _env.WebRootPath;
                if (string.IsNullOrWhiteSpace(webRootPath))
                {
                    webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                var uploadsFolder = Path.Combine(webRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate a safe unique file name
                var extension = Path.GetExtension(file.FileName);
                var uniqueFileName = Guid.NewGuid().ToString("N") + extension;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return relative URL
                var fileUrl = $"/uploads/{uniqueFileName}";
                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
