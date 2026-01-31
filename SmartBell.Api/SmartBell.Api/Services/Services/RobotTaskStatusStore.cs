using System.Collections.Concurrent;
using SmartBell.Api.Dtos.RobotDtos;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Services.Services.Robot;

public class RobotTaskStatusStore : IRobotTaskStatusStore
{
    private readonly ConcurrentDictionary<string, RobotTaskStatusDto> _statuses = new();

    public void Upsert(RobotTaskStatusDto status)
    {
        _statuses[status.RobotId] = status;
    }

    public IReadOnlyCollection<RobotTaskStatusDto> GetAll()
    {
        return _statuses.Values.ToList();
    }
}
