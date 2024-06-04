import { Education } from "./eductaion.model"

export interface User {
    id: string,
    email: string,
    name? : {
        firstName: string,
        lastName: string,
    }
    education?: Education,
    city?: string,
    introduction?: string,
    profilePicture?: string,
    profileType?: string,
    followers: string[], //user id
    follow: string[], //user id
    followersNumber: number

}