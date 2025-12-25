using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SmartBell.Api.Infrastructure.Email;

namespace SmartBell.Api.Infrastructure.Email;

public sealed class EmailWorker : BackgroundService
{
    private readonly IEmailQueue _queue;
    private readonly IEmailSender _sender;
    private readonly ILogger<EmailWorker> _logger;

    public EmailWorker(
        IEmailQueue queue,
        IEmailSender sender,
        ILogger<EmailWorker> logger)
    {
        _queue = queue;
        _sender = sender;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var job = await _queue.DequeueAsync(stoppingToken);

            const int maxTry = 3;
            for (int attempt = 1; attempt <= maxTry; attempt++)
            {
                try
                {
                    await _sender.SendAsync(
                        job.To,
                        job.Subject,
                        job.HtmlBody,
                        stoppingToken
                    );
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "Email send failed. Attempt {Attempt}/{MaxTry}. To={To}",
                        attempt,
                        maxTry,
                        job.To
                    );

                    if (attempt == maxTry) break;

                    await Task.Delay(
                        TimeSpan.FromSeconds(2 * attempt),
                        stoppingToken
                    );
                }
            }
        }
    }
}
