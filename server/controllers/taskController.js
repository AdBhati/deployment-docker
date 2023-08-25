const Task = require("../models/task");
const Lead = require("../models/lead");
const User = require("../models/user");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const moment = require("moment-timezone");
const {
  getTaskLeadReport,
  getTaskLeadReportCsvBackup,
  checkValidOrNot,
} = require("../utils");

const getAllTasks = async (req, res, next) => {
  try {
    let tasks = [];

    const paths = [
      { path: "leadId" },
      { path: "ownerId", select: "-password" },
    ];

    if (req.role === "USER") {
      tasks = await Task.find({ ownerId: req.userId })
        .sort({ updatedAt: -1 })
        .populate(paths);
    } else {
      tasks = await Task.find().sort({ updatedAt: -1 }).populate(paths);
    }

    res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// create task
const create = async (req, res, next) => {

  try {
    const {
      legacyId,
      title,
      type,
      email,
      description,
      body,
      priority,
      leadId,
      ownerId,
      status,
      invoiceNumber,
      remarks,
    } = req.body;

    if (
      !title ||
      !type ||
      !email ||
      !description ||
      !priority ||
      !leadId ||
      !ownerId ||
      !status ||
      (!invoiceNumber && status === "Closed")
    ) {
      throw new Error("Please fill all the required fields.");
    }

    if (invoiceNumber) {
      const isInvoiceNumberExists = await Task.findOne({ invoiceNumber });
      if (isInvoiceNumberExists)
        return res
          .status(400)
          .json({ error: "Invoice number must be a unique value@@@" });
    }

    const task = new Task(req.body);

    await task.save();

    const lead = await Lead.findById(leadId).sort({ updatedAt: -1 });
    lead.taskIds.push(task);
    await lead.save();

    res.status(200).json(task);
  } catch (error) {
    let errorMessage = error.message;
    if (error.message.includes(["invoiceNumber"])) {
      errorMessage = "Invoice number must be a unique value###";
    }
    return res.status(500).json({ error: errorMessage });
  }
};

//get Task by id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params._id).sort({ updatedAt: -1 });
    res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get Tasks by leadId
const getTasksByLeadId = async (req, res, next) => {
  try {
    const tasks = await Task.find({ leadId: req.params.leadId })
      .populate("ownerId")
      .sort({
        createdAt: -1,
      });

    let refinedTasks = [];
    tasks.forEach((task) => {
      delete task.ownerId.password;
      refinedTasks.push(task);
    });

    res.status(200).json(refinedTasks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get Tasks by ownerID
const getTasksByOwnerId = async (req, res, next) => {
  try {
    const ownerId = req.userId;
    const tasks = await Task.findById(ownerId)
      .sort({ createdAt: -1 })
      .populate("ownerId");
    res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//update task
const update = async (req, res, next) => {

  try {
    const {
      ownerId,
      title,
      type,
      email,
      description,
      body,
      remarks,
      status,
      priority,
      invoiceNumber,
      isCompleted,
    } = req.body;

    const task = await Task.findById(req.params._id);
    if (!task) return res.status(400).json({ error: "Task doesn't exist" });

    // if invoice number is present, task is disabled and can't be updated
    if (task.invoiceNumber)
      return res
        .status(400)
        .json({ error: "Task can't be updated as per it's status" });

    if (status === "Closed" && invoiceNumber) {
      const isInvoiceNumberExists = await Task.findOne({ invoiceNumber });
      if (isInvoiceNumberExists)
        return res
          .status(400)
          .json({ error: "Invoice number must be a unique value" });
    } else if (status === "Closed" && !invoiceNumber)
      return res.status(500).json({ error: "Task can't be updated" });

    task.invoiceNumber = invoiceNumber;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (ownerId) task.ownerId = ownerId;
    if (title) task.title = title;
    if (type) task.type = type;
    if (email) task.email = email;
    if (description) task.description = description;
    if (body) task.body = body;
    if (remarks) task.remarks = remarks;
    if (status) task.status = status;
    if (remarks) task.remarks = remarks;
    isCompleted ? task.isCompleted = isCompleted : task.isCompleted = false

    task.save();

    res.status(200).json(task);
  } catch (error) {
    let errorMessage = error.message;
    if (error.message.includes(["invoiceNumber"])) {
      errorMessage = "Invoice number must be a unique value";
    }
    return res.status(500).json({ error: errorMessage });
  }
};



const getTasksWithRemarks = async (req, res, next) => {

  try {
    const tasks = await Task.find({ leadId: req.params._id });

    res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch tasks with remarks" });
  }
};


// backup tasks
const backupTask = async (req, res) => {
  let response;

  try {
    const checkResponse = await checkValidOrNot(req.body);
    if (!checkResponse.data) {
      return res.status(400).json({ error: checkResponse.error });
    }

    if (checkResponse.data) {
      req.body.object = "task";
      response = await getTaskLeadReportCsvBackup(req.body);
    }
    if (response?.error) {
      return res.status(400).json({ message: response.error });
    }

    return res.status(200).json({ message: response.message });
  } catch (error) {
    console.error("Error fetching backup tasks:", error);
    return res.status(500).json({ error: "Failed to fetch tasks." });
  }
};

// show backup tasks===>
const showBackupTasks = async (req, res) => {
  try {
    const checkResponse = await checkValidOrNot(req.body);
    if (!checkResponse.data) {
      return res.status(400).json({ error: checkResponse.error });
    }

    if (checkResponse.data) {
      req.body.object = "task";
      response = await getTaskLeadReport(req.body);
    }
    if (response.length == 0) {
      return res.status(400).json({ error: "No data found." });
    }

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("Error fetching show tasks:", error);
    return res.status(400).json({ error: "Failed to fetch tasks." });
  }
};

// schedule backup function
const schedulebackupTasks = async () => {
  try {
    const tasks = await Task.find().lean(); // Retrieve all tasks as plain JavaScript objects

    const formattedDate = moment().format("YYYY-MM-DD-hh-mm-ss"); // Format the date as YYYY-MM-DD
    const csvFileName = `taskBackup_${formattedDate}.csv`;

    const csvWriter = createCsvWriter({
      path: csvFileName,
      header: [
        { id: "title", title: "Title" },
        { id: "type", title: "Type" },
        { id: "email", title: "Email" },
        { id: "description", title: "Description" },
        { id: "body", title: "Body" },
        { id: "remarks", title: "Remarks" },
        { id: "priority", title: "Priority" },
        { id: "status", title: "Status" },
      ],
    });

    await csvWriter.writeRecords(tasks);

    const targetDir = "D:/newFolder"; // Update the target directory path
    const targetPath = path.join(targetDir, csvFileName);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }

    fs.rename(csvFileName, targetPath, (err) => {
      if (err) {
        console.error("Error moving task backup file:", err);
      } else {
      }
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

cron.schedule("* * * * *", async () => {
  try {
  } catch (error) {
    console.error("task backup error:", error);
  }
});

module.exports = {
  getAllTasks,
  create,
  getTaskById,
  update,
  getTasksByLeadId,
  getTasksByOwnerId,
  backupTask,
  showBackupTasks,
  getTasksWithRemarks,
};
