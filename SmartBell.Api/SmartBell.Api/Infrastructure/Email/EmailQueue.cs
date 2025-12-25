using System.Threading.Channels;

namespace SmartBell.Api.Infrastructure.Email;

public sealed class EmailQueue : IEmailQueue
{
    private readonly Channel<EmailJob> _channel =
        Channel.CreateUnbounded<EmailJob>(
            new UnboundedChannelOptions
            {
                SingleReader = true,
                SingleWriter = false
            });

    public ValueTask EnqueueAsync(EmailJob job, CancellationToken ct = default)
        => _channel.Writer.WriteAsync(job, ct);

    public ValueTask<EmailJob> DequeueAsync(CancellationToken ct)
        => _channel.Reader.ReadAsync(ct);
}
