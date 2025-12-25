namespace SmartBell.Api.Infrastructure.Email;

public sealed record EmailJob(string To, string Subject, string HtmlBody);
