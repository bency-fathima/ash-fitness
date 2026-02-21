import { selectPayroll } from "@/redux/features/incentive/incentive.selector";
import {
  createPayroll,
  getPayroll,
} from "@/redux/features/incentive/incentive.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PayrollMenu = ({ setPayrollOpen, payrollOpen }) => {
  const dispatch = useDispatch();

  // toggle states
  const [toggles, setToggles] = useState({
    rating: false,
    extraClient: false,
    extendProgram: false,
    target: false,
  });

  // editable backend payload
  const [payrollData, setPayrollData] = useState({
    rating1: 0,
    rating2: 0,
    rating3: 0,
    extraClient: 0,
    extendProgram30days: 0,
    extendProgram60days: 0,
    extendProgram90days: 0,
    targetAchieved: 0,
  });

  // fetch payroll
  useEffect(() => {
    dispatch(getPayroll());
  }, [dispatch, payrollOpen]);

  const data = useAppSelector(selectPayroll);

  // initialize local state when payroll record changes
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    setPayrollData({
      rating1: data.rating1 ?? 0,
      rating2: data.rating2 ?? 0,
      rating3: data.rating3 ?? 0,
      extraClient: data.extraClient ?? 0,
      extendProgram30days: data.extendProgram30days ?? 0,
      extendProgram60days: data.extendProgram60days ?? 0,
      extendProgram90days: data.extendProgram90days ?? 0,
      targetAchieved: data.targetAchieved ?? 0,
    });

    setToggles({
      rating:
        (data.rating1 ?? 0) > 0 ||
        (data.rating2 ?? 0) > 0 ||
        (data.rating3 ?? 0) > 0,
      extraClient: (data.extraClient ?? 0) > 0,
      extendProgram:
        (data.extendProgram30days ?? 0) > 0 ||
        (data.extendProgram60days ?? 0) > 0 ||
        (data.extendProgram90days ?? 0) > 0,
      target: (data.targetAchieved ?? 0) > 0,
    });
  }, [data?.id, data]);

  const handleToggle = (key) => {
    setToggles((prev) => {
      const nextValue = !prev[key];

      // If turning OFF → reset related fields
      if (!nextValue) {
        setPayrollData((prevData) => {
          switch (key) {
            case "rating":
              return {
                ...prevData,
                rating1: 0,
                rating2: 0,
                rating3: 0,
              };

            case "extraClient":
              return {
                ...prevData,
                extraClient: 0,
              };

            case "extendProgram":
              return {
                ...prevData,
                extendProgram30days: 0,
                extendProgram60days: 0,
                extendProgram90days: 0,
              };

            case "target":
              return {
                ...prevData,
                targetAchieved: 0,
              };

            default:
              return prevData;
          }
        });
      }

      return { ...prev, [key]: nextValue };
    });
  };


  const handleChange = (key, value) => {
    setPayrollData((prev) => ({
      ...prev,
      [key]: Number(value) || 0,
    }));
  };


  const handleSubmit = async () => {
   try {
     const result = await dispatch(createPayroll(payrollData)).unwrap();;
     if (result.success) {
       toast.success("Updated payroll successfully");
       setPayrollOpen(false);
       window.location.reload();
     } else {
       toast.error("Failed to Updated payroll");
     }
     
   } catch (error) {
    toast.error(error || "Failed to update payroll");
   }
  };

  return (
    <div className="absolute z-20 w-full md:w-76 flex flex-col items-center gap-10 bg-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] md:right-1 top-1">
      {/* header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="text-[16px] font-bold text-[#9e5608]">Incentives</h2>
        <button onClick={() => setPayrollOpen(false)}>
          <IoMdClose />
        </button>
      </div>

      {/* form */}
      <div className="flex flex-col items-center gap-8 w-full">
        {/* SECTION 1: Rating */}
        <div className="flex flex-col items-start gap-4 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={toggles.rating}
              onChange={() => handleToggle("rating")}
            />
            <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-checked:bg-[#9e5608] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3" />
            <p className="text-[12px]">Rating Incentives</p>
          </label>

          {toggles.rating && (
            <div className="flex flex-col gap-2 w-full">
              {[
                { label: "4.0 – 4.4", key: "rating1" },
                { label: "4.5 – 4.7", key: "rating2" },
                { label: "4.8 – 5.0", key: "rating3" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-2 w-full"
                >
                  <span className="p-3 bg-[#F8F8F8] rounded-xl text-[11px]">
                    {item.label}
                  </span>
                  <input
                    type="text"
                    placeholder="Enter Amount"
                    value={payrollData[item.key] || ""}
                    className="border border-[#DBDEDD] rounded-xl py-1.5 px-2"
                    onChange={(e) => handleChange(item.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Extra Client */}
        <div className="flex flex-col items-start gap-4 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={toggles.extraClient}
              onChange={() => handleToggle("extraClient")}
            />
            <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-checked:bg-[#9e5608] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3" />
            <p className="text-[12px]">Expert Takes Extra Clients</p>
          </label>

          {toggles.extraClient && (
            <input
              type="text"
              placeholder="Enter Amount"
              value={payrollData.extraClient || ""}
              className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
              onChange={(e) => handleChange("extraClient", e.target.value)}
            />
          )}
        </div>

        {/* SECTION 3: Extend Program */}
        {/* <div className="flex flex-col items-start gap-4 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={toggles.extendProgram}
              onChange={() => handleToggle("extendProgram")}
            />
            <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-checked:bg-[#9e5608] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3" />
            <p className="text-[12px]">Client Extends Program</p>
          </label>

          {toggles.extendProgram && (
            <div className="flex flex-col gap-2 w-full">
              {[
                { label: "30 Days", key: "extendProgram30days" },
                { label: "60 Days", key: "extendProgram60days" },
                { label: "90 Days", key: "extendProgram90days" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-2 w-full"
                >
                  <span className="p-3 bg-[#F8F8F8] rounded-xl text-[11px]">
                    {item.label}
                  </span>
                  <input
                    type="text"
                    placeholder="Enter Amount"
                    value={payrollData[item.key] || ""}
                    className="border border-[#DBDEDD] rounded-xl py-1.5 px-2"
                    onChange={(e) => handleChange(item.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* SECTION 4: Target */}
        {/* <div className="flex flex-col items-start gap-4 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={toggles.target}
              onChange={() => handleToggle("target")}
            />
            <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-checked:bg-[#9e5608] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3" />
            <p className="text-[12px]">Client Target Achieved</p>
          </label>

          {toggles.target && (
            <input
              type="text"
              placeholder="Enter Amount"
              value={payrollData.targetAchieved || ""}
              className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
              onChange={(e) => handleChange("targetAchieved", e.target.value)}
            />
          )}
        </div> */}
      </div>

      {/* footer */}
      <div className="w-full flex flex-col gap-3">
        <p className="text-[11px] text-[#66706D]">
          All incentives apply only to Experts.
        </p>
        <button
          onClick={handleSubmit}
          className="bg-[#9e5608] w-full rounded-lg py-2.5 text-white font-semibold"
        >
          Save & Update
        </button>
      </div>
    </div>
  );
};

export default PayrollMenu;
