var { nanoid } = require("nanoid");
const { google } = require("googleapis");
const keys = require("../utils/keys");
const Task = require("../models/task");
const Lead = require("../models/lead");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");
const moment = require("moment-timezone");

const queryLeadAndTask = async (req) => {
  let query = {};
  let formattedStartDate;
  let formattedEndDate;

  if (req.startDate && req.endDate) {
    let stDate = new Date(req.startDate.toString());
    stDate.setDate(stDate.getDate() - 1);
    formattedStartDate = stDate.toISOString().split("T")[0];

    let edDate = new Date(req.endDate.toString());
    edDate.setDate(edDate.getDate() + 1);
    formattedEndDate = edDate.toISOString().split("T")[0];
  }

  if (!req.startDate && !req.endDate && req.status) {
    query = { status: req.status };
  } else if (req.startDate && req.endDate && !req.status) {
    query = { createdAt: { $gte: formattedStartDate, $lte: formattedEndDate } };
  } else if (req.startDate && req.endDate && req.status) {
    query = {
      createdAt: { $gte: formattedStartDate, $lte: formattedEndDate },
      status: req.status,
    };
  } else if (!req.startDate && !req.endDate && !req.status) {
  }

  const paths = [{ path: "ownerId", select: ["_id", "firstName", "lastName"] }];
  if (req.object === "lead") {
    let leads = await Lead.find(query).sort({ createdAt: 1 }).lean();
    return leads;
  } else if (req.object === "task") {
    let tasks = await Task.find(query)
      .sort({ createdAt: 1 })
      .lean()
      .populate(paths);
    return tasks;
  }
};

exports.getTaskLeadReport = async (req) => {
  const response = await queryLeadAndTask(req);
  return response;
};

exports.getTaskLeadReportCsvBackup = async (req) => {
  const response = await queryLeadAndTask(req);

  let fileName;
  let jsonData;
  let res = {};

  if (req.startDate && req.endDate) {
    fileName = `${req.object}_backup_${req.startDate}_to_${req.endDate}_data.csv`;
  } else if (!req.startDate && !req.endDate && !req.status) {
    fileName = `${req.object}_backup_all_${moment().date()}-${moment().format(
      "MMMM"
    )}- ${moment().year()} ${moment().format("HH-mm-ss")}.csv`;
  } else if (req.startDate && req.endDate && req.status) {
    fileName = `${req.object}_backup_${req.status
      }${moment().date()}-${moment().format(
        "MMMM"
      )}- ${moment().year()} ${moment().format("HH-mm-ss")}.csv`;
  } else {
    fileName = `${req.object}_backup_${req.status
      }_${moment().date()}-${moment().format(
        "MMMM"
      )}- ${moment().year()} (${moment().format("HH-mm-ss")}).csv`;
  }

  if (req.object === "lead") {
    jsonData = response;
  } else if (req.object === "task") {
    jsonData = response;
    console.log('jsonData jsonData owner ==> ', jsonData)
    jsonData.forEach((i) => {
      i.ownerName = i.ownerId.firstName + " " + i.ownerId.lastName;
    });
  }

  // Output file path
  // const outputFilePath = path.join(
  //   "D:",
  //   "batwara",
  //   // "gmail-api",
  //   // "backup",
  //   fileName
  // );


  outputFilePath = path.join("/usr/app/src/data", fileName
  );
  // outputFilePath = path.join("D:/batwara", fileName
  //   );




  // if (!fs.existsSync("/usr/app/src/data")) {
  //   fs.mkdirSync("/usr/app/src/data", { recursive: true });
  // }

  // CSV writer configuration
  const csvWriter = createCsvWriter({
    path: outputFilePath,
    header:
      req.object === "lead"
        ? [
          { id: "salutation", title: "Salutation" },
          { id: "firstName", title: "First Name" },
          { id: "lastName", title: "Last Name" },
          { id: "company", title: "Company" },
          { id: "phone", title: "Phone" },
          { id: "email", title: "Email" },
          { id: "status", title: "Status" },
          { id: "updatedAt", title: "Last_Updated" },
          { id: "type", title: "Type" },
        ]
        : [
          { id: "title", title: "Title" },
          { id: "type", title: "Type" },
          { id: "email", title: "Email" },
          { id: "description", title: "Description" },
          { id: "body", title: "Body" },
          { id: "remarks", title: "Remarks" },
          { id: "priority", title: "Priority" },
          { id: "status", title: "Status" },
          { id: "updatedAt", title: "Last_Updated" },
          { id: "ownerName", title: "ownerId" },
        ],
  });

  try {
    await csvWriter.writeRecords(jsonData);
    res.message = "CSV file has been created successfully";
  } catch (error) {
    res.error = "Error creating CSV file";
    console.error("Error creating CSV file:", error);
  }
  return res;
};

exports.checkValidOrNot = async (req) => {
  let res = {
    error: "",
    data: "",
  };

  const today = new Date();
  today.setDate(today.getDate() + 1);
  todayDate = today.toISOString().split("T")[0];

  if (!req.startDate && req.endDate) {
    res.error = "Fill start date.";
    return res;
  } else if (req.startDate && !req.endDate) {
    res.error = "Fill end date.";
    return res;
  } else if (req.startDate > req.endDate) {
    res.error = "Starting date must be less than ending date.";
    return res;
  } else if (req.endDate > todayDate) {
    res.error = "End date can not greater than today's date.";
    return res;
  } else if (
    (req.startDate && req.endDate && req.status) ||
    (!req.startDate && !req.endDate && req.status) ||
    (req.startDate && req.endDate && !req.status)
  ) {
    res.data = "ok";
    return res;
  } else if (!req.startDate && !req.endDate && !req.status) {
    // res.error = "Select status or date.";
    res.data = "ok";
    return res;
  }
};

exports.getSearchDate = () => {
  let dateTime = Math.round(new Date().getTime() / 1000);
  let yesterday = dateTime - 24 * 3600;
  return yesterday;
};

exports.getSearchDateHalfDayAgo = () => {
  let dateTime = Math.round(new Date().getTime() / 1000);
  let yesterday = dateTime - 12 * 3600;
  return yesterday;
};

exports.getFnameAndLname = (str) => {
  // let str = "mohit tyagi <smartfriendmohit@gmail.com>";
  let strArr = str.split("<");
  let name = strArr[0].trim();
  let firstName = name.split(" ")[0];
  let lastName = name.split(" ")[1];
  let email = strArr[1].split(">")[0].trim();

  const from = { name, firstName, lastName, email };
  return from;
};

exports.capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

exports.includesSubject = (str, filters) => {
  let regex = new RegExp(filters.join("|"), "i");

  if (regex.test(str)) return true;
  return false;
};

exports.getName = (str) => {
  if (str.includes("<") && str.includes(">")) {
    let name = str.split("<")[0].trim();
    name = name.split(" ");
    if (name.length > 2) return [name[0] + " " + name[1], name[2]];
    return name;
  } else {
    return null;
  }
};
exports.getEmail = (str) => {
  if (str.includes("<") && str.includes(">")) {
    return str.split("<")[1].split(">")[0].trim();
  }
  return str;
};

exports.capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

exports.uniqueId = async () => {
  let id = nanoid();
  return `${id}`;
};
