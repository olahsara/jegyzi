import { Education } from './eductaion.model';

/** Felhasználó kollekció */
export interface User {
  id: string;
  email: string;
  name: string;
  education?: Education;
  work?: Work;
  other?: Other;
  introduction?: string;
  profilePicture?: boolean;
  profileType?: string;
  followers: string[];
  follow: string[];
  followedNotes: string[];
  followersNumber: number;
  reviews: string[];
  notesNumber: number;
}

/** Felhasználó szűrő interfész */
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
