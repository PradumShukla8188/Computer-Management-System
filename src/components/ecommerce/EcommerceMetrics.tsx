"use client";

import Badge from "../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "@/icons";

export const EcommerceMetrics = () => {
  // ---- Configuration Array ---- //
  const metrics = [
    {
      title: "Certificate Issued",
      value: "1,240",
      change: "8.5%",
      icon: GroupIcon,
      isPositive: true,
    },
    {
      title: "Result Out",
      value: "980",
      change: "3.2%",
      icon: BoxIconLine,
      isPositive: true,
    },
    {
      title: "Waiting for Result",
      value: "312",
      change: "5.1%",
      icon: GroupIcon,
      isPositive: false,
    },
    {
      title: "All Active Students",
      value: "4,780",
      change: "10.4%",
      icon: GroupIcon,
      isPositive: true,
    },
    {
      title: "Running Students",
      value: "3,540",
      change: "6.8%",
      icon: GroupIcon,
      isPositive: true,
    },
    {
      title: "Inactive Students",
      value: "430",
      change: "2.9%",
      icon: BoxIconLine,
      isPositive: false,
    },
    {
      title: "Student Payments Due",
      value: "215",
      change: "12.1%",
      icon: BoxIconLine,
      isPositive: false,
    },
    {
      title: "Exam Pending",
      value: "150",
      change: "7.3%",
      icon: GroupIcon,
      isPositive: false,
    },
    {
      title: "Pending Payment",
      value: "98",
      change: "4.6%",
      icon: BoxIconLine,
      isPositive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <Icon className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {item.value}
                </h4>
              </div>

              <Badge color={item.isPositive ? "success" : "error"}>
                {item.isPositive ? (
                  <ArrowUpIcon />
                ) : (
                  <ArrowDownIcon className="text-error-500" />
                )}
                {item.change}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};
