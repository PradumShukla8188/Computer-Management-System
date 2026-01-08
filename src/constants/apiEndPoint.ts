export const apiEndPoints = {
  LOGIN_API: "/onboarding/login",
  ADD_STUDENT: "/student/create",
  EDIT_STUDENT: "/student/edit",
  DELETE_STUDENT: "/student/delete",
  GET_STUDENT_LIST: "/student",
  GET_STUDENT_BY_ID: "/student",
  UPLOAD: "/file/upload",
  GET_COURSE_LIST: "/course",
  GET_COURSE_BY_ID: "/course",
  ADD_COURSE: "/course/create",
  // EDIT_COURSE: "/course/edit",
  DELETE_COURSE: "/course/delete",

  GET_STUDENT_FEES_LIST: "/student/fees/list"
};

export type APIENDPOINTS_TYPE = keyof typeof apiEndPoints;
