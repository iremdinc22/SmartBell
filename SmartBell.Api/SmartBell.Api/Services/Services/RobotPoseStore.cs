using System.Collections.Concurrent;
using SmartBell.Api.Dtos.RobotDtos;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Services.Services.Robot;

public class RobotPoseStore : IRobotPoseStore
{
    private readonly ConcurrentDictionary<string, RobotPoseDto> _poses = new();

    public void Upsert(RobotPoseDto pose)
    {
        _poses[pose.Id] = pose;
    }

    public IReadOnlyCollection<RobotPoseDto> GetAll()
    {
        return _poses.Values.ToList();
    }
}
