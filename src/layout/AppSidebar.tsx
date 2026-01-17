"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
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
  ChevronRight
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    name: "Courses",
    icon: <BookOpen size={20} />,
    path: "/courses",
    subItems: [
      { name: "Add Course", path: "/courses/add", pro: false },
    ],
  },
  {
    name: "Students",
    icon: <Users size={20} />,
    path: "/student",
    subItems: [
      { name: "Add Students", path: "/student/add", pro: false },
      { name: "Download Admit Card", path: "/student/admit-card", pro: false },
    ],
  },
  {
    name: "Exams",
    icon: <ClipboardList size={20} />,
    path: "/exam/list",
    subItems: [
      { name: "Create Exam", path: "/exam/create", pro: false },
      // { name: "Exam List", path: "/exam/list", pro: false },
    ],
  },
  {
    name: "Marks",
    icon: <Award size={20} />,
    path: "/mark/list",
    subItems: [
      { name: "Add Marks", path: "/mark/add", pro: false },
      // { name: "Marks List", path: "/mark/list", pro: false },
    ],
  },
  {
    name: "Student Fees",
    icon: <DollarSign size={20} />,
    path: '/fees/list',
    subItems: [
      { name: "Add Fee", path: "/fees/add", pro: false },
      // { name: "Fees Collection", path: "/fees/list", pro: false },
    ],
  },
  {
    name: "Student Notice",
    icon: <Bell size={20} />,
    path: "/notice/list",
    subItems: [
      { name: "Add", path: "/notice/add", pro: false },
      // { name: "List", path: "/notice", pro: false },
    ],
  },
  {
    name: "Institue Setting",
    icon: <UserCircleIcon size={20} />,
    path: "/institue-setting",
  },
  {
    name: "Certificates",
    icon: <FileProtectOutlined size={20} />,
    path: "/certificate/list",
    subItems: [
        { name: "Designer", path: "/certificate/designer", pro: false },
        { name: "Issue Certificate", path: "/certificate/issue", pro: false },
        { name: "Issued List", path: "/certificate/list", pro: false },
    ],
  }
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => {
      if (path === "/") {
        return pathname === "/";
      }
      return pathname === path || pathname.startsWith(path + "/");
    },
    [pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-1.5">
      {navItems.map((nav, index) => {
        const isSubmenuOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;
        const isItemActive = nav.path ? isActive(nav.path) : false;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <div>
                {nav.path ? (
                  <Link
                    href={nav.path}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isItemActive || isSubmenuOpen
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      } ${!isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "lg:justify-start"
                      }`}
                  >
                    <span
                      className={`flex-shrink-0 ${isItemActive || isSubmenuOpen
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <>
                        <span className="flex-1 font-medium text-sm">
                          {nav.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubmenuToggle(index, menuType);
                          }}
                          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <ChevronRight
                            size={16}
                            className={`transition-transform duration-200 ${isSubmenuOpen ? "rotate-90" : ""
                              }`}
                          />
                        </button>
                      </>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleSubmenuToggle(index, menuType)}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isSubmenuOpen
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      } ${!isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "lg:justify-start"
                      }`}
                  >
                    <span
                      className={`flex-shrink-0 ${isSubmenuOpen
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <>
                        <span className="flex-1 font-medium text-sm text-left">
                          {nav.name}
                        </span>
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-200 ${isSubmenuOpen ? "rotate-90" : ""
                            }`}
                        />
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isItemActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    } ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                    }`}
                >
                  <span
                    className={`flex-shrink-0 ${isItemActive
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="font-medium text-sm">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* Submenu */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  height: isSubmenuOpen
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
                }}
              >
                <ul className="mt-1.5 ml-3 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-700 pl-6">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive(subItem.path)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                          }`}
                      >
                        <span className="flex-1">{subItem.name}</span>
                        {subItem.new && (
                          <span className="px-2 py-0.5 text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span className="px-2 py-0.5 text-xs font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                            pro
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[9998] lg:hidden transition-opacity duration-300"
          onClick={() => useSidebar().toggleMobileSidebar()}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 z-[9999] transition-all duration-300 ease-in-out ${isExpanded || isMobileOpen
          ? "w-[280px]"
          : isHovered
            ? "w-[280px]"
            : "w-[75px]"
          } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo Section */}
        <div
          className={`flex items-center h-[73px] px-5 border-b border-gray-200 dark:border-gray-800 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
        >
          <Link href="/" className="flex items-center gap-3">
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <Image
                  className="dark:hidden transition-all duration-300"
                  src="/images/logo/SST-logo.png"
                  alt="Logo"
                  width={120}
                  height={40}
                />
                <Image
                  className="hidden dark:block transition-all duration-300"
                  src="/images/logo/logo-dark.svg"
                  alt="Logo"
                  width={120}
                  height={40}
                />
              </>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100vh-73px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <nav className="flex-1 p-4">
            <div className="flex flex-col gap-6">
              {/* Menu Section */}
              <div>
                <h2
                  className={`mb-3 px-3 text-xs font-semibold uppercase tracking-wider flex items-center ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    } text-gray-400 dark:text-gray-500`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Menu"
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(navItems, "main")}
              </div>
            </div>
          </nav>

          {/* Bottom Section - Collapsed Indicator */}
          {!isExpanded && !isHovered && !isMobileOpen && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-center">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;