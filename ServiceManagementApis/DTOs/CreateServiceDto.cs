using System.ComponentModel.DataAnnotations;

namespace ServiceManagementApis.DTOs;

public class CreateServiceDto
{
    [Required]
    public string ServiceName { get; set; } = null!;

    [Required]
    public decimal Price { get; set; }

    [Required]
    public int SLAHours { get; set; }

    public string Description { get; set; } = null!;

    [Required]
    public int ServiceCategoryId { get; set; }
}
