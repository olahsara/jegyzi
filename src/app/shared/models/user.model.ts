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
  profilePicture?: string;
  profileType?: string;
  followers: string[]; //user id
  follow: string[]; //user id
  followersNumber: number;
  reviews: string[]; //értékelés id
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
