const ApplicationDetails = require('../models/ApplicationDetails');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Helper: Generate an alphanumeric string
function generateUniqueString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generate unique ID for a given field
async function generateUniqueId(field, length) {
  let id = generateUniqueString(length);
  let exists = await ApplicationDetails.findOne({ [field]: id });
  while (exists) {
    id = generateUniqueString(length);
    exists = await ApplicationDetails.findOne({ [field]: id });
  }
  return id;
}

// Generate PDF letter with specified format and store it in uploads/generatedletters/
async function generateLetterPDF({ fullName, ownerName, area, cityDistrict, pinCode, email, phone }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 72, right: 72 } // set custom margins
    });
    const letterDir = path.join(__dirname, '..', 'uploads', 'generatedletters');
    if (!fs.existsSync(letterDir)) {
      fs.mkdirSync(letterDir, { recursive: true });
    }
    const fileName = Date.now() + '.pdf';
    const filePath = path.join(letterDir, fileName);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header section: Add a logo if available or company name
    // Uncomment and adjust the following lines if you have a logo image
    // const logoPath = path.join(__dirname, '..', 'assets', 'logo.png');
    // if (fs.existsSync(logoPath)) {
    //   doc.image(logoPath, 50, 45, { width: 50 });
    // }
    doc.moveDown(2);

    // Date
    doc.fontSize(10)
       .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
    doc.moveDown(1);

    // From and To details
    doc.font('Helvetica-Bold').text('From:', { continued: true });
    doc.font('Helvetica').text(` ${fullName}`);
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text('To:');
    doc.font('Helvetica').text(ownerName);
    doc.text(area);
    doc.text(cityDistrict);
    doc.text(pinCode);
    doc.moveDown(1);

    // Subject line with underline
    doc.font('Helvetica-Bold').text('Subject: Request for Land Registration', { underline: true });
    doc.moveDown(1);

    // Body of the letter
    const bodyContent = `
Dear ${ownerName},

This letter is to formally request the registration of the land currently under your ownership. We are initiating the process to transfer the ownership to ${fullName}. This request has been forwarded to the ITDA office as part of our registration procedures.

We kindly ask for your cooperation to complete the necessary documentation. If you have any queries or require further clarification, please do not hesitate to reach out via email at ${email} or phone at ${phone}.

Thank you for your prompt attention to this matter.

Sincerely,
${fullName}
Email: ${email}
Phone: ${phone}
    `;
    doc.font('Helvetica').fontSize(12).text(bodyContent, { align: 'left' });

    doc.end();

    stream.on('finish', () => resolve(fileName));
    stream.on('error', (err) => reject(err));
  });
}


exports.generateApplication = async (req, res) => {
  try {
    const {
      username,
      nature,
      fullName,
      email,
      phone,
      aadhar,
      date,
      ownerName,
      surveyNumber,
      area,
      address,
      stateValue,
      cityDistrict,
      pinCode
    } = req.body;

    if (
      !username ||
      !fullName || !email || !phone || !aadhar || !date ||
      !ownerName || !surveyNumber || !area || !address ||
      !stateValue || !cityDistrict || !pinCode || !req.file
    ) {
      return res.status(400).json({ message: "Please fill all required fields and upload a document" });
    }

    const userDoc = req.file.filename;
    const receiptid = await generateUniqueId('receiptid', 8);
    const compno = await generateUniqueId('compno', 6);
    const letterFile = await generateLetterPDF({ fullName, ownerName, area, cityDistrict, pinCode, email, phone });

    const application = new ApplicationDetails({
      receiptid,
      compno,
      username,
      fullName,
      email,
      phone,
      aadharnumber: aadhar,
      date: new Date(date),
      ownerName,
      surveyNumber,
      area: Number(area),
      address,
      state: stateValue,
      city: cityDistrict,
      pincode: pinCode,
      documents: [userDoc, letterFile],
      status: "created",
      createdtimestamp: new Date(),
      lastmodifiedtimestamp: new Date(),
      currentlywith: "User",
      messages: []
    });

    await application.save();
    return res.status(201).json({ message: "Application generated successfully", application });
  } catch (error) {
    console.error("Error generating application:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCreatedApplications = async (req, res) => {
  try {
    const applications = await ApplicationDetails.find({ status: "created" });
    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSentApplications = async (req, res) => {
  try {
    const { username, all } = req.query;
    let filter = { status: { $ne: "created" } };
    if (!all || all !== "true") {
      if (username) {
        filter.username = username;
      } 
    }
    const applications = await ApplicationDetails.find(filter);
    console.log(applications);
    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching sent applications:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationIds, newStatus } = req.body;
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ message: "No application IDs provided" });
    }
    if (!newStatus) {
      return res.status(400).json({ message: "No new status provided" });
    }
    const updateData = { status: newStatus, lastmodifiedtimestamp: new Date() };
    if (newStatus === "Sent to ITDA") {
      updateData.currentlywith = "Clerk";
    }
    const result = await ApplicationDetails.updateMany(
      { _id: { $in: applicationIds } },
      { $set: updateData }
    );
    return res.status(200).json({ message: "Status updated successfully", result });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateApplicationAll = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const {
      fullName,
      email,
      phone,
      aadharnumber,
      date,
      ownerName,
      surveyNumber,
      area,
      address,
      state,
      city,
      pincode
    } = req.body;

    // Retrieve existing application so we can preserve the generated letter
    const existingApplication = await ApplicationDetails.findById(applicationId);
    if (!existingApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Prepare updated data; force status to "Sent to ITDA"
    const updatedData = {
      fullName,
      email,
      phone,
      aadharnumber,
      date: new Date(date),
      ownerName,
      surveyNumber,
      area: Number(area),
      address,
      state,
      city,
      pincode,
      status: "Sent to ITDA",
      currentlywith: "Clerk",
      lastmodifiedtimestamp: new Date()
    };

    // If a new file was uploaded, update the first document entry;
    // otherwise, keep the existing file.
    if (req.file) {
      updatedData.documents = [req.file.filename, existingApplication.documents[1]];
    }

    const updatedApplication = await ApplicationDetails.findByIdAndUpdate(applicationId, updatedData, { new: true });
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found after update" });
    }
    return res.status(200).json({ message: "Application updated successfully", application: updatedApplication });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status, message } = req.body; // Expecting only status and optionally message
    if (!status) {
      return res.status(400).json({ message: "No status provided" });
    }
    const existingApplication = await ApplicationDetails.findById(applicationId);
    if (!existingApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    const updatedData = {
      status,
      lastmodifiedtimestamp: new Date()
    };

    // Set 'currentlywith' based on new status
    if (status === "Sent to ITDA") {
      updatedData.currentlywith = "Clerk";
    } else if (status === "Pending with User") {
      updatedData.currentlywith = "User";
    }

    // If a denial reason is provided, prepend it to the messages array
    if (message) {
      updatedData.messages = [message, ...existingApplication.messages];
    }

    const updatedApplication = await ApplicationDetails.findByIdAndUpdate(
      applicationId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found after update" });
    }
    return res.status(200).json({ message: "Application updated successfully", application: updatedApplication });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// New controller to update survey report and change status to "Sent to Revenue Inspector"
exports.uploadSurveyReport = async (req, res) => {
  try {
    const applicationId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a survey report file." });
    }
    // Find the application by ID
    const application = await ApplicationDetails.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }
    // Ensure the documents array includes the survey report at index 2.
    // Currently, documents[0] is the user upload and documents[1] is the generated letter.
    if (application.documents.length < 3) {
      application.documents.push(req.file.filename);
    } else {
      application.documents[2] = req.file.filename;
    }
    // Update status and other fields as required
    application.status = "Sent to Revenue Inspector";
    application.currentlywith = "Revenue Inspector";
    application.lastmodifiedtimestamp = new Date();
    
    await application.save();
    return res.status(200).json({ message: "Survey report uploaded and application updated successfully", application });
  } catch (error) {
    console.error("Error uploading survey report:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// New controller function to upload certificate and mark application as completed
exports.uploadCertificate = async (req, res) => {
  try {
    const applicationId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a certificate file." });
    }
    // Find the application by ID
    const application = await ApplicationDetails.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }
    // Update the documents array so that the certificate is stored at index 3
    if (application.documents.length < 4) {
      // If the documents array has fewer than 4 items, push the certificate file
      application.documents.push(req.file.filename);
    } else {
      // Otherwise, update the fourth element (index 3)
      application.documents[3] = req.file.filename;
    }
    // Update status and clear currentlywith (or set as needed)
    application.status = "Success";
    application.currentlywith = "";
    application.lastmodifiedtimestamp = new Date();
    
    await application.save();
    return res.status(200).json({ message: "Certificate uploaded and application marked as success.", application });
  } catch (error) {
    console.error("Error uploading certificate:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

