import { SignupBody } from "../dto"

export interface UserInfoI {
    email: string,
    verificationCode: string
}

export type UserRegisterInfo = Omit<SignupBody, 'passwordConfirmation'>;
export type UserDocument = UserRegisterInfo & { isVerified: boolean, activationCode: string };