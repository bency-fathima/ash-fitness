import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import clientReducer from "../features/client/client.slice";
import coachReducer from "../features/coach/coach.slice";
import chatReducer from "../features/chat/chat.slice"
import adminReducer from "../features/admins/admin.slice"


import programReducer from "../features/program/program.slice"
import categoryReducer from "../features/category/category.slice"
import therapyReducer from "../features/therapy/therapy.slice"
import headReducer from "../features/head/head.slice"
import workoutReducer from "../features/workout/workout.slice"
import payrollReducer from "../features/incentive/incentive.slice"
import founderReducer from "../features/founder/founder.slice"
import financeReducer from "../features/finance/finance.slice"
import taskReducer from "../features/tasks/task.slice";
import habitReducer from "../features/habit/habit.slice"
import broadcastReducer from "../features/broadcast/broadcast.slice";

export default combineReducers({
  auth: authReducer,
  client: clientReducer,
  coach: coachReducer,
  program: programReducer,
  category: categoryReducer,
  chat: chatReducer,
  admin: adminReducer,
  therapy: therapyReducer,
  head: headReducer,
  workout: workoutReducer,
  payroll: payrollReducer,
  founder: founderReducer,
  finance: financeReducer,
  tasks: taskReducer,
  habit: habitReducer,
  broadcast: broadcastReducer,
});
