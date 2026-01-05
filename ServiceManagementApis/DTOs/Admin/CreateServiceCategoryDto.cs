using System.ComponentModel.DataAnnotations;

namespace ServiceManagementApis.DTOs.Admin;

public class CreateServiceCategoryDto
{
    [Required]
    public string CategoryName { get; set; } = null!;
}
