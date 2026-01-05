namespace ServiceManagementApis.Models;


public class Service
{
    public int ServiceId { get; set; }           // PK
    public string ServiceName { get; set; } = null!;

    public int ServiceCategoryId { get; set; }   // FK
    public ServiceCategory ServiceCategory { get; set; } = null!;
    
    public decimal Price { get; set; }
    public int SLAHours { get; set; }
    public bool IsActive { get; set; } = true;


    public string Description { get; set; } = null!;
}
