using SmartBell.Api.Dtos.RobotDtos;

namespace SmartBell.Api.Services.Interfaces;

public interface IRobotTaskStatusStore
{
    void Upsert(RobotTaskStatusDto status);
    IReadOnlyCollection<RobotTaskStatusDto> GetAll();
}
