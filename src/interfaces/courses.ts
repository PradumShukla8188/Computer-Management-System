export interface Topic {
  _id: string;
  name: string;
  description: string;
  moduleId: string;

}

export interface Module {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  topics: Topic[];

}

export interface Course {
  _id: string;
  name: string;
  shortName: string;
  description?: string;
  status: string;
  durationInMonths: number;
  monthlyFees: number;
  totalFees: number;
  modules: Module[];
  syllabus?: Module[];  // Optional property for backward compatibility
  createdAt: string;
}