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
import ProfileLeftSide from "@/components/clients/ProfileLeftSide";
import ProfileCenterSide from "@/components/clients/ProfileCenterSide";
import ProfileRightSide from "@/components/clients/ProfileRightSide";

const ClientProfile = () => {
  const dispatch = useDispatch();
  const [complianceStats, setComplianceStats] = useState(null);
  const { Id } = useParams();

  const client = useSelector(selectSelectedClient);
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);

  useEffect(() => {
    if (Id) {
      dispatch(getClient({ id: Id }));
      dispatch(fetchClientComplianceStats(Id))
        .unwrap()
        .then((res) => {
          setComplianceStats(res);
        });
    }
  }, [Id, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-4 h-[calc(100vh-120px)] ">
      <div className="w-full lg:w-[25%] lg:overflow-auto no-scrollbar">
        <ProfileLeftSide client={client} complianceStats={complianceStats} />
      </div>
      <div className="w-full lg:w-[50%] lg:overflow-auto no-scrollbar">
        <ProfileCenterSide client={client} />
      </div>
      <div className="w-full lg:w-[25%] lg:overflow-auto no-scrollbar">
        <ProfileRightSide client={client} />
      </div>
    </div>
  );
};

export default ClientProfile;
