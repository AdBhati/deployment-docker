const Task = require("../models/task");
const Lead = require("../models/lead");
const mongoose = require("mongoose");


const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const { format } = require("format");
const moment = require('moment-timezone');

// show backup===>
const showBackup = async (req, res) => {
  let durationsValue = '';
  try {
    const { durations, status, tableName } = req.body;

    if (durations == 'weekly') {
      durationsValue = 'week';
    } else if (durations == 'monthly') {
      durationsValue = 'month';
    } else if (durations == 'yearly') {
      durationsValue = 'year';

    }

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    //endDate.setDate(endDate.getDate() + 1);
    const today = new Date();

    if (endDate.setDate(endDate.getDate()) > today || startDate > endDate) {
      return res.status(400).send({ error: "Invalid date range:" });
    }

    const startOfDuration = moment().subtract(1, durationsValue).startOf(durationsValue).toDate();
    const endOfDuration = moment().subtract(1, durationsValue).endOf(durationsValue).toDate();

    let query;


    const convertStartDate = moment.tz(startDate, 'America/New_York').endOf('day').toDate();
    endDate.setDate(endDate.getDate() + 1);
    const convertEndDate = moment.tz(endDate, 'America/New_York').endOf(endDate).toDate();

    if (durationsValue && !status && !req.body.startDate && !req.body.endDate) {
      query = { createdAt: { $gte: startOfDuration, $lte: endOfDuration } };
    } else if (!durationsValue && status && !req.body.startDate && !req.body.endDate) {
      query = { status: status };
    } else if (durationsValue && status && !req.body.endDate && !req.body.endDate) {
      query = { createdAt: { $gte: startOfDuration, $lte: endOfDuration }, status: status };
    } else if (!durationsValue && !status && req.body.endDate && req.body.endDate) {
      query = { createdAt: { $gte: convertStartDate, $lte: convertEndDate } };
    } else if (!durationsValue && status && req.body.endDate && req.body.endDate) {
      query = { createdAt: { $gte: convertStartDate, $lte: convertEndDate }, status: status };
    }

    let data = [];

    if (tableName === 'task') {

      data = await Task.find(query).lean();

    } else {
      data = await Lead.find(query).lean();
    }

    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch tasks." });
  }
};

module.exports = {
  showBackup,
};