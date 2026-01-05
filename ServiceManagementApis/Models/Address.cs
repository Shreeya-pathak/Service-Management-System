namespace ServiceManagementApis.Models
{
    public class Address
    {
        public int AddressId { get; set; }

        public int UserId { get; set; }          // FK
        public User User { get; set; } = null!;

        public string Line1 { get; set; } = null!;
        public string? Line2 { get; set; }

        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public string Pincode { get; set; } = null!;
        public string Country { get; set; } = "India";

        public bool IsDefault { get; set; } = true;
    }
}
