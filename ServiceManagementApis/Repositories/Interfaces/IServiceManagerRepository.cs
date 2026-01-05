using ServiceManagementApis.DTOs.ServiceManager;

namespace ServiceManagementApis.Repositories.Interfaces;

public interface IServiceManagerRepository
{
    Task<ServiceManagerDashboardDto> GetDashboardAsync();

    Task<List<AssignableServiceRequestDto>> GetAssignableRequestsAsync();

    Task<List<AvailableTechnicianDto>> GetAvailableTechniciansAsync();

    
    Task<AssignableServiceRequestDto?> AssignTechnicianAsync(
        int serviceRequestId,
        AssignTechnicianDto dto
    );

    Task<List<MonitorServiceRequestDto>> GetMonitorRequestsAsync();

}
