"use client";

import { Modal } from "antd";
import { useState } from "react";

const SelectInstitute = ({
  data,
  onSelect,
  loading,
}: {
  data: any;
  onSelect: (val: string) => void;
  loading?: boolean;
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Modal open footer={null} centered width={420}>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Select Your Institute</h2>
        <p className="mt-1 text-sm text-gray-500">Choose where you want to continue</p>
      </div>

      <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto pr-1 pb-2">
        {data?.map((item: any) => {
          const institute = item?.instituteId;
          const role = item?.roleId?.name;

          const isActive = selected === institute?._id;

          return (
            <div
              key={item._id}
              onClick={() => setSelected(institute?._id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                isActive
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-sm"
              } `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{institute?.name}</div>
                  <div className="mt-1 text-xs text-gray-500">{role}</div>
                </div>

                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    isActive ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  } `}
                >
                  {isActive && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        disabled={!selected || loading}
        onClick={() => onSelect(selected!)}
        className={`mt-6 w-full rounded-lg py-2.5 font-medium text-white transition-all ${
          selected ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-300"
        } `}
      >
        {loading ? "Processing..." : "Continue"}
      </button>
    </Modal>
  );
};

export default SelectInstitute;
