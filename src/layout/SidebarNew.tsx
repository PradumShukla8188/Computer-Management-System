"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSidebar } from "../context/SidebarContext";

import {
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
} from "../icons/index";

import { FileProtectOutlined } from "@ant-design/icons";

import {
  BookOpen,
  Users,
  ClipboardList,
  Award,
  DollarSign,
  Bell,
  ChevronRight,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

type MenuItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
};

/* ---------------- MENU CONFIG ---------------- */

const navItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: <GridIcon />,
    path: "/",
  },
  {
    name: "Courses",
    icon: <BookOpen size={20} />,
    children: [
        {name:" Course List", path:"/courses"},
    //   { name: "Add Course", path: "/courses/add" },
    ],
  },
  {
    name: "Students",
    icon: <Users size={20} />,
    children: [
      { name: "Students List", path: "/student" },
      { name: "Download Admit Card", path: "/student/admit-card" },
    ],
  },
  {
    name: "Exams",
    icon: <ClipboardList size={20} />,
    children: [
      { name: "Create Exam", path: "/exam/create" },
      { name: "Exam List", path: "/exam/list" },
    ],
  },
  {
    name: "Marks",
    icon: <Award size={20} />,
    children: [
      { name: "Add Marks", path: "/mark/add" },
      { name: "Marks List", path: "/mark/list" },
    ],
  },
  {
    name: "Student Fees",
    icon: <DollarSign size={20} />,
    children: [
        {name:"Fees List", path:"/student-fees"},
      { name: "Add Fee", path: "/student-fees/add-fees" },
    ],
  },
  {
    name: "Student Notice",
    icon: <Bell size={20} />,
    children: [
      { name: "Add Notice", path: "/notice/add" },
      { name: "Notice List", path: "/notice/list" },
    ],
  },
  {
    name: "Institute Setting",
    icon: <UserCircleIcon size={20} />,
    path: "/institue-setting",
  },
  {
    name: "Certificates",
    icon: <FileProtectOutlined />,
    children: [
      { name: "Designer", path: "/certificate/designer" },
      { name: "Issue Certificate", path: "/certificate/issue" },
      { name: "Issued List", path: "/certificate/list" },
    ],
  },
];

/* ---------------- COMPONENT ---------------- */

const AppSidebar: React.FC = () => {
  const pathname = usePathname();

  const {
    isExpanded,
    isHovered,
    isMobileOpen,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();

  /* ---------- OPEN STATE ---------- */

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* ---------- ACTIVE PATH CHECK ---------- */

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path) {
      return (
        pathname === item.path ||
        pathname.startsWith(item.path + "/")
      );
    }

    return item.children?.some(isItemActive) ?? false;
  };

  /* ---------- AUTO OPEN ACTIVE PARENTS ---------- */

  useEffect(() => {
    const buildOpenState = (
      items: MenuItem[],
      map: Record<string, boolean> = {},
    ) => {
      items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some(isItemActive);

          if (hasActiveChild) {
            map[item.name] = true;
          }

          buildOpenState(item.children, map);
        }
      });

      return map;
    };

    setOpenMenus(buildOpenState(navItems));
  }, [pathname]);

  /* ---------- RECURSIVE RENDER ---------- */

  const renderMenu = (items: MenuItem[], level = 0) => (
    <ul className={level === 0 ? "flex flex-col gap-1.5" : "ml-3"}>
      {items.map((item) => {
        const active = isItemActive(item);
        const isOpen = openMenus[item.name];
        const hasChildren = item.children?.length;

        return (
          <li key={item.name}>
            {/* MAIN ITEM */}

            {item.path ? (
              <Link
                href={item.path}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${
                  active
                    ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`shrink-0 ${
                    active
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600"
                  }`}
                >
                  {item.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="font-medium text-sm flex-1">
                    {item.name}
                  </span>
                )}
              </Link>
            ) : (
              <button
                onClick={() => toggleMenu(item.name)}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${
                  active || isOpen
                    ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`shrink-0 ${
                    active || isOpen
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600"
                  }`}
                >
                  {item.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="flex-1 text-left font-medium text-sm">
                      {item.name}
                    </span>

                    <ChevronRight
                      size={16}
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            )}

            {/* CHILDREN */}

            {hasChildren &&
              isOpen &&
              (isExpanded || isHovered || isMobileOpen) && (
                <div className="mt-1 ml-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {renderMenu(item.children!, level + 1)}
                </div>
              )}
          </li>
        );
      })}
    </ul>
  );

  /* ---------------- JSX ---------------- */

  return (
    <>
      {/* Mobile Overlay */}

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-9998 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
        border-r border-gray-200 dark:border-gray-800 z-9999 transition-all duration-300
        ${
          isExpanded || isMobileOpen
            ? "w-70"
            : isHovered
              ? "w-70"
              : "w-18.75"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* LOGO */}

        <div
          className={`flex items-center h-18.25 px-5 border-b border-gray-200 dark:border-gray-800
          ${
            !isExpanded && !isHovered
              ? "lg:justify-center"
              : "justify-start"
          }`}
        >
          <Link href="/" className="flex items-center gap-3">
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <Image
                  src="/images/logo/SST-logo.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="dark:hidden"
                />

                <Image
                  src="/images/logo/logo-dark.svg"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="hidden dark:block"
                />
              </>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
            )}
          </Link>
        </div>

        {/* NAVIGATION */}

        <div className="flex flex-col h-[calc(100vh-73px)] overflow-y-auto scrollbar-thin">
          <nav className="flex-1 p-4">
            <h2
              className={`mb-3 px-3 text-xs font-semibold uppercase tracking-wider
              ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              } text-gray-400`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "Menu"
              ) : (
                <HorizontaLDots />
              )}
            </h2>

            {renderMenu(navItems)}
          </nav>

          {/* COLLAPSED INDICATOR */}

          {!isExpanded && !isHovered && !isMobileOpen && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-center">
                <div className="w-1.5 h-8 bg-linear-to-b from-blue-500 to-indigo-600 rounded-full rounded-full" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
