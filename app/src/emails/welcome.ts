import { SITE_URL } from '@/lib/resend';

export function welcomeEmailHtml(name: string): string {
  const firstName = name.split(' ')[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to the IGCSE Pseudocode Compiler</title>
</head>
<body style="margin:0;padding:0;background:#0D1B2A;font-family:'Segoe UI',Arial,sans-serif;color:#ABB2BF;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1B2A;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:28px;">
              <span style="font-size:15px;font-weight:700;color:#ABB2BF;letter-spacing:-0.3px;">
                Pseudocode <span style="font-weight:400;color:#778DA9;">Compiler</span>
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#1B2A3B;border:1px solid #2A3F55;border-radius:12px;padding:36px 32px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#E8EAF0;line-height:1.3;">
                Hey ${firstName}, welcome aboard.
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#778DA9;line-height:1.6;">
                Your account is ready. Here's what you can do:
              </p>

              <!-- Features list -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:10px 14px;background:#0D1B2A;border:1px solid #2A3F55;border-radius:8px;margin-bottom:8px;display:block;">
                    <span style="font-size:13px;font-weight:600;color:#61AFEF;">Write and run pseudocode</span>
                    <span style="font-size:12px;color:#778DA9;display:block;margin-top:2px;">
                      Full IGCSE pseudocode support — run code instantly in your browser, no install needed.
                    </span>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background:#0D1B2A;border:1px solid #2A3F55;border-radius:8px;">
                    <span style="font-size:13px;font-weight:600;color:#61AFEF;">Save your code across devices</span>
                    <span style="font-size:12px;color:#778DA9;display:block;margin-top:2px;">
                      Your code is saved to your account — pick up exactly where you left off on any device.
                    </span>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background:#0D1B2A;border:1px solid #2A3F55;border-radius:8px;">
                    <span style="font-size:13px;font-weight:600;color:#61AFEF;">Practice questions</span>
                    <span style="font-size:12px;color:#778DA9;display:block;margin-top:2px;">
                      IGCSE-style questions with instant feedback. Filter by topic and difficulty.
                    </span>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background:#0D1B2A;border:1px solid #2A3F55;border-radius:8px;">
                    <span style="font-size:13px;font-weight:600;color:#61AFEF;">Timed exam simulation</span>
                    <span style="font-size:12px;color:#778DA9;display:block;margin-top:2px;">
                      Replicate real exam conditions — timed, auto-graded, and scored at the end.
                    </span>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${SITE_URL}/practice"
                      style="display:inline-block;background:#61AFEF;color:#0D1B2A;font-size:13px;font-weight:700;
                        text-decoration:none;padding:12px 32px;border-radius:8px;letter-spacing:0.2px;">
                      Start practising now
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:11px;color:#3D5068;line-height:1.6;text-align:center;">
                You're receiving this because you signed up at
                <a href="${SITE_URL}" style="color:#4A6480;text-decoration:none;">${SITE_URL.replace('https://', '')}</a>.
                <br/>If that wasn't you, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export function welcomeEmailText(name: string): string {
  const firstName = name.split(' ')[0];
  return `Hey ${firstName}, welcome to the IGCSE Pseudocode Compiler!

Your account is ready. Here's what you can do:

- Write and run pseudocode — full IGCSE support, runs in your browser instantly
- Save your code across devices — pick up where you left off from any device
- Practice questions — IGCSE-style questions with instant feedback
- Timed exam simulation — replicate real exam conditions

Start practising: ${SITE_URL}/practice

---
You're receiving this because you signed up at ${SITE_URL}.
If that wasn't you, ignore this email.`;
}
