const blockedUserTemplate = (userName, reason) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Blocked Notification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h3 {
            color: #333333;
          }
          p {
            color: #555555;
            line-height: 1.6;
          }
          .reason {
            color: #d9534f;
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            color: #888888;
            font-size: 12px;
          }
          .footer a {
            color: #007bff;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h3>Dear ${userName},</h3>
          <p>
            We regret to inform you that your account has been <strong>blocked</strong>.
          </p>
          <p>
            <strong>Reason:</strong> <span class="reason">${reason}</span>
          </p>
          <p>
            If you believe this action was taken in error, please contact our support team
            as soon as possible to resolve the issue.
          </p>
          <p>
            Thank you for your understanding.
          </p>
          <p>Best regards,<br>Your Admin Team</p>
          <div class="footer">
            <p>
              If you have any questions, feel free to contact us at 
              <a href="mailto:support@example.com">support@example.com</a>.
            </p>
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  module.exports = blockedUserTemplate;
  