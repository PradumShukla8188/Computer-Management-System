export const apiEndPoints = {
  LOGIN_API: "/onboarding/login",
  ADD_STUDENT: "/student/create",
  UPLOAD: "/file/upload",
};

export type APIENDPOINTS_TYPE = keyof typeof apiEndPoints;
