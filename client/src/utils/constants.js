export const API = {
  BASE_API:
    process.env.REACT_APP_ENVIRONMENT === "local"
      ? `http://localhost:5000/api`
      : `http://${process.env.REACT_APP_PROD_URI}:5000/api`,
  AUTHENTICATE: "/users/authenticate",
  GET_ALL_LEADS: "/leads",
  GET_ALL_LEADS_REMARKS: "/tasks/remarks",
  GET_ALL_TASKS: "/tasks",
  GET_ALL_USERS: "/users/getUsers",
  GET_ALL_TASKS_BY_LEAD_ID: "/tasks/lead",
  DELETE_LEAD: "/leads/delete",
  SYNC_WITH_EMAIL: "/emails/lead",
  UPDATE_TASKS: "/tasks/",
  COMPARE_OLD_PASSWORD: "/users/check-old-password",
  RESET_PASSWORD: "/users/resetpassword",
  GET_ALL_DASHBOARD_DATA: "/users/dashboard",
  LEAD_BACKUP: "/leads/backup",
  TASK_BACKUP: "/tasks/backup",
  SHOW_TASK_BACKUP: "/tasks/showbackup",
  SHOW_LEAD_BACKUP: "/leads/showbackup",
};

export const leadEnum = ["Open", "Working", "Closed"];
export const taskEnum = ["Open", "Pending", "In Progress", "Closed"];

export const salutationEnum = ["Mr.", "Ms.", "Mrs.", "Prof.", "Dr."];

export const priorityEnum = ["High", "Low", "Normal"];
export const emailTypeEnum = ["Email"];
