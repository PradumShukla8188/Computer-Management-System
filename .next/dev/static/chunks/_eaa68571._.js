(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/badge/Badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const Badge = ({ variant = "light", color = "primary", size = "md", startIcon, endIcon, children })=>{
    const baseStyles = "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium";
    // Define size styles
    const sizeStyles = {
        sm: "text-theme-xs",
        md: "text-sm"
    };
    // Define color styles for variants
    const variants = {
        light: {
            primary: "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
            success: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
            error: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
            warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400",
            info: "bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500",
            light: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
            dark: "bg-gray-500 text-white dark:bg-white/5 dark:text-white"
        },
        solid: {
            primary: "bg-brand-500 text-white dark:text-white",
            success: "bg-success-500 text-white dark:text-white",
            error: "bg-error-500 text-white dark:text-white",
            warning: "bg-warning-500 text-white dark:text-white",
            info: "bg-blue-light-500 text-white dark:text-white",
            light: "bg-gray-400 dark:bg-white/5 text-white dark:text-white/80",
            dark: "bg-gray-700 text-white dark:text-white"
        }
    };
    // Get styles based on size and color variant
    const sizeClass = sizeStyles[size];
    const colorStyles = variants[variant][color];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `${baseStyles} ${sizeClass} ${colorStyles}`,
        children: [
            startIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mr-1",
                children: startIcon
            }, void 0, false, {
                fileName: "[project]/src/components/ui/badge/Badge.tsx",
                lineNumber: 72,
                columnNumber: 21
            }, ("TURBOPACK compile-time value", void 0)),
            children,
            endIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-1",
                children: endIcon
            }, void 0, false, {
                fileName: "[project]/src/components/ui/badge/Badge.tsx",
                lineNumber: 74,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/badge/Badge.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Badge;
const __TURBOPACK__default__export__ = Badge;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/icons/arrow-down.svg.js [app-client] (ecmascript) <export default as ArrowDownIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowDownIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$arrow$2d$down$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$arrow$2d$down$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/icons/arrow-down.svg.js [app-client] (ecmascript)");
}),
"[project]/src/icons/arrow-up.svg.js [app-client] (ecmascript) <export default as ArrowUpIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowUpIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$arrow$2d$up$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$arrow$2d$up$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/icons/arrow-up.svg.js [app-client] (ecmascript)");
}),
"[project]/src/icons/box-line.svg.js [app-client] (ecmascript) <export default as BoxIconLine>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BoxIconLine",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$box$2d$line$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$box$2d$line$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/icons/box-line.svg.js [app-client] (ecmascript)");
}),
"[project]/src/icons/group.svg.js [app-client] (ecmascript) <export default as GroupIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GroupIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$group$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$group$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/icons/group.svg.js [app-client] (ecmascript)");
}),
"[project]/src/components/ecommerce/EcommerceMetrics.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client";
// import Badge from "../ui/badge/Badge";
// import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
// export const EcommerceMetrics = () => {
//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
//       {/* <!-- Metric Item Start --> */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
//         </div>
//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               Students
//             </span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//               3,782
//             </h4>
//           </div>
//           <Badge color="success">
//             <ArrowUpIcon />
//             11.01%
//           </Badge>
//         </div>
//       </div>
//       {/* <!-- Metric Item End --> */}
//       {/* <!-- Metric Item Start --> */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <BoxIconLine className="text-gray-800 dark:text-white/90" />
//         </div>
//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               Courses
//             </span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//               5,359
//             </h4>
//           </div>
//           <Badge color="error">
//             <ArrowDownIcon className="text-error-500" />
//             9.05%
//           </Badge>
//         </div>
//       </div>
//       {/* <!-- Metric Item End --> */}
//     </div>
//   );
// };
__turbopack_context__.s([
    "EcommerceMetrics",
    ()=>EcommerceMetrics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/icons/index.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$arrow$2d$down$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownIcon$3e$__ = __turbopack_context__.i("[project]/src/icons/arrow-down.svg.js [app-client] (ecmascript) <export default as ArrowDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$arrow$2d$up$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpIcon$3e$__ = __turbopack_context__.i("[project]/src/icons/arrow-up.svg.js [app-client] (ecmascript) <export default as ArrowUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$box$2d$line$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoxIconLine$3e$__ = __turbopack_context__.i("[project]/src/icons/box-line.svg.js [app-client] (ecmascript) <export default as BoxIconLine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$group$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GroupIcon$3e$__ = __turbopack_context__.i("[project]/src/icons/group.svg.js [app-client] (ecmascript) <export default as GroupIcon>");
"use client";
;
;
;
const EcommerceMetrics = ()=>{
    // ---- Configuration Array ---- //
    const metrics = [
        {
            title: "Certificate Issued",
            value: "1,240",
            change: "8.5%",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$group$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GroupIcon$3e$__["GroupIcon"],
            isPositive: true
        },
        {
            title: "Result Out",
            value: "980",
            change: "3.2%",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$box$2d$line$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoxIconLine$3e$__["BoxIconLine"],
            isPositive: true
        },
        {
            title: "Waiting for Result",
            value: "312",
            change: "5.1%",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$group$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GroupIcon$3e$__["GroupIcon"],
            isPositive: false
        },
        {
            title: "All Active Students",
            value: "4,780",
            change: "10.4%",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$group$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GroupIcon$3e$__["GroupIcon"],
            isPositive: true
        },
        {
            title: "Running Students",
            value: "3,540",
            change: "6.8%",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$group$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GroupIcon$3e$__["GroupIcon"],
            isPositive: true
        },
        {
            title: "Inactive Students",
            value: "430",
            change: "2.9%",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$box$2d$line$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoxIconLine$3e$__["BoxIconLine"],
            isPositive: false
        },
        {
            title: "Student Payments Due",
            value: "215",
            change: "12.1%",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$box$2d$line$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoxIconLine$3e$__["BoxIconLine"],
            isPositive: false
        },
        {
            title: "Exam Pending",
            value: "150",
            change: "7.3%",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$group$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GroupIcon$3e$__["GroupIcon"],
            isPositive: false
        },
        {
            title: "Pending Payment",
            value: "98",
            change: "4.6%",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$box$2d$line$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoxIconLine$3e$__["BoxIconLine"],
            isPositive: false
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6",
        children: metrics.map((item, idx)=>{
            const Icon = item.icon;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: "text-gray-800 size-6 dark:text-white/90"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
                            lineNumber: 145,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
                        lineNumber: 144,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-end justify-between mt-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-500 dark:text-gray-400",
                                        children: item.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
                                        lineNumber: 150,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90",
                                        children: item.value
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
                                        lineNumber: 153,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
                                lineNumber: 149,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                color: item.isPositive ? "success" : "error",
                                children: [
                                    item.isPositive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$arrow$2d$up$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpIcon$3e$__["ArrowUpIcon"], {}, void 0, false, {
                                        fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
                                        lineNumber: 160,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$arrow$2d$down$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownIcon$3e$__["ArrowDownIcon"], {
                                        className: "text-error-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
                                        lineNumber: 162,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    item.change
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
                                lineNumber: 158,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
                        lineNumber: 148,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, idx, true, {
                fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
                lineNumber: 140,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/src/components/ecommerce/EcommerceMetrics.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = EcommerceMetrics;
var _c;
__turbopack_context__.k.register(_c, "EcommerceMetrics");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/icons/more-dot.svg.js [app-client] (ecmascript) <export default as MoreDotIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MoreDotIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$more$2d$dot$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$more$2d$dot$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/icons/more-dot.svg.js [app-client] (ecmascript)");
}),
"[project]/src/components/ecommerce/MonthlySalesChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MonthlySalesChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/icons/index.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$more$2d$dot$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreDotIcon$3e$__ = __turbopack_context__.i("[project]/src/icons/more-dot.svg.js [app-client] (ecmascript) <export default as MoreDotIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2f$DropdownItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dropdown/DropdownItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2f$Dropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dropdown/Dropdown.tsx [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Dynamically import the ReactApexChart component
const ReactApexChart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/react-apexcharts/dist/react-apexcharts.esm.js [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/react-apexcharts/dist/react-apexcharts.esm.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = ReactApexChart;
function MonthlySalesChart() {
    _s();
    const options = {
        colors: [
            "#465fff"
        ],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "bar",
            height: 180,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "39%",
                borderRadius: 5,
                borderRadiusApplication: "end"
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 4,
            colors: [
                "transparent"
            ]
        },
        xaxis: {
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ],
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            fontFamily: "Outfit"
        },
        yaxis: {
            title: {
                text: undefined
            }
        },
        grid: {
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            x: {
                show: false
            },
            y: {
                formatter: (val)=>`${val}`
            }
        }
    };
    const series = [
        {
            name: "Sales",
            data: [
                168,
                385,
                201,
                298,
                187,
                195,
                291,
                110,
                215,
                390,
                280,
                112
            ]
        }
    ];
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function toggleDropdown() {
        setIsOpen(!isOpen);
    }
    function closeDropdown() {
        setIsOpen(false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-800 dark:text-white/90",
                        children: "Monthly Sales"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative inline-block",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleDropdown,
                                className: "dropdown-toggle",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$icons$2f$more$2d$dot$2e$svg$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreDotIcon$3e$__["MoreDotIcon"], {
                                    className: "text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2f$Dropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dropdown"], {
                                isOpen: isOpen,
                                onClose: closeDropdown,
                                className: "w-40 p-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2f$DropdownItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownItem"], {
                                        onItemClick: closeDropdown,
                                        className: "flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300",
                                        children: "View More"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                                        lineNumber: 126,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2f$DropdownItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownItem"], {
                                        onItemClick: closeDropdown,
                                        className: "flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300",
                                        children: "Delete"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-full overflow-x-auto custom-scrollbar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "-ml-5 min-w-[650px] xl:min-w-full pl-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactApexChart, {
                        options: options,
                        series: series,
                        type: "bar",
                        height: 180
                    }, void 0, false, {
                        fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ecommerce/MonthlySalesChart.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_s(MonthlySalesChart, "+sus0Lb0ewKHdwiUhiTAJFoFyQ0=");
_c1 = MonthlySalesChart;
var _c, _c1;
__turbopack_context__.k.register(_c, "ReactApexChart");
__turbopack_context__.k.register(_c1, "MonthlySalesChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/ChartTab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const ChartTab = ()=>{
    _s();
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("optionOne");
    const getButtonClass = (option)=>selected === option ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800" : "text-gray-500 dark:text-gray-400";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setSelected("optionOne"),
                className: `px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass("optionOne")}`,
                children: "Monthly"
            }, void 0, false, {
                fileName: "[project]/src/components/common/ChartTab.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setSelected("optionTwo"),
                className: `px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass("optionTwo")}`,
                children: "Quarterly"
            }, void 0, false, {
                fileName: "[project]/src/components/common/ChartTab.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setSelected("optionThree"),
                className: `px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass("optionThree")}`,
                children: "Annually"
            }, void 0, false, {
                fileName: "[project]/src/components/common/ChartTab.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/ChartTab.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ChartTab, "bQvHxtz0D86ha/GFiT2RAeFe8ME=");
_c = ChartTab;
const __TURBOPACK__default__export__ = ChartTab;
var _c;
__turbopack_context__.k.register(_c, "ChartTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ecommerce/StatisticsChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatisticsChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$ChartTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/ChartTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
;
"use client";
;
;
;
// Dynamically import the ReactApexChart component
const ReactApexChart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/react-apexcharts/dist/react-apexcharts.esm.js [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/react-apexcharts/dist/react-apexcharts.esm.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = ReactApexChart;
function StatisticsChart() {
    const options = {
        legend: {
            show: false,
            position: "top",
            horizontalAlign: "left"
        },
        colors: [
            "#465FFF",
            "#9CB9FF"
        ],
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "line",
            toolbar: {
                show: false
            }
        },
        stroke: {
            curve: "straight",
            width: [
                2,
                2
            ]
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0
            }
        },
        markers: {
            size: 0,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 6
            }
        },
        grid: {
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            enabled: true,
            x: {
                format: "dd MMM yyyy"
            }
        },
        xaxis: {
            type: "category",
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ],
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px",
                    colors: [
                        "#6B7280"
                    ]
                }
            },
            title: {
                text: "",
                style: {
                    fontSize: "0px"
                }
            }
        }
    };
    const series = [
        {
            name: "Sales",
            data: [
                180,
                190,
                170,
                160,
                175,
                165,
                170,
                205,
                230,
                210,
                240,
                235
            ]
        },
        {
            name: "Revenue",
            data: [
                40,
                30,
                50,
                40,
                55,
                40,
                70,
                100,
                110,
                120,
                150,
                140
            ]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-800 dark:text-white/90",
                                children: "Statistics"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ecommerce/StatisticsChart.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-gray-500 text-theme-sm dark:text-gray-400",
                                children: "Target you’ve set for each month"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ecommerce/StatisticsChart.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ecommerce/StatisticsChart.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start w-full gap-3 sm:justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$ChartTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/src/components/ecommerce/StatisticsChart.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ecommerce/StatisticsChart.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ecommerce/StatisticsChart.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-full overflow-x-auto custom-scrollbar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-[1000px] xl:min-w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactApexChart, {
                        options: options,
                        series: series,
                        type: "area",
                        height: 310
                    }, void 0, false, {
                        fileName: "[project]/src/components/ecommerce/StatisticsChart.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ecommerce/StatisticsChart.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ecommerce/StatisticsChart.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ecommerce/StatisticsChart.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, this);
}
_c1 = StatisticsChart;
var _c, _c1;
__turbopack_context__.k.register(_c, "ReactApexChart");
__turbopack_context__.k.register(_c1, "StatisticsChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BailoutToCSR", {
    enumerable: true,
    get: function() {
        return BailoutToCSR;
    }
});
const _bailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-client] (ecmascript)");
function BailoutToCSR({ reason, children }) {
    if (typeof window === 'undefined') {
        throw Object.defineProperty(new _bailouttocsr.BailoutToCSRError(reason), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    return children;
} //# sourceMappingURL=dynamic-bailout-to-csr.js.map
}),
"[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "encodeURIPath", {
    enumerable: true,
    get: function() {
        return encodeURIPath;
    }
});
function encodeURIPath(file) {
    return file.split('/').map((p)=>encodeURIComponent(p)).join('/');
} //# sourceMappingURL=encode-uri-path.js.map
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PreloadChunks", {
    enumerable: true,
    get: function() {
        return PreloadChunks;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _reactdom = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
const _encodeuripath = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)");
function PreloadChunks({ moduleIds }) {
    // Early return in client compilation and only load requestStore on server side
    if (typeof window !== 'undefined') {
        return null;
    }
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (workStore === undefined) {
        return null;
    }
    const allFiles = [];
    // Search the current dynamic call unique key id in react loadable manifest,
    // and find the corresponding CSS files to preload
    if (workStore.reactLoadableManifest && moduleIds) {
        const manifest = workStore.reactLoadableManifest;
        for (const key of moduleIds){
            if (!manifest[key]) continue;
            const chunks = manifest[key].files;
            allFiles.push(...chunks);
        }
    }
    if (allFiles.length === 0) {
        return null;
    }
    const dplId = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '';
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: allFiles.map((chunk)=>{
            const href = `${workStore.assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(chunk)}${dplId}`;
            const isCss = chunk.endsWith('.css');
            // If it's stylesheet we use `precedence` o help hoist with React Float.
            // For stylesheets we actually need to render the CSS because nothing else is going to do it so it needs to be part of the component tree.
            // The `preload` for stylesheet is not optional.
            if (isCss) {
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                    // @ts-ignore
                    precedence: "dynamic",
                    href: href,
                    rel: "stylesheet",
                    as: "style",
                    nonce: workStore.nonce
                }, chunk);
            } else {
                // If it's script we use ReactDOM.preload to preload the resources
                (0, _reactdom.preload)(href, {
                    as: 'script',
                    fetchPriority: 'low',
                    nonce: workStore.nonce
                });
                return null;
            }
        })
    });
} //# sourceMappingURL=preload-chunks.js.map
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _dynamicbailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)");
const _preloadchunks = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)");
// Normalize loader to return the module as form { default: Component } for `React.lazy`.
// Also for backward compatible since next/dynamic allows to resolve a component directly with loader
// Client component reference proxy need to be converted to a module.
function convertModule(mod) {
    // Check "default" prop before accessing it, as it could be client reference proxy that could break it reference.
    // Cases:
    // mod: { default: Component }
    // mod: Component
    // mod: { default: proxy(Component) }
    // mod: proxy(Component)
    const hasDefault = mod && 'default' in mod;
    return {
        default: hasDefault ? mod.default : mod
    };
}
const defaultOptions = {
    loader: ()=>Promise.resolve(convertModule(()=>null)),
    loading: null,
    ssr: true
};
function Loadable(options) {
    const opts = {
        ...defaultOptions,
        ...options
    };
    const Lazy = /*#__PURE__*/ (0, _react.lazy)(()=>opts.loader().then(convertModule));
    const Loading = opts.loading;
    function LoadableComponent(props) {
        const fallbackElement = Loading ? /*#__PURE__*/ (0, _jsxruntime.jsx)(Loading, {
            isLoading: true,
            pastDelay: true,
            error: null
        }) : null;
        // If it's non-SSR or provided a loading component, wrap it in a suspense boundary
        const hasSuspenseBoundary = !opts.ssr || !!opts.loading;
        const Wrap = hasSuspenseBoundary ? _react.Suspense : _react.Fragment;
        const wrapProps = hasSuspenseBoundary ? {
            fallback: fallbackElement
        } : {};
        const children = opts.ssr ? /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
            children: [
                typeof window === 'undefined' ? /*#__PURE__*/ (0, _jsxruntime.jsx)(_preloadchunks.PreloadChunks, {
                    moduleIds: opts.modules
                }) : null,
                /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                    ...props
                })
            ]
        }) : /*#__PURE__*/ (0, _jsxruntime.jsx)(_dynamicbailouttocsr.BailoutToCSR, {
            reason: "next/dynamic",
            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                ...props
            })
        });
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Wrap, {
            ...wrapProps,
            children: children
        });
    }
    LoadableComponent.displayName = 'LoadableComponent';
    return LoadableComponent;
}
const _default = Loadable; //# sourceMappingURL=loadable.js.map
}),
"[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return dynamic;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _loadable = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)"));
function dynamic(dynamicOptions, options) {
    const loadableOptions = {};
    if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
    }
    const mergedOptions = {
        ...loadableOptions,
        ...options
    };
    return (0, _loadable.default)({
        ...mergedOptions,
        modules: mergedOptions.loadableGenerated?.modules
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-dynamic.js.map
}),
]);

//# sourceMappingURL=_eaa68571._.js.map