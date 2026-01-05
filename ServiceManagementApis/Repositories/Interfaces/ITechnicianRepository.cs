using ServiceManagementApis.DTOs.Technician;


namespace ServiceManagementApis.Repositories.Interfaces;

public interface ITechnicianRepository
{
    Task<TechnicianDashboardDto> GetDashboardAsync(int technicianId);
    Task<List<TechnicianRequestDto>> GetAssignedRequestsAsync(int technicianId);
    Task<int?> GetCustomerIdByRequestIdAsync(int serviceRequestId);
    Task<string?> GetServiceNameByRequestIdAsync(int serviceRequestId);

    Task<bool> UpdateRequestStatusAsync(int serviceRequestId, string status, DateOnly? completedDate);
    Task<bool> UpdateAvailabilityAsync(int technicianId, string availabilityStatus);
}
