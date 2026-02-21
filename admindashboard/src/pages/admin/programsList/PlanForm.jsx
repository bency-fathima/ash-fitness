import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Trash2,
  Upload,
  Check,
  Edit2,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  createNewPlan,
  uploadPlanMedia,
  getPlanByProgramId,
  updatePlan
} from "@/redux/features/plans/plan.thunk";
import { toast } from "react-toastify";

export default function PlanForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { programId: routeProgramId } = useParams();

  const [weeks, setWeeks] = useState([
    {
      id: 1,
      name: "Week 1",
      title: "Foundation Phase",
      expanded: true,
      days: [
        {
          id: 1,
          name: "Day 1",
          expanded: true,
          exercises: [], // Initial empty exercises
        },
        {
          id: 2,
          name: "Day 2",
          expanded: false,
          exercises: [],
        },
      ],
    },
  ]);

  const [programDetails, setProgramDetails] = useState({
    name: location.state?.title || "", 
    duration: "30 Days",
    clients: []
  });
  
  const [existingPlanId, setExistingPlanId] = useState(null);

  useEffect(() => {
    if (routeProgramId) {
      const fetchPlan = async () => {
        try {
          // Fetch existing plan
          const response = await dispatch(getPlanByProgramId(routeProgramId)).unwrap();
          
          if (response) {
            // Store existing plan ID for update
            setExistingPlanId(response._id);
            setProgramDetails({
               name: response.name,
               duration: response.duration,
               clients: response.clients || []
            });

            // Map weeks/days structure
            if (response.weeks) {
               const mappedWeeks = response.weeks.map((w, i) => ({
                   ...w,
                   id: i + 1, // Ensure numeric ID for UI logic
                   expanded: i === 0,
                   days: w.days.map((d, di) => ({
                       ...d,
                       id: di + 1,
                       expanded: di === 0,
                       exercises: (d.exercises || []).map(ex => ({ ...ex, id: ex._id || String(Date.now() + Math.random()) }))
                   }))
               }));
               setWeeks(mappedWeeks);
            }
          }
        } catch (error) {
           console.error("Error fetching plan:", error);
           toast.error("Could not load plan for editing");
        }
      };
      
      fetchPlan();
    }
  }, [routeProgramId, dispatch]);
  

  const toggleWeek = (id) => {
    setWeeks(
      weeks.map((week) =>
        week.id === id ? { ...week, expanded: !week.expanded } : week,
      ),
    );
  };

  const updateWeekTitle = (weekId, newTitle) => {
    setWeeks(
      weeks.map((week) =>
        week.id === weekId ? { ...week, title: newTitle } : week,
      ),
    );
  };

  const toggleDay = (weekId, dayId) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.map((day) =>
              day.id === dayId ? { ...day, expanded: !day.expanded } : day,
            ),
          };
        }
        return week;
      }),
    );
  };

  const addWeek = () => {
    const newWeek = {
      id: weeks.length + 1,
      name: `Week ${weeks.length + 1}`,
      title: "",
      expanded: true,
      days: [],
    };
    setWeeks([...weeks, newWeek]);
  };

  const addDay = (weekId) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          if (week.days.length >= 7) return week;
          const newDay = {
            id: week.days.length + 1,
            name: `Day ${week.days.length + 1}`,
            expanded: true,
            exercises: [],
          };
          return { ...week, days: [...week.days, newDay] };
        }
        return week;
      }),
    );
  };

  const removeWeek = (weekId) => {
    setWeeks(weeks.filter((week) => week.id !== weekId));
  };

  const removeDay = (weekId, dayId) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.filter((day) => day.id !== dayId),
          };
        }
        return week;
      }),
    );
  };

  const addExercise = (weekId, dayId, exercise) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.map((day) => {
              if (day.id === dayId) {
                return {
                  ...day,
                  exercises: [
                    ...(day.exercises || []),
                    { ...exercise, id: Date.now() },
                  ],
                };
              }
              return day;
            }),
          };
        }
        return week;
      }),
    );
  };

  const updateExercise = (weekId, dayId, exercise) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.map((day) => {
              if (day.id === dayId) {
                return {
                  ...day,
                  exercises: (day.exercises || []).map((ex) =>
                    ex.id === exercise.id ? { ...ex, ...exercise } : ex,
                  ),
                };
              }
              return day;
            }),
          };
        }
        return week;
      }),
    );
  };

  const removeExercise = (weekId, dayId, exerciseId) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.map((day) => {
              if (day.id === dayId) {
                return {
                  ...day,
                  exercises: (day.exercises || []).filter(
                    (ex) => ex.id !== exerciseId,
                  ),
                };
              }
              return day;
            }),
          };
        }
        return week;
      }),
    );
  };

  const handleSave = async () => {
    try {
      const cleanedWeeks = weeks.map((week) => ({
        name: week.name,
        title: week.title,
        days: week.days.map((day) => ({
          name: day.name,
          exercises: (day.exercises || []).map((ex) => {
            const { id, ...rest } = ex;
            return rest;
          }),
        })),
      }));

      const planData = {
        name: programDetails.name,
        duration: programDetails.duration,
        program: location.state?.programId || routeProgramId,
        weeks: cleanedWeeks,
      };

      let response;
      if (existingPlanId) {
          // Update Mode
          response = await dispatch(updatePlan({ planId: existingPlanId, planData })).unwrap();
          if (response) {
            toast.success("Plan updated successfully!");
            navigate(-1);
          }
      } else {
          // Create Mode
          const data = await dispatch(createNewPlan(planData));
          if (data.meta.requestStatus === "fulfilled") {
            toast.success("Plan created successfully");
            navigate(-1);
          } else {
             throw new Error("Failed to create plan");
          }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save plan");
    }
  };
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 h-[calc(95vh-140px)] overflow-y-auto bg-[#F8F9FA]">
      {/* Left Content - Form Area */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#66706D] uppercase tracking-wider">
              Program Name
            </label>
            <span className="text-sm font-bold text-[#9e5608]">
              {location.state?.title}
            </span>
          </div>
          <hr className="border-gray-50" />
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#66706D] uppercase tracking-wider">
              Duration
            </label>
            <div className="flex gap-2">
              {["30 Days", "60 Days", "90 Days"].map((dur, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setProgramDetails({ ...programDetails, duration: dur })
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    programDetails.duration === dur
                      ? "bg-[#EBF3F2] text-[#9e5608] border-transparent"
                      : "bg-white text-[#66706D] border-gray-200"
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create/Edit Plan Structure Header */}
        <h2 className="text-lg font-bold text-[#9e5608]">
          {existingPlanId ? "Edit Plan Structure" : "Create Plan Structure"}
        </h2>

        {/* Weeks List */}
        <div className="flex flex-col gap-4">
          {weeks.map((week) => (
            <div
              key={week.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              {/* Week Header */}
              <div className="p-4 flex items-center justify-between bg-white rounded-t-2xl">
                <h3 className="text-base font-bold text-[#011412]">
                  {week.name}
                </h3>
                <div className="flex items-center gap-2">
                  {(!programDetails.clients || programDetails.clients.length === 0) && (
                    <button
                      onClick={() => removeWeek(week.id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Remove Week"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => toggleWeek(week.id)}
                    className="p-1.5 bg-[#F8F9FA] hover:bg-gray-100 rounded-lg text-[#66706D]"
                  >
                    {week.expanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </div>
              </div>

              {week.expanded && (
                <div className="p-4 pt-0 border-t border-gray-50 rounded-b-2xl">
                  {/* Week Input */}
                  <div className="my-4">
                    <label className="block text-xs font-bold text-[#011412] mb-1.5">
                      Week Title
                    </label>
                    <input
                      type="text"
                      value={week.title}
                      onChange={(e) => updateWeekTitle(week.id, e.target.value)}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#9e5608] transition-colors"
                      placeholder="Enter week title"
                    />
                  </div>

                  {/* Days List */}
                  <div className="flex flex-col gap-4">
                    {week.days.map((day) => (
                      <div
                        key={day.id}
                        className="border border-gray-100 rounded-xl"
                      >
                        {/* Day Header */}
                        <div className="p-3 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
                          <span className="text-sm font-bold text-[#011412]">
                            {day.name}
                          </span>
                          <div className="flex items-center gap-2">
                            {(!programDetails.clients || programDetails.clients.length === 0) && (
                              <button
                                onClick={() => removeDay(week.id, day.id)}
                                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                title="Remove Day"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => toggleDay(week.id, day.id)}
                              className="p-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[#66706D]"
                            >
                              {day.expanded ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Day Content */}
                        {day.expanded && (
                          <div className="p-4 bg-white flex flex-col gap-6 rounded-b-xl">
                            <PlanSection
                              title="Workout Plan"
                              type="Workout"
                              isAssigned={programDetails.clients && programDetails.clients.length > 0}
                              exercises={day.exercises || []}
                              onAddExercise={(exercise) =>
                                addExercise(week.id, day.id, exercise)
                              }
                              onUpdateExercise={(exercise) =>
                                updateExercise(week.id, day.id, exercise)
                              }
                              onRemoveExercise={(exerciseId) =>
                                removeExercise(week.id, day.id, exerciseId)
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {week.days.length < 7 && (
                      <button
                        onClick={() => addDay(week.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#EBF3F2] text-[#9e5608] text-xs font-bold rounded-lg hover:bg-[#dceceb] transition-colors w-fit"
                      >
                        <Plus size={14} />
                        Add New Day
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={addWeek}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#9e5608] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#08443e] transition-all w-fit mx-auto"
          >
            <Plus size={16} />
            Add New Week
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 right-0 bg-gray-50 border-t border-gray-200 p-4 z-10 left-0 lg:left-[225px]">
        {/* Adjust lg:pl-64 based on your actual sidebar width if resizing */}
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          {/* <hr className="w-full text-gray-300" /> */}
          <div className="flex items-center justify-between w-full text-[12px] font-semibold">
            <button className="text-[#011412]"></button>
            <div className="flex gap-2">
              <button className="bg-[#EBF3F2] rounded-md p-2 min-w-[80px]" type="button" onClick={()=>navigate(-1)}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#9e5608] p-2 rounded-md text-white min-w-[120px]"
              >
                {existingPlanId ? "Update Plan" : "Save & Add Plan"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-32"></div>
    </div>
  );
}

const PlanSection = ({
  title,
  type,
  exercises = [],
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
  isAssigned,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const dispatch = useDispatch();

  // Local state for the form
  const [formState, setFormState] = useState({
    name: "",
    notes: "",
    url: "",
    mediaName: "",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const resultAction = await dispatch(
          uploadPlanMedia({
            formData,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total <= 0) return;
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setUploadProgress(percentCompleted);
            },
          }),
        );

        if (uploadPlanMedia.fulfilled.match(resultAction)) {
          const response = resultAction.payload;
          // If successful, response is the data object from axiosInstance (which is response.data from axios)
          if (response.success) {
            setFormState((prev) => ({
              ...prev,
              mediaName: file.name,
              url: response.url,
            }));
            toast.success("File uploaded successfully");
          } else {
            toast.error(response.message || "File upload failed");
          }
        } else {
          if (resultAction.payload) {
            toast.error(resultAction.payload);
          } else {
            toast.error("File upload failed");
          }
        }
      } catch (error) {
        console.error("Upload failed", error);
        toast.error("File upload failed");
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleAddOrUpdate = () => {
    if (!formState.name) return; // Simple validation

    if (editingId) {
      onUpdateExercise({ ...formState, id: editingId });
      setEditingId(null);
    } else {
      onAddExercise(formState);
    }
    setFormState({ name: "", notes: "", url: "", mediaName: "" }); // Reset form
  };

  const handleEditClick = (exercise) => {
    setEditingId(exercise.id);
    setFormState({
      name: exercise.name,
      notes: exercise.notes || "",
      url: exercise.url || "",
      mediaName: exercise.mediaName || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormState({ name: "", notes: "", url: "", mediaName: "" });
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-bold text-[#011412]">{title}</h4>
        <ChevronUp
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4">
          {/* Input Form for New/Edit Exercise */}
          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-[#9e5608] uppercase tracking-wider">
                {editingId ? "Edit Exercise" : "Add New Exercise"}
              </h5>
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="text-xs text-red-500 font-bold hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label={
                  type === "Workout"
                    ? "Exercise Name"
                    : type === "Meal"
                      ? "Meal Name"
                      : "Therapy Type"
                }
                placeholder={
                  type === "Workout"
                    ? "Enter Exercise Name"
                    : type === "Meal"
                      ? "Enter Meal Name"
                      : "Select Therapy Type"
                }
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
              />
              <InputGroup
                label={
                  type === "Workout" || type === "Meal" ? "Notes" : "Attach URL"
                }
                placeholder={
                  type === "Workout" || type === "Meal"
                    ? "Add Notes"
                    : "Paste link here"
                }
                value={
                  type === "Workout" || type === "Meal"
                    ? formState.notes
                    : formState.url
                }
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [type === "Workout" || type === "Meal" ? "notes" : "url"]:
                      e.target.value,
                  })
                }
              />
            </div>
            {/* Input Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(type === "Workout" || type === "Meal") && (
                <InputGroup
                  label="Attach URL"
                  readOnly={true}
                  placeholder="Paste link here"
                  value={formState.url}
                  onChange={(e) =>
                    setFormState({ ...formState, url: e.target.value })
                  }
                />
              )}
              {type === "Therapy" && (
                <InputGroup
                  label="Notes"
                  placeholder="Add Notes"
                  value={formState.notes}
                  onChange={(e) =>
                    setFormState({ ...formState, notes: e.target.value })
                  }
                />
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#011412]">
                  Media Attachment
                </label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#EBF3F2] text-[#011412] text-xs font-bold whitespace-nowrap hover:bg-[#dceceb] transition-colors cursor-pointer"
                  >
                    <Upload size={14} />
                    Upload File
                  </button>
                  <input
                    type="text"
                    placeholder={
                      type === "Workout"
                        ? "Upload Exercise Video"
                        : type === "Meal"
                          ? "Upload Meal Photo/Video"
                          : "Upload Video, Audio and Photos"
                    }
                    className="w-full px-4 py-2.5 text-xs outline-none text-gray-500 placeholder:text-gray-400 bg-white cursor-pointer"
                    readOnly
                    value={formState.mediaName}
                    onClick={() => fileInputRef.current.click()}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="video/*,image/*,audio/*"
                  />
                </div>
                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-[#9e5608] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-[10px] text-gray-500 mt-0.5 text-right">
                      {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAddOrUpdate}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#9e5608] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#08443e] transition-all w-full md:w-fit md:place-self-end"
            >
              {editingId ? <Check size={14} /> : <Plus size={14} />}
              {editingId ? "Update Item" : "Add Item"}
            </button>
          </div>

          {/* List of Added Items */}
          {exercises.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              {exercises.map((ex) => (
                <ExistingItem
                  key={ex.id}
                  name={ex.name}
                  checked={true}
                  isAssigned={isAssigned}
                  onEdit={() => handleEditClick(ex)}
                  onRemove={() => onRemoveExercise(ex.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InputGroup = ({
  label,
  placeholder,
  bg = "transparent",
  value,
  onChange,
  readOnly
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-[#011412]">{label}</label>
    <input
    readOnly={readOnly}
      type="text"
      placeholder={placeholder}
      className={`w-full p-3 ${
        bg === "white" ? "bg-white" : "bg-white"
      } border border-gray-200 rounded-xl text-xs outline-none focus:border-[#9e5608] transition-colors placeholder:text-gray-400`}
      value={value}
      onChange={onChange}
    />
  </div>
);

const ExistingItem = ({ name, checked, onRemove, onEdit, isAssigned }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`p-3 rounded-xl flex items-center justify-between ${
        checked ? "bg-[#F8F9FA]" : "bg-[#F8F9FA]"
      } border border-gray-50 transition-all hover:border-gray-200 relative`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
            checked
              ? "bg-[#9e5608] border-[#9e5608]"
              : "bg-white border-gray-200"
          }`}
        >
          {checked && <Check size={12} className="text-white" />}
        </div>
        <span className="text-xs font-bold text-[#011412]">{name}</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
        >
          <MoreHorizontal size={16} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-8 bg-white border border-gray-100 shadow-xl rounded-lg p-1 min-w-[100px] z-50 flex flex-col gap-1">
            <button
              onClick={() => {
                onEdit();
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md w-full text-left"
            >
              <Edit2 size={12} />
              Edit
            </button>
            {!isAssigned && (
              <button
                onClick={() => {
                  onRemove();
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-md w-full text-left"
              >
                <Trash2 size={12} />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      {/* Overlay to close menu when clicking outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0 bg-transparent"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};
