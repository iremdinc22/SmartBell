namespace SmartBell.Api.Options;

public sealed class MailSettings
{
    public string Host { get; set; } = default!;
    public int Port { get; set; }
    public bool UseStartTls { get; set; }
    public string User { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string FromName { get; set; } = default!;
    public string FromEmail { get; set; } = default!;
}
