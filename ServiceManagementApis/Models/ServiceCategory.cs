namespace ServiceManagementApis.Models;

public class ServiceCategory
{
    public int ServiceCategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    public ICollection<Service> Services { get; set; } = new List<Service>();
}
