const Lead = require("../models/lead");
const Task = require("../models/task");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const { format } = require("format");
const moment = require("moment-timezone");
const {
  getTaskLeadReport,
  getTaskLeadReportCsvBackup,
  checkValidOrNot,
} = require("../utils");

//lead create
const create = async (req, res, next) => {
  try {
    const {
      salutation,
      firstName,
      lastName,
      title,
      company,
      phone,
      email,
      description,
      status,
      type,
      legacyId,
      taskIds,
    } = req.body;
    const lead = new Lead({
      salutation,
      firstName,
      lastName,
      title,
      company,
      phone,
      email,
      description,
      status,
      type,
      legacyId,
      taskIds,
    });
    lead.isDeleted = false;

    await lead.save();
    await Task.deleteOne({ leadId: req.params._id });
    res.status(200).json(lead);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//find all leads

const getAllLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({ isDeleted: false })
      .sort({ updatedAt: -1 })
      .populate("taskIds");
    res.status(200).json(leads);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//find lead by Id
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params._id).populate("taskIds");
    res.status(200).json(lead);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// update lead by id

const update = async (req, res, next) => {
  try {
    const { status, company, phone } = req.body;
    const lead = await Lead.findById(req.params._id).sort({ updatedAt: -1 });
    if (!lead) return res.status(400).json({ error: "Lead doesn't exist" });

    lead.status = status;
    lead.company = company;
    // lead.phone = phone;

    await lead.save();
    res.status(200).json(lead);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// isDeleteLead
const isDeleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params._id);
    // const { isDeleted } = req.body;
    lead.isDeleted = true;

    await lead.save();
    await Task.deleteOne({ leadId: req.params._id });
    res.status(200).json(lead);
  } catch (error) {
    return res.status(500).json({ error: "Lead not found" });
  }
};

// backup leads
const backupLeads = async (req, res) => {
  let response;
  try {
    const checkResponse = await checkValidOrNot(req.body);
    if (!checkResponse.data) {
      return res.status(400).json({ error: checkResponse.error });
    }

    if (checkResponse.data) {
      req.body.object = "lead";
      response = await getTaskLeadReportCsvBackup(req.body);
    }

    if (response?.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ message: response.message });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({ error: "Failed to fetch leads." });
  }
};

// show backup data ====>
const showBackupLeads = async (req, res) => {
  let response;
  try {
    const checkResponse = await checkValidOrNot(req.body);
    if (!checkResponse.data) {
      return res.status(400).json({ error: checkResponse.error });
    }

    if (checkResponse.data) {
      req.body.object = "lead";
      response = await getTaskLeadReport(req.body);
    }

    if (response.length == 0) {
      return res.status(400).json({ error: "No data found." });
    }
    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(400).json({ error: "Failed to fetch leads." });
  }
};

// schedule backup
const schedulebackupLeads = async () => {
  try {
    const leads = await Lead.find().lean(); // Retrieve all leads as plain JavaScript objects

    const formattedDate = moment().format("YYYY-MM-DD-hh-mm-ss"); // Format the date as YYYY-MM-DD
    const csvFileName = `leadBackup_${formattedDate}.csv`;

    const csvWriter = createCsvWriter({
      path: csvFileName,
      header: [
        { id: "salutation", title: "Salutation" },
        { id: "firstName", title: "First Name" },
        { id: "lastName", title: "Last Name" },
        { id: "company", title: "Company" },
        { id: "phone", title: "Phone" },
        { id: "email", title: "Email" },
        { id: "status", title: "Status" },
      ],
    });

    await csvWriter.writeRecords(leads);

    const targetDir = "D:/Restore"; // Update the target directory path
    const targetPath = path.join(targetDir, csvFileName);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }

    fs.rename(csvFileName, targetPath, (err) => {
      if (err) {
        console.error("Error moving lead backup file:", err);
      } else {
        console.log(`Lead backup file  downloaded successfully!`);
      }
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
  }
};

cron.schedule("* * * * *", async () => {
  try {
    // await schedulebackupLeads();
    // console.log(`Lead backup file  downloaded successfully!`);
  } catch (error) {
    console.error("Lead backup error:", error);
  }
});

module.exports = {
  create,
  getAllLeads,
  getLeadById,
  update,
  isDeleteLead,
  showBackupLeads,
  backupLeads,
};
