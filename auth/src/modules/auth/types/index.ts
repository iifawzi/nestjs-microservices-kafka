import { SignupBody } from "../dto"

export interface UserInfoI {
    userId: string,
    email: string,
    fullName: string,
    isVerified: boolean
    password?: string
}

export type UserInfoWithoutPassword = Omit<UserInfoI, 'password'>;
export type UserRegisterInfo = Omit<SignupBody, 'passwordConfirmation'>;
export type UserDocument = UserRegisterInfo & { isVerified: boolean, verificationCode: string };
