using System.ComponentModel.DataAnnotations;

namespace ServiceManagementApis.DTOs;

public class UpdateServiceCategoryDto
{
    [Required]
    public string CategoryName { get; set; } = null!;
}
