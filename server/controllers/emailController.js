require("dotenv").config();
const axios = require("axios");
const { generateConfig } = require("../utils/generateConfig");
const Lead = require("../models/lead");
const Task = require("../models/task");
const UserFilter = require("../models/userFilter");
const { oAuth2Client } = require("../utils/constants");
const { getSearchDate, getSearchDateHalfDayAgo } = require("../utils");
const keys = require("../utils/keys");
const { getName, getEmail, includesSubject } = require("../utils/index.js");
const cron = require("node-cron");
const { leadEnum, leadTypeEnum } = require("../utils/constants");

async function getUser(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.send(error);
  }
}

async function saveLeadAndTasks(req, res) {
  try {
    const LeadsLength = await saveLeadAndTasksHelper("req");

    if (req) {
      if (LeadsLength.assigned > 0 || LeadsLength.unAssigned > 0) return res.json({ message: `${LeadsLength.assigned} Assigned Lead Created   ,   ${LeadsLength.unAssigned} Unassigned Lead Created` });;
      res.json({ message: " No new messages" });
    }

  } catch (error) {
    console.log("Error in saveLeadAndTasks catch====> ", error.message);
    return error;
  }
}




const saveLeadAndTasksHelper = async (req) => {
  let url = `https://gmail.googleapis.com/gmail/v1/users/${keys.GMAIL_ACCOUNT
    }/messages?q="in:inbox after:${req ? getSearchDate() : getSearchDateHalfDayAgo()
    }"`;

  const { token } = await oAuth2Client.getAccessToken();

  const config = generateConfig(url, token);
  const response = await axios(config);

  const { messages } = response.data;

  if (messages) {
    const emailIds = messages.map((message) => message.id);

    const tasks = await Task.find();

    const taskLegacyIds = tasks.map((task) => task.legacyId);

    const newEmailIds = emailIds.filter((emailId) => {
      return !taskLegacyIds.includes(emailId);
    });

    if (newEmailIds.length > 0) {
      const userFilters = await UserFilter.find();
      const filters = userFilters.map((userFilter) => userFilter.filter);
      const emailData = await getEmailData(newEmailIds, token, filters);

      console.log('emailData length >> ', emailData.length);

      const emailThreadIds = new Map();
      const insertLeads = new Map();
      const updateLeads = new Map();
      const legacyIdAndLeadIdMap = new Map();

      emailData.forEach(emailId => {

        if (includesSubject(emailId.subject, filters)) {



          if (emailThreadIds.has(emailId.legacyId)) {
            emailThreadIds.get(emailId.legacyId).push(emailId.id);
          } else {
            emailThreadIds.set(emailId.legacyId, [emailId.id]);
          }

        }
      });




      const existingLeads = await Lead.find({ legacyId: { $in: Array.from(emailThreadIds.keys()) } }).populate('taskIds');

      const unAssignedLeads = await Lead.find({ type: 'UnAssigned' });
      const unAssignedLegacyIds = unAssignedLeads.map(i => i.legacyId);
      const unAssignLegacyIdsSet = new Set();

      if (existingLeads?.length > 0) {


        existingLeads.map(i => {
          legacyIdAndLeadIdMap.set(i.legacyId, i._id);
          updateLeads.set(i.legacyId, emailThreadIds.get(i.legacyId));
        });


      }


      for (const key of emailThreadIds.keys()) {
        if (!updateLeads.has(key)) {
          insertLeads.set(key, emailThreadIds.get(key));
        }
      }
      let newTasksArray = [];
      let newLeadInsertArray = [];
      let newLeadCreate = {};
      let newTaskCreate = {};
      let unAssignedLeadArray = [];

      let tempLeadMap = new Map();
      let tempLeadUpdateMap = new Map();
      let duplicateLegacyId = new Set();

      for (const email of emailData) {
        if (includesSubject(email.subject, filters)) {
          const ownerId = getOwnerId(userFilters, email.subject);



          // Insert
          if (insertLeads && insertLeads.has(email.legacyId) && !duplicateLegacyId.has(email.legacyId)) {

            duplicateLegacyId.add(email.legacyId);



            newLeadCreate = new Lead({
              firstName: getName(email.from)
                ? getName(email.from)[0]
                : getEmail(email.from),

              lastName: getName(email.from)
                ? getName(email.from)[1]
                : getEmail(email.from),

              email: getEmail(email.from),
              legacyId: email.legacyId,
              type: leadTypeEnum[0],
              subject: email.subject,
            });
          }
          newTaskCreate = new Task({
            legacyId: email.id,
            title: email.subject,
            email: getEmail(email.from),
            description: email.description,
            body: email.body,
            leadId: legacyIdAndLeadIdMap.has(email.legacyId) ? legacyIdAndLeadIdMap.get(email.legacyId) : newLeadCreate._id,
            ownerId: ownerId,
          });


          // Update
          if (updateLeads && updateLeads.has(email.legacyId)) {
            duplicateLegacyId.add(email.legacyId);
            if (tempLeadUpdateMap.has(email.legacyId)) {
              tempLeadUpdateMap.get(email.legacyId).push(newTaskCreate);
            } else {
              tempLeadUpdateMap.set(email.legacyId, [newTaskCreate]);
            }

          }

          newTasksArray.push(newTaskCreate);

          if (insertLeads && insertLeads.has(email.legacyId)) {



            // newLeadCreate.taskIds.push(newTaskCreate);


            if (tempLeadMap.has(email.legacyId)) {
              tempLeadMap.get(email.legacyId).taskIds.push(newTaskCreate);
            } else {
              newLeadCreate.taskIds.push(newTaskCreate);
              tempLeadMap.set(email.legacyId, newLeadCreate);
            }



          }

        } else {

          if (!unAssignedLegacyIds.includes(email.legacyId) && !unAssignLegacyIdsSet.has(email.legacyId)) {
            unAssignLegacyIdsSet.add(email.legacyId);
            const newLeadCreateUnAssigned = new Lead({
              firstName: getName(email.from)
                ? getName(email.from)[0]
                : getEmail(email.from),

              lastName: getName(email.from)
                ? getName(email.from)[1]
                : getEmail(email.from),

              email: getEmail(email.from),
              legacyId: email.legacyId,
              type: leadTypeEnum[1],
              subject: email.subject,
            });
            unAssignedLeadArray.push(newLeadCreateUnAssigned);

          }


        }
      }

      for (const key of tempLeadMap.keys()) {
        newLeadInsertArray.push(tempLeadMap.get(key));
      }



      if (existingLeads.length > 0) {
        existingLeads.map(lead => {
          lead.taskIds = lead.taskIds.concat(tempLeadUpdateMap.get(lead.legacyId));

        });
      }


      if (newLeadInsertArray?.length > 0) {
        await Lead.insertMany(newLeadInsertArray);
      }


      if (existingLeads?.length > 0) {
        for (const lead of existingLeads) {
          await Lead.updateOne({ _id: lead._id }, { $set: { taskIds: lead.taskIds } });
        }
      }

      if (unAssignedLeadArray?.length > 0) {
        await Lead.insertMany(unAssignedLeadArray);
      }

      if (newTasksArray?.length > 0) {
        await Task.insertMany(newTasksArray);
      }

      let recNumObj = {
        assigned: newLeadInsertArray.length,
        unAssigned: unAssignedLeadArray.length
      };
      return recNumObj;
    }
  }
};



const getEmailData = async (messageIds, token) => {
  let emailData = [];
  let bodyData = "";
  try {
    for await (const id of messageIds) {
      const url = `https://gmail.googleapis.com/gmail/v1/users/${keys.GMAIL_ACCOUNT}/messages/${id}`;
      const config = generateConfig(url, token);
      const response = await axios(config);


      if (
        response?.data?.payload?.parts?.body?.data &&
        response?.data?.payload?.parts?.body?.size > 0
      ) {
        bodyData = response?.data?.payload?.parts[0]?.body?.data;
      } else {
        bodyData = "";
      }

      const messageData = {
        id: response.data.id,
        legacyId: response.data.threadId,
        description: response.data.snippet,
        body: bodyData ? Buffer.from(bodyData, "base64").toString("ascii") : "",

      };

      response.data.payload.headers.forEach((header) => {
        if (header.name === "To") messageData.to = header.value;
        if (header.name === "From") messageData.from = header.value;
        if (header.name === "Date") messageData.date = header.value;
        if (header.name === "Subject") messageData.subject = header.value;
      });

      emailData.push(messageData);
    }
  } catch (error) {
    console.log("Error in getEmailData catch====> ", error.message);
  }

  return emailData;
};

const getOwnerId = (userFilters, subject) => {
  let userId = null;
  userFilters.map((userFilter) => {
    if (subject.toLowerCase().includes(userFilter.filter.toLowerCase())) {
      userId = userFilter.userId;
    }
  });
  return userId;
};

async function getAllMessages(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.userId}/messages`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);

    const { messages } = response.data;
    const messageIds = [];
    messages.map((message) => messageIds.push(message.id));

    res.json(response.data);
  } catch (error) {
    return error;
  }
}

async function readMail(req, res, next) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${keys.GMAIL_ACCOUNT}/messages/${req.params.messageId}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);

    let data = await response.data;

    res.json(data);
  } catch (error) {
    res.send(error);
  }
}

async function getDrafts(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    return error;
  }
}

cron.schedule("0 * * * *", async () => { // Run every 1 hour
  try {
    await saveLeadAndTasks();
  } catch (error) {
    console.error("task backup error:", error);
  }
});

module.exports = {
  getAllMessages,
  saveLeadAndTasks,
  getUser,
  getDrafts,
  readMail,
  saveLeadAndTasksHelper,
};