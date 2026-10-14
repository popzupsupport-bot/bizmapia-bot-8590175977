// GOOGLE APPS SCRIPT - Copy this code to Google Sheets > Extensions > Apps Script
// This will create 5 sheets auto-routing CRM

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Ensure sheets exist
    var sheets = {
      "FinalLeads": getOrCreateSheet(ss, "Sheet1 - Final Leads", ["Timestamp IST", "Phone", "Name", "Place/District", "Fee", "Type", "Occupation", "Agreement Date", "Flow", "Last Step", "Full Message"]),
      "BusinessOpp": getOrCreateSheet(ss, "Sheet2 - Business Opportunity", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Fee", "Type", "Name", "Place"]),
      "Drivers": getOrCreateSheet(ss, "Sheet3 - Drivers", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Reminder Type", "Is Driver", "Name"]),
      "Customers": getOrCreateSheet(ss, "Sheet4 - Customers", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload"]),
      "BusinessDir": getOrCreateSheet(ss, "Sheet5 - Business Directory", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Is BusinessDir", "Offer"]),
      "AllLogs": getOrCreateSheet(ss, "Sheet6 - All Logs", ["Timestamp IST", "Phone", "Direction", "Flow", "Last Step", "Message", "Payload", "Fee", "Type", "Name", "Place", "Occ"]),
      "PendingChats": getOrCreateSheet(ss, "PendingChats", ["Phone", "Last Step", "Last Activity IST", "Diff Minutes", "Reminder Count", "Is Driver", "Is BizDir", "Fee", "Poster", "Buttons"]),
      "DriverReminders": getOrCreateSheet(ss, "DriverReminders", ["Phone", "Last Step", "Diff Hours", "Reminder Type", "Is Driver", "Fee", "Poster"])
    };
    
    var timestamp = data.date || new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'});
    var phone = data.phone || "";
    var direction = data.direction || "";
    var flow = data.flow || "";
    var lastStep = data.lastStep || "";
    var message = data.message || "";
    var payload = data.payload || "";
    var fee = data.currentFee || data.fee || "";
    var type = data.currentType || data.type || "";
    var name = data.name || "";
    var place = data.place || "";
    var occ = data.occ || "";
    var agreementDate = data.agreementDate || "";
    
    // Route logic
    var targetSheet = "AllLogs";
    var isBusinessOpp = flow.includes('EARN') || flow.includes('DISTRICT') || flow.includes('CORP') || flow.includes('MUNICIPAL') || flow.includes('BC_') || flow.includes('READY') || flow.includes('PAY') || flow.includes('LEAD') || flow.includes('EMI');
    var isDriver = flow.includes('DRIVER') || flow.includes('RIDE_ATTACH') || data.isDriver === true || (lastStep && lastStep.toLowerCase().includes('driver'));
    var isCustomer = flow.includes('RIDE_CUSTOMER') || flow.includes('CUSTOMER') || flow.includes('BOOK_RIDE');
    var isBusinessDir = flow.includes('BUSINESS_DIR') || data.isBusinessDir === true;
    var isFinalLead = flow === 'LEAD' && (lastStep === 'Agreement Date' || direction === 'FINAL_LEAD' || data.isFinalLead === true);
    
    // Sheet6 All Logs always
    sheets["AllLogs"].appendRow([timestamp, phone, direction, flow, lastStep, message, payload, fee, type, name, place, occ]);
    
    if (isFinalLead || direction === 'FINAL_LEAD') {
      // Sheet1 Final Leads - Final option selected
      sheets["FinalLeads"].appendRow([timestamp, phone, name, place, fee, type, occ, agreementDate || lastStep, flow, lastStep, message]);
      sheets["BusinessOpp"].appendRow([timestamp, phone, flow, lastStep, message, payload, fee, type, name, place]);
    } else if (isBusinessOpp) {
      // Sheet2 Business Opportunity
      sheets["BusinessOpp"].appendRow([timestamp, phone, flow, lastStep, message, payload, fee, type, name, place]);
    } else if (isDriver) {
      // Sheet3 Drivers
      sheets["Drivers"].appendRow([timestamp, phone, flow, lastStep, message, payload, data.reminderType || "", data.isDriver || "", name]);
    } else if (isCustomer) {
      // Sheet4 Customers
      sheets["Customers"].appendRow([timestamp, phone, flow, lastStep, message, payload]);
    } else if (isBusinessDir) {
      // Sheet5 Business Directory
      sheets["BusinessDir"].appendRow([timestamp, phone, flow, lastStep, message, payload, data.isBusinessDir || "", "1 Year Discount"]);
    }
    
    // Also handle PendingChats update if sent
    if (data.pendingChats) {
      // Clear and rewrite PendingChats
      var pendingSheet = sheets["PendingChats"];
      pendingSheet.clear();
      pendingSheet.appendRow(["Phone", "Last Step", "Last Activity IST", "Diff Minutes", "Reminder Count", "Is Driver", "Is BizDir", "Fee", "Poster", "Buttons"]);
      data.pendingChats.forEach(function(r) {
        pendingSheet.appendRow([r.uid, r.lastStep, r.lastActivityIST, r.diffM, r.reminderCount, r.isDriver, r.isBusinessDir, r.fee, r.poster, r.buttons]);
      });
    }
    
    if (data.driverReminders) {
      var driverRemSheet = sheets["DriverReminders"];
      driverRemSheet.clear();
      driverRemSheet.appendRow(["Phone", "Last Step", "Diff Hours", "Reminder Type", "Is Driver", "Fee", "Poster"]);
      data.driverReminders.forEach(function(r) {
        driverRemSheet.appendRow([r.uid, r.lastStep, r.diffH, r.reminderType, r.isDriver, r.fee, r.poster]);
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({result: "success", routedTo: targetSheet})).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({result: "error", error: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#4285f4").setFontColor("white");
      sheet.setFrozenRows(1);
    }
  } else {
    // Ensure headers exist if sheet is empty
    if (sheet.getLastRow() === 0 && headers) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#4285f4").setFontColor("white");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function doGet(e) {
  return ContentService.createTextOutput("Bizmapia CRM Webhook is running! Use POST to log. Sheets: Final Leads, Business Opportunity, Drivers, Customers, Business Directory, All Logs").setMimeType(ContentService.MimeType.TEXT);
}

// Manual function to create all sheets at once
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  getOrCreateSheet(ss, "Sheet1 - Final Leads", ["Timestamp IST", "Phone", "Name", "Place/District", "Fee", "Type", "Occupation", "Agreement Date", "Flow", "Last Step", "Full Message"]);
  getOrCreateSheet(ss, "Sheet2 - Business Opportunity", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Fee", "Type", "Name", "Place"]);
  getOrCreateSheet(ss, "Sheet3 - Drivers", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Reminder Type", "Is Driver", "Name"]);
  getOrCreateSheet(ss, "Sheet4 - Customers", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload"]);
  getOrCreateSheet(ss, "Sheet5 - Business Directory", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Is BusinessDir", "Offer"]);
  getOrCreateSheet(ss, "Sheet6 - All Logs", ["Timestamp IST", "Phone", "Direction", "Flow", "Last Step", "Message", "Payload", "Fee", "Type", "Name", "Place", "Occ"]);
  getOrCreateSheet(ss, "PendingChats", ["Phone", "Last Step", "Last Activity IST", "Diff Minutes", "Reminder Count", "Is Driver", "Is BizDir", "Fee", "Poster", "Buttons"]);
  getOrCreateSheet(ss, "DriverReminders", ["Phone", "Last Step", "Diff Hours", "Reminder Type", "Is Driver", "Fee", "Poster"]);
}
