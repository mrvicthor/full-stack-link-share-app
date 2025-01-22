export const getVerifyEmail = (code: string) => ({
  subject: "Verify Your Email Address",
  text: "Verify your email address",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .content {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .verification-code {
            text-align: center;
            font-size: 32px;
            letter-spacing: 5px;
            font-weight: bold;
            color: #2c5282;
            margin: 30px 0;
            padding: 15px;
            background-color: #ebf4ff;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666666;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="/api/placeholder/150/50" alt="Company Logo">
        </div>
        <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hello,</p>
            <p>Thank you for signing up! To complete your registration, please use the verification code below:</p>
            
            <div class="verification-code">${code}</div>
            
            <p>This code will expire in 24 hours for security reasons. If you didn't request this verification, please ignore this email.</p>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>Victor Eleanya</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>Victor Eleanya, Lagoss, Nigeria</p>
            <p>&copy; 2025 Victor Eleanya. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
});

export const getPasswordResetTemplate = (userName: string, url: string) => ({
  subject: "Password Reset Request",
  text: "You requested a password reset.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .content {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .verification-code {
            text-align: center;
            font-size: 32px;
            letter-spacing: 5px;
            font-weight: bold;
            color: #2c5282;
            margin: 30px 0;
            padding: 15px;
            background-color: #ebf4ff;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666666;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello ${userName},</p>
            <p>Someone recently requested a password change for your link share account. If this was you, you set a new password here</p>
            
            <a href="${url}" class="verification-code">Reset Password</a>
            
            <p>This code will expire in 1 hour for security reasons. If you didn't request this verification, please ignore this email.</p>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>Victor Eleanya</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>Victor Eleanya, Lagoss, Nigeria</p>
            <p>&copy; 2025 Victor Eleanya. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
});
