using SmartBell.Api.Domain.Entities;

namespace SmartBell.Api.Infrastructure.Email;

public static class EmailTemplates
{
    public static string ReservationConfirmed(Reservation r)
    {
        return $@"
<!doctype html>
<html>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
</head>

<body style='margin:0;padding:0;background:#f3f5f9;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;'>

  <table width='100%' cellpadding='0' cellspacing='0' style='padding:32px 12px;'>
    <tr>
      <td align='center'>

        <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;background:#ffffff;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.08);overflow:hidden;'>

          <!-- HEADER -->
          <tr>
            <td style='background:linear-gradient(135deg,#1f3c88,#2a5298);padding:28px;text-align:center;color:#ffffff;'>
              <h1 style='margin:0;font-size:22px;font-weight:600;'>Zenith Suites</h1>
              <p style='margin:8px 0 0;font-size:14px;opacity:0.9;'>Reservation Confirmation</p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style='padding:28px;'>

              <h2 style='margin:0 0 12px;font-size:20px;color:#111;'>Reservation Confirmed </h2>

              <p style='margin:0 0 18px;font-size:15px;color:#444;line-height:1.6;'>
                Hello <strong>{Html(r.FullName)}</strong>,<br/>
                Your reservation at <strong>Zenith Suites</strong> has been successfully completed.
              </p>

              <!-- INFO CARD -->
              <table width='100%' cellpadding='0' cellspacing='0' style='background:#f7f9fc;border-radius:12px;padding:18px;margin:20px 0;'>
                <tr>
                  <td style='font-size:14px;color:#333;line-height:1.8;'>
                    <strong>Reservation Code:</strong> {Html(r.BookingCode)}<br/>
                    <strong>Room:</strong> {Html(r.RoomTypeSnapshot)}<br/>
                    <strong>Dates:</strong> {r.CheckIn:dd MMM yyyy} – {r.CheckOut:dd MMM yyyy}<br/>
                    <strong>Guests:</strong> {r.Adults + r.ChildrenUnder12}<br/>
                    <strong>Phone:</strong> {Html(r.Phone)}<br/>
                    <strong>Email:</strong> {Html(r.Email)}
                  </td>
                </tr>
              </table>

              <!-- CHECKIN INFO -->
              <table width='100%' cellpadding='0' cellspacing='0' style='margin-top:16px;'>
                <tr>
                  <td style='font-size:14px;color:#444;line-height:1.7;'>
                    <strong>Check-in / Check-out</strong><br/>
                    • Check-in: <strong>14:00 and after</strong><br/>
                    • Check-out: <strong>by 11:00</strong>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style='background:#f3f5f9;padding:18px;text-align:center;font-size:12px;color:#777;'>
              Zenith Suites • Şile / İstanbul<br/>
              This is an automated email. Please do not reply.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>";
    }

    public static string RoomPin(
        Reservation r,
        string pin,
        DateTime validUntilUtc)
    {
        return $@"
    <!doctype html>
    <html>
    <head>
      <meta charset='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
    </head>

    <body style='margin:0;padding:0;background:#f3f5f9;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;'>

      <table width='100%' cellpadding='0' cellspacing='0' style='padding:32px 12px;'>
        <tr>
          <td align='center'>

            <table width='100%' cellpadding='0' cellspacing='0'
                  style='max-width:640px;background:#ffffff;border-radius:14px;
                  box-shadow:0 10px 30px rgba(0,0,0,0.08);overflow:hidden;'>

              <!-- HEADER -->
              <tr>
                <td style='background:linear-gradient(135deg,#1f3c88,#2a5298);
                          padding:28px;text-align:center;color:#ffffff;'>
                  <h1 style='margin:0;font-size:22px;font-weight:600;'>Zenith Suites</h1>
                  <p style='margin:8px 0 0;font-size:14px;opacity:0.9;'>
                    Room Access Information
                  </p>
                </td>
              </tr>

              <!-- CONTENT -->
              <tr>
                <td style='padding:28px;'>

                  <h2 style='margin:0 0 12px;font-size:20px;color:#111;'>
                    Check-in Completed
                  </h2>

                  <p style='margin:0 0 18px;font-size:15px;color:#444;line-height:1.6;'>
                    Hello <strong>{Html(r.FullName)}</strong>,<br/>
                    Your check-in at <strong>Zenith Suites</strong> has been successfully completed.
                  </p>

                  <!-- PIN CARD -->
                  <table width='100%' cellpadding='0' cellspacing='0'
                        style='background:#f7f9fc;border-radius:12px;
                        padding:18px;margin:20px 0;text-align:center;'>
                    <tr>
                      <td style='font-size:16px;color:#333;line-height:1.8;'>
                        <strong>Your Room PIN</strong><br/>
                        <div style='font-size:28px;
                                    font-weight:700;
                                    letter-spacing:4px;
                                    margin:12px 0;
                                    color:#1f3c88;'>
                          {Html(pin)}
                        </div>
                        <span style='font-size:13px;color:#666;'>
                          Valid until: {validUntilUtc.ToLocalTime():dd MMM yyyy HH:mm}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <p style='font-size:14px;color:#444;line-height:1.6;'>
                    Please use this PIN to access your room during your stay.<br/>
                    For security reasons, do not share this PIN with anyone.
                  </p>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style='background:#f3f5f9;padding:18px;text-align:center;
                          font-size:12px;color:#777;'>
                  Zenith Suites • Şile / İstanbul<br/>
                  This is an automated email. Please do not reply.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>";
    }


    private static string Html(string? s)
        => System.Net.WebUtility.HtmlEncode(s ?? "");
}
