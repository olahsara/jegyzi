import { Education } from "./eductaion.model"

export interface User {
    id: string,
    email: string,
    firstName? : string,
    lastName?: string,
    education?: Education,
    introduction?: string,
    profilePicture?: string,
    profileType?: string,
    followers: string[], //user id
    follow: string[], //user id
    followersNumber: number
}

export const ProfileTypes = {
    student: 'Tanuló',
    teacher: 'Tanár',
    admin: 'Admin',
    other: 'Egyéb'
}