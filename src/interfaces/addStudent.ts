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
