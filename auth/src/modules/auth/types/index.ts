import { SignupBody } from "../dto"

export interface UserInfoI {
    email: string,
    verificationCode: string
}

export type UserDocument = Omit<SignupBody, 'passwordConfirmation'> & { isVerified: boolean, activationCode: string }