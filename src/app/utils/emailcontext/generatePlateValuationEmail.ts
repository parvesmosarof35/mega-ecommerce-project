export interface TCarPlateValuationRequest {
  plate: string;
  represent: string;
  notes?: string;
  buyerId: {
    fullname: string;
    address: string;
    phoneNumber: string;
    email: string;
  };
}

export const generatePlateValuationEmail = (data: TCarPlateValuationRequest) => {
  const { plate, represent, notes, buyerId } = data;
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Car Plate Valuation Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #4CAF50;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .section {
      background: #f9f9f9;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 5px;
      border-left: 4px solid #4CAF50;
    }
    .section h3 {
      margin-top: 0;
      color: #4CAF50;
    }
    .info-item {
      margin-bottom: 10px;
    }
    .label {
      font-weight: bold;
      display: inline-block;
      width: 120px;
    }
    .plate-number {
      background: #e8f5e8;
      padding: 5px 10px;
      border-radius: 3px;
      font-family: monospace;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Car Plate Valuation Request</h1>
  </div>
  
  <div class="section">
    <h3>Plate Details</h3>
    <div class="info-item">
      <span class="label">Plate:</span>
      <span class="plate-number">${plate}</span>
    </div>
    <div class="info-item">
      <span class="label">Description:</span>
      ${represent}
    </div>
    ${notes ? `
    <div class="info-item">
      <span class="label">Notes:</span>
      ${notes}
    </div>
    ` : ''}
  </div>
  
  <div class="section">
    <h3>Buyer Information</h3>
    <div class="info-item">
      <span class="label">Name:</span>
      ${buyerId.fullname}
    </div>
    <div class="info-item">
      <span class="label">Address:</span>
      ${buyerId.address?buyerId.address:'N/A'}
    </div>
    <div class="info-item">
      <span class="label">Phone:</span>
      ${buyerId.phoneNumber}
    </div>
    <div class="info-item">
      <span class="label">Email:</span>
      ${buyerId.email}
    </div>
  </div>
  
  <div class="footer">
    <p>&copy; ${currentYear} Car Valuation Service. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
};