# 🐎 Serene Spaces - Google Forms + Sheets Setup Guide

## 🎯 **Overview**

This guide sets up a simple, efficient workflow using Google Forms + Sheets instead of a complex web app. Perfect for a small business!

## 📋 **What You'll Create**

### **1. Google Forms**

- **Customer Intake Form** (public) - Customers schedule pickups
- **Pickup Confirmation Form** (internal) - Your team processes orders

### **2. Google Sheets**

- **Customer Intake** - Form responses
- **Customer Directory** - Master customer list
- **Pickup Confirmation** - Internal processing
- **Invoice Log** - Audit trail

### **3. Google Apps Script**

- **sendWelcomeEmail** - Auto-email customers
- **masterOnEdit** - Process pickup confirmations
- **updateCustomerDropdown** - Keep forms in sync

---

## 🚀 **Step-by-Step Setup**

### **Step 1: Create Google Forms**

#### **Customer Intake Form (Public)**

1. Go to [forms.google.com](https://forms.google.com)
2. Create new form: "Serene Spaces - Customer Intake"
3. Add questions:
   - **Customer Name** (Short answer, Required)
   - **Phone Number** (Phone number, Required)
   - **Email Address** (Email, Required)
   - **Pickup Address** (Long answer, Required)
   - **Preferred Pickup Date** (Date, Required)
   - **Notes/Special Instructions** (Long answer, Optional)
   -

#### **Pickup Confirmation Form (Internal)**

1. Create new form: "Serene Spaces - Pickup Confirmation"
2. **IMPORTANT**: Make "Customer Name" the FIRST question
3. Add questions:
   - **Customer Name** (Dropdown from Customer Directory - we'll set this up later)
   - **Ready to Invoice** (Multiple choice: Yes, No)
   - **Send Invoice** (Multiple choice: Yes, No)
   - **Blanket Qty** (Number)
   - **Sheet Qty** (Number)
   - **Saddle Pad Qty** (Number)
   - **Wraps Qty** (Number)
   - **Boots Qty** (Number)
   - **Hood Qty** (Number)
   - **Fleece Girth Qty** (Number)
   - **Waterproofing Qty** (Number)
   - **Extra Wash Qty** (Number)
   - **Leg Straps Qty** (Number)
   - **Repair Cost** (Number)
   - **Waterproofing Notes** (Long answer)
   - **Extra Wash Notes** (Long answer)
   - **General Notes** (Long answer)

---

### **Step 2: Create Google Sheets**

#### **Main Spreadsheet: "Serene Spaces Operations"**

Create a new Google Sheet with these tabs:

##### **Tab 1: Customer Intake**

- Link your Customer Intake Form responses here
- Form → Responses → Link to Sheets

##### **Tab 2: Customer Directory**

| A                 | B                 | C                | D                    | E          | F              |
| ----------------- | ----------------- | ---------------- | -------------------- | ---------- | -------------- |
| **Customer Name** | **Email Address** | **Phone Number** | **Pickup Address**   | **Status** | **Date Added** |
| John Smith        | john@email.com    | (555) 123-4567   | 123 Main St, Chicago | Active     | 1/15/2024      |
| Jane Doe          | jane@email.com    | (555) 987-6543   | 456 Oak Ave, Chicago | Active     | 1/16/2024      |

##### **Tab 3: Pickup Confirmation**

| A                    | B                | C             | D                 | E               | F             | G                  | H             | I             | J            | K                    | L                     | M                  | N                  | O               | P                       | Q                    | R                 | S                   | T                | U                      | V                  | W                  | X                    | Y                |
| -------------------- | ---------------- | ------------- | ----------------- | --------------- | ------------- | ------------------ | ------------- | ------------- | ------------ | -------------------- | --------------------- | ------------------ | ------------------ | --------------- | ----------------------- | -------------------- | ----------------- | ------------------- | ---------------- | ---------------------- | ------------------ | ------------------ | -------------------- | ---------------- |
| **Ready to Invoice** | **Send Invoice** | **Timestamp** | **Customer Name** | **Blanket Qty** | **Sheet Qty** | **Saddle Pad Qty** | **Wraps Qty** | **Boots Qty** | **Hood Qty** | **Fleece Girth Qty** | **Waterproofing Qty** | **Extra Wash Qty** | **Leg Straps Qty** | **Repair Cost** | **Waterproofing Notes** | **Extra Wash Notes** | **General Notes** | **Invoice Created** | **Invoice Link** | **Regenerate Invoice** | **Customer Email** | **Customer Phone** | **Customer Address** | **Total Amount** |

##### **Tab 4: Invoice Log**

| A        | B                 | C             | D                | E              | F                | G         |
| -------- | ----------------- | ------------- | ---------------- | -------------- | ---------------- | --------- |
| **Date** | **Customer Name** | **Invoice #** | **Total Amount** | **Email Sent** | **Invoice Link** | **Notes** |

---

### **Step 3: Link Forms to Sheets**

1. **Customer Intake Form** → Link to "Customer Intake" tab
2. **Pickup Confirmation Form** → Link to "Pickup Confirmation" tab

---

### **Step 4: Google Apps Script Setup**

#### **Create Apps Script Project**

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Name it: "Serene Spaces Operations"

#### **Code.gs - Main Configuration**

```javascript
// Serene Spaces Operations - Main Configuration
const CFG = {
  // Spreadsheet IDs (replace with your actual IDs)
  spreadsheetId: "YOUR_SPREADSHEET_ID_HERE",

  // Tab names
  tabs: {
    customerIntake: "Customer Intake",
    customerDirectory: "Customer Directory",
    pickupConfirmation: "Pickup Confirmation",
    invoiceLog: "Invoice Log",
  },

  // Pricing (your exact price sheet)
  pricing: {
    BLANKET_FILL: 25,
    SHEET_NO_FILL: 20,
    SADDLE_PAD: 10,
    WRAPS: 5,
    BOOTS: 5,
    HOOD_NECK: 15,
    FLEECE_GIRTH: 15,
    WATERPROOFING: 20,
    EXTRA_WASH: 10,
    LEG_STRAPS: 10,
    TAX_RATE: 0.0625, // 6.25%
  },

  // Form IDs (replace with your actual form IDs)
  forms: {
    customerIntake: "YOUR_INTAKE_FORM_ID",
    pickupConfirmation: "YOUR_PICKUP_FORM_ID",
  },

  // Email templates
  emailTemplates: {
    welcomeSubject: "Thank you for choosing Serene Spaces!",
    welcomeBody: `
Dear {customerName},

Thank you for scheduling a pickup with Serene Spaces! 

We've received your request for pickup on {pickupDate} and will confirm within 24 hours.

Your pickup address: {pickupAddress}

We look forward to serving you with our professional horse equipment cleaning services.

Best regards,
The Serene Spaces Team
    `,
    invoiceSubject: "Your Serene Spaces Invoice",
    invoiceBody: `
Dear {customerName},

Your invoice for {invoiceNumber} is ready.

Total Amount: ${totalAmount}

View Invoice: {invoiceLink}

Thank you for choosing Serene Spaces!

Best regards,
The Serene Spaces Team
    `,
  },
};

// Initialize the application
function initialize() {
  console.log("Serene Spaces Operations initialized");
}
```

#### **Triggers.gs - Form Triggers**

```javascript
// Customer Intake Form - On Form Submit
function sendWelcomeEmail(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();

    // Extract customer data
    const customerData = {
      name: getResponseByTitle(itemResponses, "Customer Name"),
      phone: getResponseByTitle(itemResponses, "Phone Number"),
      email: getResponseByTitle(itemResponses, "Email Address"),
      address: getResponseByTitle(itemResponses, "Pickup Address"),
      pickupDate: getResponseByTitle(itemResponses, "Preferred Pickup Date"),
      notes: getResponseByTitle(itemResponses, "Notes/Special Instructions"),
    };

    // Send welcome email
    sendEmail(
      customerData.email,
      CFG.emailTemplates.welcomeSubject,
      CFG.emailTemplates.welcomeBody
        .replace("{customerName}", customerData.name)
        .replace("{pickupDate}", customerData.pickupDate)
        .replace("{pickupAddress}", customerData.address),
    );

    // Update Customer Directory
    upsertCustomerDirectory(customerData);

    // Refresh Pickup Confirmation dropdown
    updateCustomerDropdown();

    console.log(
      "Welcome email sent and customer directory updated for:",
      customerData.name,
    );
  } catch (error) {
    console.error("Error in sendWelcomeEmail:", error);
  }
}

// Pickup Confirmation Sheet - On Edit
function masterOnEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const range = e.range;

    // Only process Pickup Confirmation tab
    if (sheet.getName() !== CFG.tabs.pickupConfirmation) return;

    // Check if Customer Name was selected (column D)
    if (range.getColumn() === 4) {
      autofillCustomerInfo(range.getRow());
    }

    // Check if Ready to Invoice became "Yes" (column A)
    if (range.getColumn() === 1 && range.getValue() === "Yes") {
      createInvoice(range.getRow());
    }

    // Check if Send Invoice was clicked (column B)
    if (range.getColumn() === 2 && range.getValue() === "Yes") {
      sendInvoice(range.getRow());
    }
  } catch (error) {
    console.error("Error in masterOnEdit:", error);
  }
}

// Helper function to get response by question title
function getResponseByTitle(itemResponses, title) {
  const item = itemResponses.find(
    (item) => item.getItem().getTitle() === title,
  );
  return item ? item.getResponse() : "";
}
```

#### **CustomerManagement.gs - Customer Operations**

```javascript
// Update Customer Directory with new customer
function upsertCustomerDirectory(customerData) {
  try {
    const sheet = SpreadsheetApp.openById(CFG.spreadsheetId).getSheetByName(
      CFG.tabs.customerDirectory,
    );

    // Check if customer already exists
    const data = sheet.getDataRange().getValues();
    const customerRow = data.findIndex((row) => row[0] === customerData.name);

    if (customerRow > 0) {
      // Update existing customer
      sheet
        .getRange(customerRow + 1, 2, 1, 3)
        .setValues([
          [customerData.email, customerData.phone, customerData.address],
        ]);
    } else {
      // Add new customer
      sheet.appendRow([
        customerData.name,
        customerData.email,
        customerData.phone,
        customerData.address,
        "Active",
        new Date(),
      ]);
    }

    console.log("Customer directory updated for:", customerData.name);
  } catch (error) {
    console.error("Error updating customer directory:", error);
  }
}

// Update Pickup Confirmation dropdown with current customers
function updateCustomerDropdown() {
  try {
    const sheet = SpreadsheetApp.openById(CFG.spreadsheetId).getSheetByName(
      CFG.tabs.customerDirectory,
    );

    // Get active customers
    const data = sheet.getDataRange().getValues();
    const activeCustomers = data
      .filter((row) => row[4] === "Active" && row[0]) // Status = Active and has name
      .map((row) => row[0]); // Just the names

    // Update the form dropdown
    const form = FormApp.openById(CFG.forms.pickupConfirmation);
    const customerQuestion = form.getItems()[0]; // First question should be Customer Name

    if (customerQuestion.getType() === FormApp.ItemType.LIST) {
      customerQuestion.asListItem().setChoiceValues(activeCustomers);
    }

    console.log(
      "Customer dropdown updated with",
      activeCustomers.length,
      "customers",
    );
  } catch (error) {
    console.error("Error updating customer dropdown:", error);
  }
}

// Autofill customer info when name is selected
function autofillCustomerInfo(row) {
  try {
    const sheet = SpreadsheetApp.openById(CFG.spreadsheetId).getSheetByName(
      CFG.tabs.pickupConfirmation,
    );

    const customerName = sheet.getRange(row, 4).getValue(); // Column D

    if (!customerName) return;

    // Get customer info from Directory
    const directorySheet = SpreadsheetApp.openById(
      CFG.spreadsheetId,
    ).getSheetByName(CFG.tabs.customerDirectory);
    const directoryData = directorySheet.getDataRange().getValues();
    const customerRow = directoryData.findIndex(
      (row) => row[0] === customerName,
    );

    if (customerRow > 0) {
      const customerInfo = directoryData[customerRow];

      // Autofill columns V, W, X (Email, Phone, Address)
      sheet.getRange(row, 22, 1, 3).setValues([
        [customerInfo[1], customerInfo[2], customerInfo[3]], // Email, Phone, Address
      ]);
    }
  } catch (error) {
    console.error("Error autofilling customer info:", error);
  }
}
```

#### **InvoiceManagement.gs - Invoice Operations**

```javascript
// Create invoice when Ready to Invoice = Yes
function createInvoice(row) {
  try {
    const sheet = SpreadsheetApp.openById(CFG.spreadsheetId).getSheetByName(
      CFG.tabs.pickupConfirmation,
    );

    const data = sheet.getRange(row, 1, 1, 25).getValues()[0];

    // Calculate total
    const total = calculateInvoiceTotal(data);

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();

    // Create invoice document (you can customize this)
    const invoiceDoc = createInvoiceDocument(data, invoiceNumber, total);

    // Update sheet
    sheet.getRange(row, 19, 1, 2).setValues([["✅", invoiceDoc.getUrl()]]);

    // Add to Invoice Log
    addToInvoiceLog(invoiceNumber, data[3], total, data[21]); // Customer name, total, email

    console.log("Invoice created:", invoiceNumber);
  } catch (error) {
    console.error("Error creating invoice:", error);
  }
}

// Calculate invoice total
function calculateInvoiceTotal(data) {
  let subtotal = 0;

  // Item quantities (columns E-P)
  const quantities = data.slice(4, 16); // Blanket through Leg Straps
  const prices = [
    CFG.pricing.BLANKET_FILL,
    CFG.pricing.SHEET_NO_FILL,
    CFG.pricing.SADDLE_PAD,
    CFG.pricing.WRAPS,
    CFG.pricing.BOOTS,
    CFG.pricing.HOOD_NECK,
    CFG.pricing.FLEECE_GIRTH,
    CFG.pricing.WATERPROOFING,
    CFG.pricing.EXTRA_WASH,
    CFG.pricing.LEG_STRAPS,
  ];

  // Calculate subtotal
  for (let i = 0; i < Math.min(quantities.length, prices.length); i++) {
    if (quantities[i] && quantities[i] > 0) {
      subtotal += quantities[i] * prices[i];
    }
  }

  // Add repair cost
  if (data[14] && data[14] > 0) {
    subtotal += data[14];
  }

  // Add tax
  const tax = subtotal * CFG.pricing.TAX_RATE;
  const total = subtotal + tax;

  return Math.round(total * 100) / 100; // Round to 2 decimal places
}

// Generate unique invoice number
function generateInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `SS-${year}${month}${day}-${random}`;
}

// Create invoice document
function createInvoiceDocument(data, invoiceNumber, total) {
  const doc = DocumentApp.create(`Invoice ${invoiceNumber} - ${data[3]}`);

  // Add invoice content
  const body = doc.getBody();
  body
    .appendParagraph(`Serene Spaces - Invoice ${invoiceNumber}`)
    .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(`Date: ${new Date().toLocaleDateString()}`);
  body.appendParagraph(`Customer: ${data[3]}`);
  body.appendParagraph(`Email: ${data[21]}`);
  body.appendParagraph(`Phone: ${data[22]}`);
  body.appendParagraph(`Address: ${data[23]}`);

  body
    .appendParagraph("")
    .appendParagraph("Services:")
    .setHeading(DocumentApp.ParagraphHeading.HEADING2);

  // Add service items
  const serviceNames = [
    "Blanket (with fill)",
    "Sheet/Fly Sheet",
    "Saddle Pad",
    "Wraps",
    "Boots",
    "Hood/Neck Cover",
    "Fleece Girth",
    "Waterproofing",
    "Extra Wash",
    "Leg Straps",
  ];

  for (let i = 0; i < serviceNames.length; i++) {
    if (data[i + 4] && data[i + 4] > 0) {
      const price = [25, 20, 10, 5, 5, 15, 15, 20, 10, 10][i];
      const lineTotal = data[i + 4] * price;
      body.appendParagraph(
        `${serviceNames[i]} x${data[i + 4]} @ $${price} = $${lineTotal}`,
      );
    }
  }

  if (data[14] && data[14] > 0) {
    body.appendParagraph(`Repairs: $${data[14]}`);
  }

  body
    .appendParagraph("")
    .appendParagraph(
      `Subtotal: $${(total / (1 + CFG.pricing.TAX_RATE)).toFixed(2)}`,
    );
  body.appendParagraph(
    `Tax (6.25%): $${(total * CFG.pricing.TAX_RATE).toFixed(2)}`,
  );
  body.appendParagraph(`Total: $${total.toFixed(2)}`);

  return doc;
}

// Add invoice to log
function addToInvoiceLog(invoiceNumber, customerName, total, email) {
  try {
    const sheet = SpreadsheetApp.openById(CFG.spreadsheetId).getSheetByName(
      CFG.tabs.invoiceLog,
    );

    sheet.appendRow([
      new Date(),
      customerName,
      invoiceNumber,
      total,
      "No", // Email sent initially
      "", // Invoice link will be added
      "", // Notes
    ]);
  } catch (error) {
    console.error("Error adding to invoice log:", error);
  }
}

// Send invoice email
function sendInvoice(row) {
  try {
    const sheet = SpreadsheetApp.openById(CFG.spreadsheetId).getSheetByName(
      CFG.tabs.pickupConfirmation,
    );

    const data = sheet.getRange(row, 1, 1, 25).getValues()[0];
    const customerEmail = data[21];
    const invoiceLink = data[20];

    if (!customerEmail || !invoiceLink) {
      console.error("Missing email or invoice link");
      return;
    }

    // Send email
    const subject = CFG.emailTemplates.invoiceSubject;
    const body = CFG.emailTemplates.invoiceBody
      .replace("{customerName}", data[3])
      .replace("{invoiceNumber}", "INV-" + new Date().getTime())
      .replace("{totalAmount}", `$${data[24] || "0.00"}`)
      .replace("{invoiceLink}", invoiceLink);

    sendEmail(customerEmail, subject, body);

    // Update Invoice Log
    updateInvoiceLogEmailSent(data[3]);

    // Reset Send Invoice column
    sheet.getRange(row, 2).setValue("No");

    console.log("Invoice email sent to:", customerEmail);
  } catch (error) {
    console.error("Error sending invoice:", error);
  }
}

// Update invoice log when email is sent
function updateInvoiceLogEmailSent(customerName) {
  try {
    const sheet = SpreadsheetApp.openById(CFG.spreadsheetId).getSheetByName(
      CFG.tabs.invoiceLog,
    );

    const data = sheet.getDataRange().getValues();
    const row = data.findIndex(
      (row) => row[1] === customerName && row[4] === "No",
    );

    if (row > 0) {
      sheet.getRange(row + 1, 5).setValue("Yes");
      sheet.getRange(row + 1, 6).setValue("Email sent");
    }
  } catch (error) {
    console.error("Error updating invoice log:", error);
  }
}

// Helper function to send emails
function sendEmail(to, subject, body) {
  try {
    GmailApp.sendEmail(to, subject, body);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
```

---

### **Step 5: Set Up Triggers**

1. **In Apps Script, go to Triggers (clock icon)**
2. **Add these triggers:**

#### **Trigger 1: Customer Intake Form Submit**

- **Function**: `sendWelcomeEmail`
- **Event**: `From form`
- **Form**: Your Customer Intake Form
- **Event type**: `On form submit`

#### **Trigger 2: Pickup Confirmation Sheet Edit**

- **Function**: `masterOnEdit`
- **Event**: `From spreadsheet`
- **Spreadsheet**: Your main spreadsheet
- **Event type**: `On edit`

---

### **Step 6: Test Your Workflow**

1. **Submit Customer Intake Form** → Check:
   - Welcome email received
   - Customer appears in Directory
   - Pickup Confirmation dropdown updated

2. **Use Pickup Confirmation Form** → Check:
   - Customer selection autofills contact info
   - Setting "Ready to Invoice = Yes" creates invoice
   - Setting "Send Invoice = Yes" emails customer

---

## 🛡️ **Guardrails & Best Practices**

### **Form Safety**

- ✅ **NEVER** use `addListItem()` in scripts
- ✅ Only update existing dropdowns by item ID
- ✅ Keep "Customer Name" as first question in Pickup Confirmation

### **Sheet Safety**

- ✅ **NEVER** delete columns on live response tabs
- ✅ If layout changes: unlink → reorder → relink → insert A/B columns
- ✅ Always keep D = Customer Name

### **Data Integrity**

- ✅ Single source of truth for pricing (CFG.pricing)
- ✅ Customer Directory is master customer list
- ✅ Invoice Log tracks everything

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Customer dropdown not updating**

- Check Apps Script logs for errors
- Verify form ID in CFG.forms.pickupConfirmation
- Ensure Customer Name is first question

#### **Invoice not creating**

- Check "Ready to Invoice" column is exactly "Yes"
- Verify Apps Script has permission to create documents
- Check console logs for errors

#### **Emails not sending**

- Ensure Gmail API is enabled in Apps Script
- Check recipient email is valid
- Verify trigger is set to "On form submit"

---

## 🚀 **Next Steps**

1. **Replace placeholder IDs** in CFG with your actual:
   - Spreadsheet ID
   - Form IDs
   - Email addresses

2. **Customize email templates** to match your brand

3. **Test end-to-end** with a sample customer

4. **Deploy to production** when ready

---

## 💡 **Pro Tips**

- **Backup your spreadsheet** before major changes
- **Test with sample data** first
- **Monitor Apps Script logs** for any errors
- **Keep pricing updated** in CFG.pricing
- **Use "Deleted" status** instead of removing customers

---

**🎉 You're all set! This system will handle your entire workflow from customer intake to invoicing automatically.**
