using System.Threading.Channels;

namespace SmartBell.Api.Infrastructure.Email;

public interface IEmailQueue
{
    ValueTask EnqueueAsync(EmailJob job, CancellationToken ct = default);
    ValueTask<EmailJob> DequeueAsync(CancellationToken ct);
}
