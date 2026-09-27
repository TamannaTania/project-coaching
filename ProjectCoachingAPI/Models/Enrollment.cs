namespace ProjectCoachingAPI.Models {
    public class Enrollment {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int CourseId { get; set; }
        public Course? Course { get; set; }
        public string? PaymentPhone { get; set; }
        public string? TrxId { get; set; }
        public string Status { get; set; } = "Pending";
        public System.DateTime EnrollmentDate { get; set; } = System.DateTime.UtcNow;
    }
}
