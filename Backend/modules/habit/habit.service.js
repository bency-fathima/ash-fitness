import HabitModel from "./habit.model.js";

export const createHabitsService = async (clientId, habitNames) => {
  const existing = await HabitModel.findOne({ clientId });

  if (existing) {
    throw new Error("Habits already exist for this client");
  }

  const formattedHabits = habitNames.map((name) => ({
    name,
    logs: [],
  }));

  return await HabitModel.create({
    clientId,
    habits: formattedHabits,
  });
};

export const updateHabit = async (habitId, updateData) => {
  return await HabitModel.findByIdAndUpdate(
    habitId,
    { $set: updateData },
    { new: true, runValidators: true },
  );
};

export const getClientHabitsService = async (clientId) => {
  return await HabitModel.findOne({ clientId });
};

export const getHabitByIdService = async (habitId) => {
  return await HabitModel.findOne({ _id: habitId });
};


// export const updateHabitStatusService = async (clientId, habitName, status) => {
//   const habitDoc = await HabitModel.findOne({ clientId });

//   if (!habitDoc) {
//     throw new Error("Habits not found for this client");
//   }

//   const normalizedHabitName = habitName.trim().toLowerCase();

//   console.log(
//     "Requested:",
//     normalizedHabitName,
//     "Available:",
//     habitDoc.habits.map((h) => h.name),
//   );

//   const habit = habitDoc.habits.find(
//     (h) => h.name.toLowerCase() === normalizedHabitName,
//   );

//   if (!habit) {
//     throw new Error("Habit not found");
//   }

//   // today check
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const existingLog = habit.logs.find((log) => {
//     const logDate = new Date(log.date);
//     logDate.setHours(0, 0, 0, 0);
//     return logDate.getTime() === today.getTime();
//   });

//   if (existingLog) {
//     existingLog.status = status;
//   } else {
//     habit.logs.push({ status, date: new Date() });
//   }

//   await habitDoc.save();
//   return habit;
// };


 
export const updateHabitStatusService = async (
  clientId,
  habitId,
  status
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

   const habitDoc = await HabitModel.findOne({ clientId });

  if (!habitDoc) {
    throw new Error("Habit document not found");
  }

   const habit = habitDoc.habits.id(habitId);

  if (!habit) {
    throw new Error("Habit not found");
  }

   const existingLog = habit.logs.find((log) => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  });

  if (existingLog) {
     existingLog.status = status;
  } else {
     habit.logs.push({
      date: new Date(),
      status,
    });
  }

  await habitDoc.save();

  return habit;
};


 
export const getDailyClientHabitSummary = async () => {
  const habits = await HabitModel.find()
    .populate("clientId", "name email");

  const todayString = new Date().toDateString();

  const summary = habits.map((doc) => {
    let done = 0;
    let missed = 0;

    doc.habits.forEach((habit) => {
      const todayLog = habit.logs.find(
        (log) =>
          new Date(log.date).toDateString() === todayString
      );

      if (todayLog) {
        if (todayLog.status === "done") done++;
        if (todayLog.status === "missed") missed++;
      } else {
         missed++;
      }
    });

    const total = doc.habits.length;

    const percentage =
      total > 0
        ? Math.round((done / total) * 100)
        : 0;

    return {
      clientId: doc.clientId._id,
      clientName: doc.clientId.name,
      done,
      missed,
      total,
      percentage,
    };
  });

  return summary;
};



 
export const getWeeklyClientHabitSummaryService = async () => {
  const habits = await HabitModel.find()
    .populate("clientId", "name");

   const today = new Date();
  today.setHours(0, 0, 0, 0);

   const day = today.getDay(); 
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  console.log("Start of Week:", startOfWeek);
  console.log("End of Week:", endOfWeek);

  const summary = habits.map((doc) => {
    let done = 0;
    let missed = 0;

   doc.habits.forEach((habit) => {
  habit.logs.forEach((log) => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    if (
      logDate >= startOfWeek &&
      logDate <= endOfWeek
    ) {
      if (log.status === "done") done++;
      else if (log.status === "missed") missed++;
    }
  });
});

const total = doc.habits.length * 7;
missed = total - done;


   

    const percentage =
      total > 0
        ? Math.round((done / total) * 100)
        : 0;

    return {
      clientId: doc.clientId._id,
      clientName: doc.clientId.name,
      done,
      missed,
      total,
      percentage,
    };
  });

  return summary;
};

