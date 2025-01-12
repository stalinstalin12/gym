// utils/emailTemplates.js
exports.getOutOfStockEmailContent = (sellerName, productTitle) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background-color: #007bff;
          color: #ffffff;
          text-align: center;
          padding: 20px;
        }
        .email-header h1 {
          margin: 0;
          font-size: 24px;
        }
        .email-body {
          padding: 20px;
        }
        .email-body p {
          line-height: 1.6;
          margin: 15px 0;
        }
        .email-body .highlight {
          font-weight: bold;
          color: #007bff;
        }
        .email-footer {
          text-align: center;
          padding: 15px;
          font-size: 12px;
          color: #777;
          background-color: #f0f0f0;
          border-top: 1px solid #e0e0e0;
        }
        .email-footer a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Product Out of Stock Notification</h1>
        </div>
        <div class="email-body">
          <p>Dear <span class="highlight">${sellerName || "Seller"}</span>,</p>
          <p>We wanted to notify you that your product, <strong class="highlight">${productTitle}</strong>, is now <strong>out of stock</strong>.</p>
          <p>Please update your inventory if you wish to continue selling this item.</p>
          <p>Thank you for being a valued seller on our platform. If you need assistance, please don't hesitate to contact us.</p>
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p><a href="https://yourwebsite.com">Visit our website</a> | <a href="mailto:support@yourcompany.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
