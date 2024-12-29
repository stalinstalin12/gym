// productOutOfStockNotification.js
module.exports = async function productOutOfStockNotification(sellerName, productTitle, reason, supportEmail) {
    return `
      <h1>Hello ${sellerName},</h1>
      <p>Your product <strong>${productTitle}</strong> is now out of stock.</p>
      <p>${reason}</p>
      <p>If you need any assistance, please contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
      <p>Best regards,</p>
      <p>Your E-Commerce Platform Team</p>
    `;
  };
  