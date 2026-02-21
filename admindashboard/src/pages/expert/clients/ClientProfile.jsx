import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientComplianceStats,
  getClient,
} from "@/redux/features/client/client.thunk";
import { useParams } from "react-router-dom";
import {
  selectSelectedClient,
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { SyncLoader } from "react-spinners";
import ExpertClientProfileLeftSide from "@/components/clients/ExpertClientProfileLeftSide";
import ExpertClientProfileCenterSide from "@/components/clients/ExpertClientProfileCenterSide";
import ExpertClientProfileRightSide from "@/components/clients/ExpertClientProfileRightSide";
import { selectCoachDashboardStats } from "@/redux/features/coach/coach.selector";
import { getAllUserSubmissions } from "@/redux/features/tasks/task.thunk";
import AssignDietPlanDrawer from "./AssignDietPlanDrawer";
import { selectUser } from "@/redux/features/auth/auth.selectores";

const ClientProfile = () => {
  const dispatch = useDispatch();
  const [clientComplianceStats, setClientComplianceStats] = useState(null);
  const [isDietDrawerOpen, setIsDietDrawerOpen] = useState(false);
  const { id } = useParams();

  const user = useSelector(selectUser);

  const client = useSelector(selectSelectedClient);  
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);
  const dashboardStats = useSelector(selectCoachDashboardStats);
  const { selectedUserTasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (id) {
      dispatch(getClient({ id }));
      dispatch(getAllUserSubmissions(id));
      dispatch(fetchClientComplianceStats(id))
        .unwrap()
        .then((res) => {
          setClientComplianceStats(res);
        });
    }
  }, [id, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="flex justify-end mb-2">
        {user?.role === "Dietician" && !client?.dietPlanPdf && (
          <button
            onClick={() => setIsDietDrawerOpen(true)}
            className="bg-[#9e5608] text-white px-4 py-2 rounded-lg"
          >
            Add Diet Plan
          </button>
        )}
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-4 h-[calc(100vh-120px)] ">
        <div className="w-full lg:w-[25%] lg:overflow-auto no-scrollbar">
          <ExpertClientProfileLeftSide
            client={client}
            clientComplianceStats={clientComplianceStats}
            dashboardStats={dashboardStats}
          />
        </div>
        <div className="w-full lg:w-[50%] lg:overflow-auto no-scrollbar">
          <ExpertClientProfileCenterSide
            client={client}
            pendingTasks={selectedUserTasks}
          />
        </div>
        <div className="w-full lg:w-[25%] lg:overflow-auto no-scrollbar">
          <ExpertClientProfileRightSide
            client={client}
            clientComplianceStats={clientComplianceStats}
            dashboardStats={dashboardStats}
          />
        </div>
      </div>

      <AssignDietPlanDrawer
        isOpen={isDietDrawerOpen}
        onClose={() => setIsDietDrawerOpen(false)}
        clientId={id}
      />
    </>
  );
};

export default ClientProfile;
