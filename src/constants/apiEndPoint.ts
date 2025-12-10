export const apiEndPoints = {
  LOGIN_API: "/onboarding/login",
  ADD_STUDENT: "/student/create",
  GET_STUDENT_LIST: "/student",
  UPLOAD: "/file/upload",
  GET_COURSE_LIST: "/course"
};

export type APIENDPOINTS_TYPE = keyof typeof apiEndPoints;
