import { UserDocument, UserInfoI } from "../types"

export default interface AuthRepository {
    findByEmail(email: string): Promise<any>
    findByToken(token: string): Promise<any>
    createUser(userData: UserDocument): Promise<any>
    verifyEmail(token: string): Promise<any>
}