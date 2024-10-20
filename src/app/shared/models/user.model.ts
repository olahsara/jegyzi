import { Education } from './eductaion.model';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  education?: Education;
  work?: Work;
  other?: Other;
  introduction?: string;
  profilePicture?: boolean;
  profileType?: string;
  followers: string[]; //user id
  follow: string[]; //user id
  followedNotes: string[];
  //followedNotes: string[]; //note id
  followersNumber: number;
  reviews: string[]; //értékelés id
}

export interface UserFilterModel {
  name: string;
  numberOfNotes: number;
  numberOfFollowers: number;
  profileType: string;
  educationYear: number;
  educationType: string;
}

export const ProfileTypes = {
  student: 'Tanuló',
  teacher: 'Tanár',
  admin: 'Admin',
  other: 'Egyéb',
  work: 'Alkalmazott',
};

export interface Work {
  type: string;
  year: number;
  position: string;
  workPlace: string;
}

export interface Other {
  description: string;
}
