using SmartBell.Api.Dtos.RobotDtos;
namespace SmartBell.Api.Services.Interfaces;

public interface IRobotPoseStore
{
    void Upsert(RobotPoseDto pose);
    IReadOnlyCollection<RobotPoseDto> GetAll();
}