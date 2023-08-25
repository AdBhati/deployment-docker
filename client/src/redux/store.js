import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userReducer/userSlice";
import leadSlice from "./leadReducer/leadSlice";
import taskSlice from "./taskReducer/taskSlice";
import emailSlice from "./emailReducer/emailSlice";
import reportSlice from "./reportReducer/reportSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    lead: leadSlice,
    task: taskSlice,
    email: emailSlice,
    report: reportSlice,
  },
});
