require("dotenv").config();
const { google } = require("googleapis");
const keys = require("../utils/keys");

const oAuth2Client = new google.auth.OAuth2(
  keys.GMAIL_CLIENT_ID,
  keys.GMAIL_CLIENT_SECRET,
  keys.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: keys.GMAIL_REFRESH_TOKEN });

const auth = {
  type: "OAuth2",
  user: keys.GMAIL_ACCOUNT,
  clientId: keys.GMAIL_CLIENT_ID,
  clientSecret: keys.GMAIL_CLIENT_SECRET,
  refreshToken: keys.GMAIL_REFRESH_TOKEN,
};

const mailoptions = {
  from: `Mohit <${keys.GMAIL_ACCOUNT}>`,
  to: keys.GMAIL_ACCOUNT,
  subject: "Gmail API NodeJS",
};

const fromFilters = [
  "smartfriendmohit@gmail.com",
  "shakib.k@ibirdsservices.com",
  "divyanshu.b@ibirdsservices.com",
  "kriti.t@ibirdsservices.com",
];

const leadEnum = [
  "Open",
  "Working",
  "Closed",
];
const taskEnum = ["Open", "Pending", "In Progress", "Closed"];

const priorityEnum = ["High", "Low", "Normal"];

const emailTypeEnum = ["Email"];
const leadTypeEnum = [
  "Assigned",
  "UnAssigned"
];

module.exports = {
  oAuth2Client,
  auth,
  mailoptions,
  fromFilters,
  leadEnum,
  taskEnum,
  priorityEnum,
  emailTypeEnum,
  leadTypeEnum
};
