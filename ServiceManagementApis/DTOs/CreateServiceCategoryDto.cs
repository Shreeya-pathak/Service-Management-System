using System.ComponentModel.DataAnnotations;

namespace ServiceManagementApis.DTOs;

public class CreateServiceCategoryDto
{
    [Required]
    public string CategoryName { get; set; } = null!;
}
