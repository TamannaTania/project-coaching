using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace ProjectCoachingAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task<(bool success, string message)> SendOtpEmailAsync(string toEmail, string toName, string otpCode, string purpose)
        {
            try
            {
                var smtpSection = _config.GetSection("SmtpSettings");
                string server = smtpSection["Server"] ?? "mail.physicsclassroombd.com";
                int port = int.TryParse(smtpSection["Port"], out int p) ? p : 465;
                string senderName = smtpSection["SenderName"] ?? "Physics Classroom";
                string senderEmail = smtpSection["SenderEmail"] ?? "noreply@physicsclassroombd.com";
                string username = smtpSection["Username"] ?? senderEmail;
                string password = smtpSection["Password"] ?? "";

                if (string.IsNullOrWhiteSpace(toEmail))
                {
                    return (false, "প্রাপকের ইমেইল পাওয়া যায়নি।");
                }

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(string.IsNullOrWhiteSpace(toName) ? "Student" : toName, toEmail.Trim()));

                string subject = purpose == "ResetPassword" 
                    ? "🔐 Physics Classroom - পাসওয়ার্ড রিসেট ওটিপি (OTP)" 
                    : "🎓 Physics Classroom - অ্যাকাউন্ট ভেরিফিকেশন কোড";
                message.Subject = subject;

                string purposeTitle = purpose == "ResetPassword" 
                    ? "পাসওয়ার্ড রিসেট ভেরিফিকেশন" 
                    : "ইমেইল ভেরিফিকেশন ও অ্যাকাউন্ট সক্রিয়করণ";

                string purposeDesc = purpose == "ResetPassword"
                    ? "আপনার অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করার জন্য নিচের ওয়ান-টাইম ওটিপি (OTP) কোডটি ব্যবহার করুন:"
                    : "Physics Classroom প্ল্যাটফর্মে স্বাগতম! আপনার অ্যাকাউন্টটি সুরক্ষিত ও নিশ্চিত করতে নিচের ওটিপি (OTP) কোডটি প্রদান করুন:";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>{subject}</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b;"">
    <table role=""presentation"" width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #f1f5f9; padding: 30px 10px;"">
        <tr>
            <td align=""center"">
                <table role=""presentation"" width=""100%"" max-width=""540"" style=""max-width: 540px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;"">
                    <!-- Header -->
                    <tr>
                        <td style=""background: linear-gradient(135deg, #065f46 0%, #059669 100%); padding: 30px 25px; text-align: center;"">
                            <h1 style=""margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;"">
                                ⚛️ Physics Classroom
                            </h1>
                            <p style=""margin: 6px 0 0; color: #a7f3d0; font-size: 13px; font-weight: 500;"">
                                শভন স্যার ফিজিক্স প্ল্যাটফর্ম
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style=""padding: 35px 30px;"">
                            <h2 style=""margin: 0 0 12px; font-size: 18px; color: #0f172a; font-weight: 700;"">
                                প্রিয় {toName},
                            </h2>
                            <p style=""margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;"">
                                {purposeDesc}
                            </p>
                            
                            <!-- OTP Box -->
                            <div style=""background: #f8fafc; border: 2px dashed #059669; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;"">
                                <span style=""display: block; font-size: 12px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;"">
                                    আপনার ওটিপি ভেরিফিকেশন কোড
                                </span>
                                <span style=""display: inline-block; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #065f46; font-family: 'Courier New', Courier, monospace;"">
                                    {otpCode}
                                </span>
                                <span style=""display: block; font-size: 12px; color: #64748b; margin-top: 8px;"">
                                    ⏱️ কোডটির মেয়াদ <strong>১০ মিনিট</strong>
                                </span>
                            </div>

                            <p style=""margin: 0 0 10px; font-size: 13px; color: #64748b; line-height: 1.5;"">
                                ⚠️ <strong>সতর্কতা:</strong> এই কোডটি গোপনীয়। কাউকেই (এমনকি শিক্ষক বা এডমিনকেও) আপনার ওটিপি প্রদান করবেন না।
                            </p>
                            <p style=""margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;"">
                                আপনি যদি এই অনুরোধটি না করে থাকেন, তবে নির্দ্বিধায় এই ইমেইলটি উপেক্ষা করুন। আপনার অ্যাকাউন্ট সুরক্ষিত রয়েছে।
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style=""background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;"">
                            <p style=""margin: 0; font-size: 12px; color: #64748b;"">
                                © 2026 Physics Classroom. All rights reserved.
                            </p>
                            <p style=""margin: 4px 0 0; font-size: 11px; color: #94a3b8;"">
                                এটি একটি স্বয়ংক্রিয় ইমেইল, সরাসরি এতে কোনো উত্তর দেওয়ার প্রয়োজন নেই।
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                // Bypass certificate check if self-signed on cPanel
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                // SecureSocketOptions based on port
                SecureSocketOptions socketOption = port == 465 
                    ? SecureSocketOptions.SslOnConnect 
                    : SecureSocketOptions.StartTls;

                await client.ConnectAsync(server, port, socketOption);
                
                if (!string.IsNullOrEmpty(password))
                {
                    await client.AuthenticateAsync(username, password);
                }

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("OTP Email sent to {Email} successfully.", toEmail);
                return (true, "OTP কোড সফলভাবে পাঠানো হয়েছে।");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send OTP Email to {Email}", toEmail);
                return (false, "ইমেইল পাঠানো যায়নি: " + ex.Message);
            }
        }
    }
}
