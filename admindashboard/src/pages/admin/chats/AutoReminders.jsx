import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

const ReminderCard = ({
  title,
  isActive,
  onToggle,
  settings,
  message,
  icon,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-6 shadow-sm border border-gray-50 flex-1 min-w-[300px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[#9e5608] font-bold text-lg">{title}</h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isActive}
            onChange={onToggle}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9e5608]"></div>
        </label>
      </div>

      <div className="bg-[#F8F9FA] rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-bold text-sm">Time Settings</span>
        </div>
        <div className="space-y-4">
          {settings.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-400">{item.label}</span>
              <span className="text-gray-900 font-medium">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#F8F9FA] rounded-xl p-4 flex flex-col gap-2">
        <span className="text-gray-900 font-bold text-sm">Message</span>
        <p className="text-gray-600 text-xs leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-3 mt-auto pt-4">
        <button className="px-5 py-2.5 bg-[#EBF3F2] text-[#9e5608] rounded-lg text-xs font-bold hover:bg-[#dfecea] transition-colors">
          Edit
        </button>
        <button className="px-5 py-2.5 bg-[#9e5608] text-white rounded-lg text-xs font-bold hover:bg-[#073a35] transition-colors">
          Send Test
        </button>
      </div>
    </div>
  );
};

const AutoReminders = () => {
  const [mealActive, setMealActive] = useState(true);
  const [workoutActive, setWorkoutActive] = useState(true);
  const [therapyActive, setTherapyActive] = useState(true);

  const mealSettings = [
    { label: "Breakfast", time: "8:30 AM" },
    { label: "Lunch", time: "1:00 PM" },
    { label: "Dinner", time: "7:00 PM" },
  ];

  const workoutSettings = [
    { label: "Morning", time: "6:30 AM" },
    { label: "Evening", time: "7:00 PM" },
  ];

  const therapySettings = [{ label: "Daily Reminder", time: "8:00 PM" }];

  return (
    <div className="flex-1 overflow-auto bg-[#F8F9FA] p-6 no-scrollbar">
      <div className="flex flex-wrap gap-6 max-w-7xl mx-auto">
        <ReminderCard
          title="Meal Reminders"
          isActive={mealActive}
          onToggle={() => setMealActive(!mealActive)}
          settings={mealSettings}
          message="Hi! Don't forget to log your meal 🍽️"
        />
        <ReminderCard
          title="Workout Reminders"
          isActive={workoutActive}
          onToggle={() => setWorkoutActive(!workoutActive)}
          settings={workoutSettings}
          message="Time for your workout! 💪 Let's get moving."
        />
        <ReminderCard
          title="Therapy Reminders"
          isActive={therapyActive}
          onToggle={() => setTherapyActive(!therapyActive)}
          settings={therapySettings}
          message="Reminder: Your therapy session is pending 🧘 Take 5 minutes for yourself today."
        />
      </div>
    </div>
  );
};

export default AutoReminders;
