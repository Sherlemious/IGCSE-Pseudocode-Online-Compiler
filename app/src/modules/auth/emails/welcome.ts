import { BRAND, SITE_NAME } from '@/shared/brand/brand';
import { SITE_URL } from '@/modules/auth/resend';

export function welcomeEmailHtml(name: string): string {
  const firstName = name.split(' ')[0];
  const { ink, paper, red } = BRAND.colors;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ${SITE_NAME}</title>
</head>
<body style="margin:0;padding:0;background:${ink};font-family:Georgia,'Times New Roman',serif;color:${ink};">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:${ink};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <tr>
            <td style="padding-bottom:22px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <img src="${SITE_URL}/favicon.png" width="28" height="28" alt="" style="display:block;border:0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-size:22px;font-style:italic;color:${paper};line-height:1;">Pseudocode</span>
                    <span style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${paper};opacity:0.55;padding-left:8px;">Compiler</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:${paper};">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:8px;background:${red};font-size:0;line-height:0;">&nbsp;</td>
                  <td style="padding:36px 32px 36px 28px;">

              <p style="margin:0 0 8px;font-size:26px;font-style:italic;color:${ink};line-height:1.3;">
                Hey ${firstName}, welcome aboard.
              </p>
              <p style="margin:0 0 24px;font-size:15px;font-family:'Segoe UI',Arial,sans-serif;color:${ink};opacity:0.72;line-height:1.6;">
                Your account is ready. Here's what you can do:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;font-family:'Segoe UI',Arial,sans-serif;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px dashed rgba(159,179,209,0.7);">
                    <span style="font-size:14px;font-weight:600;color:${ink};">Write and run pseudocode</span>
                    <span style="font-size:13px;color:${ink};opacity:0.65;display:block;margin-top:2px;">
                      Full IGCSE and A Level support — run code instantly in your browser, no install needed.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px dashed rgba(159,179,209,0.7);">
                    <span style="font-size:14px;font-weight:600;color:${ink};">Save your code across devices</span>
                    <span style="font-size:13px;color:${ink};opacity:0.65;display:block;margin-top:2px;">
                      Your code is saved to your account — pick up exactly where you left off on any device.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px dashed rgba(159,179,209,0.7);">
                    <span style="font-size:14px;font-weight:600;color:${ink};">Practice questions</span>
                    <span style="font-size:13px;color:${ink};opacity:0.65;display:block;margin-top:2px;">
                      Paper 2 questions with instant feedback. Filter by topic and difficulty.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <span style="font-size:14px;font-weight:600;color:${ink};">Timed exam simulation</span>
                    <span style="font-size:13px;color:${ink};opacity:0.65;display:block;margin-top:2px;">
                      Replicate real exam conditions — timed, auto-graded, and scored at the end.
                    </span>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="${SITE_URL}/practice"
                      style="display:inline-block;background:${red};color:${paper};font-size:13px;font-weight:700;
                        font-family:'Segoe UI',Arial,sans-serif;text-decoration:none;padding:12px 28px;letter-spacing:0.2px;">
                      Start practising now
                    </a>
                  </td>
                </tr>
              </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:11px;font-family:'Segoe UI',Arial,sans-serif;color:${paper};opacity:0.38;line-height:1.6;text-align:center;">
                You're receiving this because you signed up at
                <a href="${SITE_URL}" style="color:${paper};opacity:0.55;text-decoration:none;">${SITE_URL.replace('https://', '')}</a>.
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
  return `Hey ${firstName}, welcome to the ${SITE_NAME}!

Your account is ready. Here's what you can do:

- Write and run pseudocode — full IGCSE and A Level support, runs in your browser instantly
- Save your code across devices — pick up where you left off from any device
- Practice questions — Paper 2 questions with instant feedback
- Timed exam simulation — replicate real exam conditions

Start practising: ${SITE_URL}/practice

---
You're receiving this because you signed up at ${SITE_URL}.
If that wasn't you, ignore this email.`;
}
