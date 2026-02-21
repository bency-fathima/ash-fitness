import React, { useEffect, useState } from "react";
import ProfileLeftSide from "@/components/clients/ProfileLeftSide";
import ProfileCenterSide from "@/components/clients/ProfileCenterSide";
import ProfileRightSide from "@/components/clients/ProfileRightSide";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientComplianceStats, getClient } from "@/redux/features/client/client.thunk";
import { useParams } from "react-router-dom";
import {
  selectSelectedClient,
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { SyncLoader } from "react-spinners";

const ClientProfile = () => {
    const [complianceStats, setComplianceStats] = useState(null);
  
  const dispatch = useDispatch();
  const { id } = useParams();

  const client = useSelector(selectSelectedClient);
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);

  const fetchData =async() => {
    dispatch(getClient({ id: id }));
    const compliance = await dispatch(fetchClientComplianceStats(id)).unwrap();
    setComplianceStats(compliance);
  }
  
  useEffect(() => {
     fetchData();   
  }, [id, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-110px)]">
        <SyncLoader color="#9e5608" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-4 h-[calc(100vh-130px)] ">
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
