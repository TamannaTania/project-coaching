const fs = require('fs');
let code = fs.readFileSync('Data/AppDbContext.cs', 'utf8');

if (!code.includes('public DbSet<FreeClass> FreeClasses { get; set; }')) {
    code = code.replace('public DbSet<Enrollment> Enrollments { get; set; }', 'public DbSet<Enrollment> Enrollments { get; set; }\n        public DbSet<FreeClass> FreeClasses { get; set; }');
    fs.writeFileSync('Data/AppDbContext.cs', code, 'utf8');
    console.log("Updated AppDbContext!");
}
