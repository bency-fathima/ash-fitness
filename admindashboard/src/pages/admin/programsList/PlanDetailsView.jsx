import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useDispatch } from "react-redux";
import { getPlanByProgramId, deletePlan } from "@/redux/features/plans/plan.thunk";
import { toast } from 'react-toastify';

export default function PlanDetailsView() {
  const location = useLocation();
  const navigate = useNavigate();
  const planData = location.state;
  const dispatch = useDispatch();

  const [weeks, setWeeks] = useState([]);
  const [planId, setPlanId] = useState(null);
  const [programDetails, setProgramDetails] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setShowMenu(false);
    if (showMenu) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const handleEdit = (e) => {
    e.stopPropagation();
    if (planData?.programId) {
      navigate(`/admin/programs/plan/edit/${planData.programId}`);
    }
  };


  const handleDelete = async (e) => {
    e.stopPropagation();
    if (planId) {
      if(window.confirm("Are you sure you want to delete this plan?")) {
        try {
          await dispatch(deletePlan(planId)).unwrap();
          toast.success("Plan deleted successfully");
          navigate("/admin/programs"); 
        } catch (error) {
          toast.error(error.message || "Failed to delete plan");
        }
      }
    }
  };

  const fetchPlanById = async () => {
    const data = await dispatch(getPlanByProgramId(planData?.programId));
    if (data.payload) {
      setPlanId(data.payload._id);
      // Collect all unique media from exercises
      const allMedia = new Map();
      
      data.payload.weeks.forEach((week) => {
        week.days.forEach((day) => {
          day.exercises.forEach((ex) => {
            if (ex.mediaName && ex.mediaName !== "N/A" && ex.url && ex.url !== "N/A") {
              // Use URL as unique key to avoid duplicates
              if (!allMedia.has(ex.url)) {
                allMedia.set(ex.url, {
                  name: ex.mediaName,
                  url: ex.url,
                  type: ex.url.toLowerCase().includes('.pdf') ? 'pdf' : 'image',
                  size: '' // Size not available in data
                });
              }
            }
          });
        });
      });

      setProgramDetails({
        name: data.payload.name,
        duration: data.payload.duration,
        clients: data.payload.clients || 0,
        planMedia: Array.from(allMedia.values()),
      });

      const formattedWeeks = data.payload.weeks.map((week, index) => ({
        ...week,
        id: week?._id,
        expanded: index === 0,
        days: week.days.map((day, dIndex) => {
          // Remove duplicate exercises within the same day
          const uniqueExercises = [];
          const seen = new Set();
          
          day.exercises.forEach((ex) => {
            const key = `${ex.name}-${ex.url}-${ex.mediaName}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueExercises.push({
                exercise: ex.name || "N/A",
                notes: ex.notes || "N/A",
                url: ex.url || "N/A",
                media: ex.mediaName || "N/A",
              });
            }
          });

          return {
            ...day,
            id: day?._id,
            expanded: dIndex === 0,
            workoutPlan: uniqueExercises,
          };
        }),
      }));
      setWeeks(formattedWeeks);
    }
  };

  useEffect(() => {
    fetchPlanById();
  }, []);
  const user = useAppSelector(selectUser);

  // Sample data structure - replace with actual data from API

  const toggleWeek = (id) => {
    setWeeks(
      weeks.map((week) =>
        week.id === id ? { ...week, expanded: !week.expanded } : week,
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen bg-[#F8F9FA]">
      {/* Left Content - Main Details */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#66706D] uppercase tracking-wider">
              Program Name
            </label>
            <span className="text-sm font-bold text-[#9e5608]">
              {programDetails?.name}
            </span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#66706D] uppercase tracking-wider">
              Duration
            </label>
            <div className="flex gap-2">
              {["30 Days", "60 Days", "90 Days"].map((dur, i) => (
                <button
                  key={i}
                  disabled
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border ${
                    programDetails?.duration === dur
                      ? "bg-[#EBF3F2] text-[#9e5608] border-transparent"
                      : "bg-white text-[#66706D] border-gray-200"
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#66706D] uppercase tracking-wider">
              Clients
            </label>
            <span className="text-sm font-bold text-[#9e5608]">
              {programDetails?.clients?.length || 0} Clients
            </span>
          </div>
        </div>

        {/* Weekly Plan Structure Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#9e5608]">
            Weekly Plan Structure
          </h2>
          
          <div className="relative">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreHorizontal size={20} className="text-[#66706D]" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 overflow-hidden">
                <button 
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#011412] hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit Plan
                </button>
                
                {(!programDetails?.clients || programDetails.clients.length === 0) && (
                  <button 
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50"
                  >
                    <Trash2 size={16} />
                    Delete Plan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Weeks List */}
        <div className="flex flex-col gap-4">
          {weeks.map((week) => (
            <div
              key={week.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              {/* Week Header */}
              <div className="p-4 flex items-center justify-between bg-white rounded-t-2xl border-b border-gray-50">
                <h3 className="text-base font-bold text-[#011412]">
                  {week.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={18} />
                  </button>
                  <button
                    onClick={() => toggleWeek(week.id)}
                    className="p-1.5 hover:bg-gray-50 rounded-lg text-[#66706D] transition-colors"
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
                <div className="p-4 pt-2">
                  {/* Week Title */}
                  {week.title && (
                    <div className="mb-4 pt-2">
                      <p className="text-sm text-[#011412] font-medium">
                        {week.title}
                      </p>
                    </div>
                  )}

                  {/* Days List */}
                  <div className="flex flex-col gap-3">
                    {week.days.map((day) => (
                      <div
                        key={day.id}
                        className="border border-gray-100 rounded-xl overflow-hidden"
                      >
                        {/* Day Header */}
                        <div className="p-3 flex items-center justify-between bg-gray-50/50">
                          <span className="text-sm font-bold text-[#011412]">
                            {day.name}
                          </span>
                          <button
                            onClick={() => toggleDay(week.id, day.id)}
                            className="p-1 hover:bg-white rounded-lg text-[#66706D] transition-colors"
                          >
                            {day.expanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </div>

                        {/* Day Content */}
                        {day.expanded && day.workoutPlan.length > 0 && (
                          <div className="p-4 bg-white">
                            <WorkoutPlanSection workoutPlan={day.workoutPlan} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:w-80 flex flex-col gap-4">
        {/* Plan Media */}
        <div
          className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm ${programDetails?.planMedia?.length > 0 ? "" : "min-h-[25vh]"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#011412]">Plan Media</h3>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {programDetails?.planMedia?.map((media, index) => (
              <MediaItem
                key={index}
                name={media.name}
                size={media.size}
                type={media.type}
                url={media.url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const WorkoutPlanSection = ({ workoutPlan }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="text-sm font-bold text-[#011412]">Workout Plan</h4>
        <button className="p-1 hover:bg-gray-50 rounded-lg transition-colors">
          {isExpanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-4">
          {workoutPlan.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F8F9FA] rounded-xl border border-gray-50"
            >
              <DetailField label="Exercise" value={item.exercise} />
              <DetailField label="Notes" value={item.notes} />
              <DetailField label="URL" value={item.url} isLink />
              <DetailField label="Media" value={item.media} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DetailField = ({ label, value, isLink = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-[#66706D] uppercase tracking-wider">
      {label}
    </label>
    {isLink && value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[#9e5608] hover:underline break-all"
      >
        {value}
      </a>
    ) : (
      <p className="text-sm text-[#011412] break-words leading-relaxed">
        {value || "-"}
      </p>
    )}
  </div>
);

const MediaItem = ({ name, size, type, url }) => {
  const getIcon = () => {
    if (type === "pdf") {
      return (
        <div className="w-10 h-10 bg-[#FFF4E6] rounded-lg flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
              stroke="#FF9500"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2V8H20"
              stroke="#FF9500"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 bg-[#EBF3F2] rounded-lg flex items-center justify-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            stroke="#9e5608"
            strokeWidth="2"
          />
          <circle cx="8.5" cy="8.5" r="1.5" fill="#9e5608" />
          <path
            d="M21 15L16 10L5 21"
            stroke="#9e5608"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg border border-gray-50 hover:border-gray-200 transition-colors cursor-pointer"
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#011412] truncate">{name}</p>
        {size ? (
          <p className="text-[10px] text-[#66706D] mt-0.5">
            {type.toUpperCase()} • {size}
          </p>
        ) : (
          <p className="text-[10px] text-[#66706D] mt-0.5">
            {type.toUpperCase()}
          </p>
        )}
      </div>
    </a>
  );
};