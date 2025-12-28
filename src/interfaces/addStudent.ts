export interface addStudent {
  name: string;
  dob: string;
  gender: string;
  religion: string;
  category: string;
  fatherName: string;
  motherName: string;
  mobile: number;
  email: string;
  residentialAddress: string;
  state: string;
  district: string;
  country: string;
  pinCode: string;
  selectedCourse: string;
  courseDuration: string;
  dateOfAdmission: string;
  session: string;
  totalFees: number;
  examMode: string;
  studentPhoto: string;
  uploadEducationProof: string;
  uploadIdentityProof: string;
}

export interface courseData {
    _id: string;
    name: string;
    durationInMonths: number
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  gender: string;
  dob: string;
  fatherName: string;
  motherName: string;
  category: string;
  religion: string;
  residentialAddress: string;
  state: string;
  district: string;
  country: string;
  pinCode: string;
  selectedCourse: string;
  courseName?: string;
  courseDuration: string;
  dateOfAdmission: string;
  session: string;
  totalFees: number;
  examMode: string;
  studentPhoto: string;
  status?: "Active" | "Inactive" | "Pending";
  enrollmentNo?: string;
}
