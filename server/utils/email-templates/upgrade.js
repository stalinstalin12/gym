exports.upgradeApprovalNotification = function (userName, companyName) {
    return new Promise(async (resolve, reject) => {
      try {
        let template = `
              <html style="box-sizing: border-box;">
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body, html {
                      padding: 0 !important;
                      margin: 0 !important;
                      font-family: Arial, sans-serif !important;
                    }
                    .header {
                      background-color: #4CAF50;
                      color: white;
                      padding: 10px 20px;
                      text-align: center;
                    }
                    .content {
                      padding: 20px;
                    }
                    .footer {
                      text-align: center;
                      padding: 10px;
                      color: #777;
                      font-size: 12px;
                    }
                    .btn {
                      display: inline-block;
                      padding: 10px 20px;
                      font-size: 16px;
                      font-family: sans-serif;
                      color: white;
                      background-color: #4CAF50;
                      text-decoration: none;
                      border-radius: 5px;
                      margin-top: 20px;
                    }
                    .btn:hover {
                      background-color: #45a049;
                    }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h2>Upgrade Request Approved</h2>
                  </div>
                  <div class="content">
                    <p>Dear ${userName},</p>
                    <p>We are excited to inform you that your upgrade request to become a seller for your company "<strong>${companyName}</strong>" has been approved.</p>
                    <p>You can now access your seller dashboard and start managing your products and sales.</p>
                    <a href="http://localhost:5173/Signin" class="btn">Go to Seller Dashboard</a>
                    <p>Thank you for choosing our platform to grow your business. If you have any questions, feel free to contact our support team.</p>
                    <p>Best regards,</p>
                    <p>The Team</p>
                  </div>
                  <div class="footer">
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                  </div>
                </body>
              </html>
          `;
        resolve(template);
      } catch (error) {
        reject(error);
      }
    });
  };
  

  exports.upgradeRejectionNotification = async (userName, companyName) => {
    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hi ${userName},</h2>
            <p>We regret to inform you that your upgrade request for the company <strong>${companyName}</strong> has been rejected.</p>
            <p>If you have any questions or believe this was a mistake, feel free to contact our support team.</p>
            <p>Thank you for understanding.</p>
            <p>Best regards,</p>
            <p>The Team</p>
        </div>
    `;
};
