using System.ComponentModel.DataAnnotations;

namespace ServiceManagementApis.DTOs.Admin;

public class UpdateServiceCategoryDto
{
    [Required]
    public string CategoryName { get; set; } = null!;
}
